// Webhook do Pipedrive — quando uma atividade "Reunião de Kickoff" é criada
// num deal, criamos automaticamente o cliente no Cloudia.
//
// Como o Pipedrive autentica:
//  - aceitamos `?secret=...` na URL (mais simples de configurar) OU
//  - header `Authorization: Basic <base64(qualquer:SECRET)>`
//
// Payload do Pipedrive (Webhooks v2):
//  { meta: { action: "create", entity: "activity" }, data: { id, subject, deal_id, type, due_date, ... } }

import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function extractBasicPassword(auth: string | null): string | null {
  if (!auth || !auth.startsWith("Basic ")) return null;
  try {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(":");
    return idx >= 0 ? decoded.slice(idx + 1) : decoded;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/pipedrive-webhook")({
  server: {
    handlers: {
      GET: async () => {
        // Útil pra testar no navegador que a rota tá viva
        return Response.json({ ok: true, hint: "POST aqui com o webhook do Pipedrive" });
      },
      POST: async ({ request }) => {
        const secret = process.env.PIPEDRIVE_WEBHOOK_SECRET;
        if (!secret) {
          return new Response("PIPEDRIVE_WEBHOOK_SECRET não configurado", { status: 500 });
        }

        const url = new URL(request.url);
        const provided =
          url.searchParams.get("secret") ??
          extractBasicPassword(request.headers.get("authorization"));
        if (provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const action: string = payload?.meta?.action ?? payload?.event ?? "";
        const entity: string =
          payload?.meta?.entity ?? payload?.meta?.object ?? "";

        // Pipedrive Webhooks v2: action "create" / entity "activity"
        // Webhooks v1 (legado): event "added.activity"
        const isActivityCreate =
          (entity === "activity" && (action === "create" || action === "added")) ||
          action === "added.activity";

        if (!isActivityCreate) {
          return Response.json({ ignored: true, reason: `não é activity.create (action=${action}, entity=${entity})` });
        }

        const activity = payload?.data ?? payload?.current ?? {};
        const subject: string = activity?.subject ?? "";

        // Filtra só atividades de kickoff
        if (!/kickoff/i.test(subject)) {
          return Response.json({ ignored: true, reason: `subject não contém 'kickoff': ${subject}` });
        }

        const dealId = activity?.deal_id;
        if (!dealId) {
          return Response.json({ ignored: true, reason: "atividade sem deal_id" });
        }

        // Busca o deal pra pegar o nome da organização
        const apiToken = process.env.PIPEDRIVE_API_TOKEN;
        const domain = process.env.PIPEDRIVE_DOMAIN;
        if (!apiToken || !domain) {
          return Response.json(
            { ok: false, error: "PIPEDRIVE_API_TOKEN ou PIPEDRIVE_DOMAIN não configurado" },
            { status: 500 },
          );
        }

        const dealRes = await fetch(
          `https://${domain}.pipedrive.com/api/v1/deals/${dealId}?api_token=${encodeURIComponent(apiToken)}`,
        );
        const dealJson: any = await dealRes.json().catch(() => ({}));
        if (!dealRes.ok || !dealJson?.data) {
          return Response.json(
            { ok: false, error: `Falha ao buscar deal ${dealId}: ${JSON.stringify(dealJson?.error ?? dealJson)}` },
            { status: 502 },
          );
        }
        const deal = dealJson.data;

        // Busca o campo customizado "Idclinic" (em Detalhes > CS no Pipedrive)
        // Custom fields vêm como hash key no objeto do deal, então precisamos
        // descobrir a chave dinamicamente via /dealFields.
        let idclinic: number | null = null;
        try {
          const fieldsRes = await fetch(
            `https://${domain}.pipedrive.com/api/v1/dealFields?api_token=${encodeURIComponent(apiToken)}`,
          );
          const fieldsJson: any = await fieldsRes.json().catch(() => ({}));
          const idclinicField = (fieldsJson?.data ?? []).find(
            (f: any) => typeof f?.name === "string" && f.name.toLowerCase() === "idclinic",
          );
          if (idclinicField?.key && deal[idclinicField.key] != null && deal[idclinicField.key] !== "") {
            const raw = deal[idclinicField.key];
            const parsed = typeof raw === "number" ? raw : parseInt(String(raw), 10);
            if (!Number.isNaN(parsed)) idclinic = parsed;
          }
        } catch (e) {
          console.warn("Falha ao buscar dealFields:", e);
        }

        if (idclinic == null) {
          return Response.json(
            {
              ok: false,
              error:
                "Campo 'Idclinic' não encontrado ou vazio no deal. Preencha em Detalhes > CS > Idclinic no Pipedrive antes de criar a atividade de kickoff.",
              dealId,
            },
            { status: 422 },
          );
        }

        const nome: string =
          deal.org_name ?? deal.title ?? deal.person_name ?? `Deal ${dealId}`;
        const dealUrl = `https://${domain}.pipedrive.com/deal/${dealId}`;

        // Idempotência: se já existe cliente com esse deal, não duplica
        const { data: existing } = await supabaseAdmin
          .from("clientes")
          .select("id, nome")
          .eq("pipedrive_lead_id", dealUrl)
          .maybeSingle();
        if (existing) {
          return Response.json({
            ok: true,
            ignored: true,
            reason: "cliente já existe pra esse deal",
            clienteId: existing.id,
          });
        }

        const { data: novo, error } = await supabaseAdmin
          .from("clientes")
          .insert({
            nome,
            idclinic,
            medico_contato: deal.person_name ?? null,
            pipedrive_lead_id: dealUrl,
            status: "ativo",
          })
          .select("id, nome, idclinic")
          .single();

        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        return Response.json({
          ok: true,
          clienteId: novo.id,
          nome: novo.nome,
          dealUrl,
          activitySubject: subject,
        });
      },
    },
  },
});
