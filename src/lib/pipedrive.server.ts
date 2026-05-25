// Helpers para montar resumo da kickoff e enviar para o Pipedrive.
// Server-only.

export type KickoffSummaryInput = {
  cliente: any;
  kickoff: any;
  kickoffUrl: string;
};

const VARIACAO_LABEL: Record<string, string> = {
  chatgpt: "100% IA",
  integracao: "Apenas integração",
  chatgpt_integracao: "IA + Integração",
};

const MAPEAMENTO_PERGUNTAS: Record<string, string> = {
  unidades: "Tem mais de uma unidade?",
  sistema_agendamento: "Usa algum sistema de agendamento?",
  especialidades_profissionais: "Quais especialidades e profissionais de cada uma?",
  tipos_servico: "Que tipo de serviço a clínica oferece?",
  convenios: "Atende convênios?",
  clinicorp_horarios: "Os horários dos profissionais já estão cadastrados no Clinicorp?",
  clinicorp_horarios_diferentes: "As especialidades têm horários diferentes?",
  clinicorp_migracao: "Está em processo de migração de outro sistema?",
};

const VALIDACAO_LABEL: Record<string, string> = {
  plano: "Plano contratado",
  mensalidade: "Mensalidade",
  num_usuarios: "Número de usuários",
  creditos: "Créditos",
  integracao: "Integração",
  whatsapp_tipo: "Tipo de WhatsApp",
  migracao_api: "Migração de API de WhatsApp",
};

function formatarResposta(val: any): string | null {
  if (val == null || val === "") return null;
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    return String(val);
  }
  if (typeof val === "object") {
    // SimNao { resposta, detalhe }
    if ("resposta" in val) {
      if (!val.resposta) return null;
      const base = val.resposta === "sim" ? "Sim" : "Não";
      return val.detalhe ? `${base} — ${val.detalhe}` : base;
    }
    // Validação { confirmado, valor }
    if ("valor" in val) {
      if (val.valor == null || val.valor === "") return null;
      return val.confirmado ? `${val.valor} ✅` : `${val.valor} (não confirmado)`;
    }
  }
  return null;
}

export function buildResumoMarkdown({ cliente, kickoff, kickoffUrl }: KickoffSummaryInput): string {
  const v = kickoff.validacoes_contratuais ?? {};
  const m = kickoff.mapeamento ?? {};

  const data = kickoff.data_reuniao
    ? new Date(kickoff.data_reuniao).toLocaleDateString("pt-BR")
    : "—";

  const variacao = VARIACAO_LABEL[kickoff.variacao_demo] ?? kickoff.variacao_demo ?? "—";

  // Validações em formato narrativo
  const validacoesLinhas = Object.entries(VALIDACAO_LABEL)
    .map(([key, label]) => {
      const formatted = formatarResposta(v[key]);
      return formatted ? `- **${label}:** ${formatted}` : null;
    })
    .filter(Boolean)
    .join("\n");

  // Mapeamento: pergunta + resposta natural
  const mapeamentoLinhas = Object.entries(MAPEAMENTO_PERGUNTAS)
    .map(([key, pergunta]) => {
      const formatted = formatarResposta(m[key]);
      return formatted ? `**${pergunta}**\n${formatted}` : null;
    })
    .filter(Boolean)
    .join("\n\n");

  const responsavel = kickoff.ferias_programadas ?? "—";
  const operador = kickoff.participantes_cliente?.operador_atendimento ?? "—";

  const partes: string[] = [];

  partes.push(`# Resumo da kickoff — ${cliente.nome}`);
  partes.push("");
  partes.push(
    `Reunião realizada em **${data}**, conduzida por ${cliente.gerente ?? "—"} (gerente) e ${
      cliente.configurador ?? "—"
    } (configurador).`,
  );

  if (kickoff.notas_internas) {
    partes.push("");
    partes.push(`## Quem estava na reunião`);
    partes.push(kickoff.notas_internas);
  }

  partes.push("");
  partes.push("## Pessoas-chave do cliente");
  partes.push(`- **Responsável pela implementação:** ${responsavel}`);
  partes.push(`- **Quem opera o atendimento hoje:** ${operador}`);

  if (validacoesLinhas) {
    partes.push("");
    partes.push("## O que foi validado do contrato");
    partes.push(validacoesLinhas);
  }

  if (kickoff.desafio_principal) {
    partes.push("");
    partes.push("## Principais desafios e expectativas");
    partes.push(kickoff.desafio_principal);
  }

  if (mapeamentoLinhas) {
    partes.push("");
    partes.push("## Mapeamento da clínica");
    partes.push(mapeamentoLinhas);
  }

  partes.push("");
  partes.push("## Demonstração apresentada");
  partes.push(`Variação mostrada para o cliente: **${variacao}**.`);

  if (kickoff.expectativa) {
    partes.push("");
    partes.push("## Pendências da reunião");
    partes.push(kickoff.expectativa);
  }

  if (kickoff.notas_internas && false) {
    // already used above
  }

  partes.push("");
  partes.push("---");
  partes.push(`🔗 [Abrir kickoff completa no Cloudia](${kickoffUrl})`);

  return partes.join("\n");
}

/**
 * Aceita:
 *  - URL completa: https://cloudia-1a6571.pipedrive.com/deal/75189
 *  - URL de lead: https://xxx.pipedrive.com/leads/<uuid>
 *  - ID numérico (deal) ou UUID (lead)
 */
function parsePipedriveRef(input: string): {
  kind: "deal" | "lead";
  id: string;
  domain?: string;
} | { error: string } {
  const raw = input.trim();
  if (!raw) return { error: "Informe o link ou ID do Pipedrive" };

  // URL?
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      const host = url.hostname; // ex.: cloudia-1a6571.pipedrive.com
      const domain = host.endsWith(".pipedrive.com") ? host.replace(".pipedrive.com", "") : undefined;
      const segs = url.pathname.split("/").filter(Boolean);
      // /deal/75189  ou  /leads/<uuid>
      const idx = segs.findIndex((s) => s === "deal" || s === "deals" || s === "lead" || s === "leads");
      if (idx >= 0 && segs[idx + 1]) {
        const id = segs[idx + 1];
        const kind: "deal" | "lead" = segs[idx].startsWith("lead") ? "lead" : "deal";
        return { kind, id, domain };
      }
      return { error: `URL do Pipedrive não reconhecida: ${raw}` };
    } catch {
      return { error: `URL inválida: ${raw}` };
    }
  }

  // UUID (lead)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(raw)) return { kind: "lead", id: raw };
  // Numérico (deal)
  if (/^\d+$/.test(raw)) return { kind: "deal", id: raw };

  return { error: `Formato não reconhecido: ${raw}` };
}

export async function postPipedriveNote(params: {
  dealOrLeadId: string;
  content: string;
}): Promise<{ ok: true; noteId: number } | { ok: false; error: string }> {
  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token) return { ok: false, error: "PIPEDRIVE_API_TOKEN não configurado" };

  const parsed = parsePipedriveRef(params.dealOrLeadId);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const domain = parsed.domain ?? process.env.PIPEDRIVE_DOMAIN;
  if (!domain) return { ok: false, error: "Domínio do Pipedrive não encontrado (use a URL completa ou configure PIPEDRIVE_DOMAIN)" };

  const body: Record<string, any> = { content: params.content };
  if (parsed.kind === "lead") {
    body.lead_id = parsed.id;
  } else {
    const n = Number(parsed.id);
    if (!Number.isFinite(n)) return { ok: false, error: `Deal ID inválido: ${parsed.id}` };
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
