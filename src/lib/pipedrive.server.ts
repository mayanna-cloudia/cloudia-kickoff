// Helpers para montar resumo da kickoff e enviar para o Pipedrive.
// Server-only.

export type KickoffSummaryInput = {
  cliente: any;
  kickoff: any;
  kickoffUrl: string;
};

export function buildResumoMarkdown({ cliente, kickoff, kickoffUrl }: KickoffSummaryInput): string {
  const v = kickoff.validacoes_contratuais ?? {};
  const m = kickoff.mapeamento ?? {};
  const parts = kickoff.participantes_cliente ?? {};

  const validacoes = Object.entries(v)
    .map(([k, val]: any) => `- ${k}: ${val?.confirmado ? "✅ confirmado" : "⚠️ pendente"}${val?.observacao ? ` — ${val.observacao}` : ""}`)
    .join("\n") || "- (nenhuma)";

  const mapeamento = Object.entries(m)
    .filter(([, val]) => val)
    .map(([k, val]: any) => `- **${k}**: ${typeof val === "string" ? val : JSON.stringify(val)}`)
    .join("\n") || "- (nenhuma resposta preenchida)";

  const data = kickoff.data_reuniao ? new Date(kickoff.data_reuniao).toLocaleDateString("pt-BR") : "—";

  return `# Resumo da Kickoff — ${cliente.nome}

**Data da reunião:** ${data}
**Gerente:** ${cliente.gerente ?? "—"}
**Configurador:** ${cliente.configurador ?? "—"}
**Especialidade:** ${cliente.especialidade ?? "—"}
**Plano:** ${cliente.plano ?? "—"}

## Participantes do cliente
${parts && typeof parts === "object" && !Array.isArray(parts)
  ? `- Responsável pela implementação: ${kickoff.ferias_programadas ?? "—"}\n- Operador de atendimento: ${parts.operador_atendimento ?? "—"}`
  : "- (não registrado)"}

## Validações contratuais
${validacoes}

## Desafio principal
${kickoff.desafio_principal ?? "—"}

## Expectativa / pendências
${kickoff.expectativa ?? "—"}

## Mapeamento do robô
${mapeamento}

## Demonstração
- Variação apresentada: **${kickoff.variacao_demo ?? "—"}**

## Notas internas
${kickoff.notas_internas ?? "—"}

---
🔗 [Abrir kickoff completo](${kickoffUrl})
`;
}

export async function postPipedriveNote(params: {
  dealOrLeadId: string;
  content: string;
}): Promise<{ ok: true; noteId: number } | { ok: false; error: string }> {
  const token = process.env.PIPEDRIVE_API_TOKEN;
  const domain = process.env.PIPEDRIVE_DOMAIN;
  if (!token) return { ok: false, error: "PIPEDRIVE_API_TOKEN não configurado" };
  if (!domain) return { ok: false, error: "PIPEDRIVE_DOMAIN não configurado" };

  // Decide se é UUID (lead) ou numérico (deal)
  const isLead = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(params.dealOrLeadId);
  const body: Record<string, any> = { content: params.content };
  if (isLead) {
    body.lead_id = params.dealOrLeadId;
  } else {
    const n = Number(params.dealOrLeadId);
    if (!Number.isFinite(n)) return { ok: false, error: `pipedrive_lead_id inválido: ${params.dealOrLeadId}` };
    body.deal_id = n;
  }

  const url = `https://${domain}.pipedrive.com/api/v1/notes?api_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    return { ok: false, error: `Pipedrive [${res.status}]: ${JSON.stringify(json?.error ?? json)}` };
  }
  return { ok: true, noteId: json?.data?.id };
}
