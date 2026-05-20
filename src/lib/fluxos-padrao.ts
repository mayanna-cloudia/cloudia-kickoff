import type { Node, Edge } from "@xyflow/react";

export type VariacaoFluxo = "chatgpt" | "integracao" | "chatgpt_integracao";

export type TipoNo =
  | "boas_vindas"
  | "menu"
  | "coleta"
  | "decisao"
  | "acao"
  | "transferencia"
  | "sucesso";

export const TIPOS_NO: { tipo: TipoNo; label: string; cor: string; corBorda: string }[] = [
  { tipo: "boas_vindas", label: "Boas-vindas", cor: "#dcfce7", corBorda: "#86efac" },
  { tipo: "menu", label: "Menu/Pergunta", cor: "#dbeafe", corBorda: "#93c5fd" },
  { tipo: "coleta", label: "Coleta de dado", cor: "#ede9fe", corBorda: "#c4b5fd" },
  { tipo: "decisao", label: "Decisão", cor: "#fef9c3", corBorda: "#fde047" },
  { tipo: "acao", label: "Ação de sistema", cor: "#f3e8ff", corBorda: "#d8b4fe" },
  { tipo: "transferencia", label: "Transferência humana", cor: "#fee2e2", corBorda: "#fca5a5" },
  { tipo: "sucesso", label: "Sucesso", cor: "#bbf7d0", corBorda: "#4ade80" },
];

export const CORES_NO: Record<TipoNo, { bg: string; border: string }> = Object.fromEntries(
  TIPOS_NO.map((t) => [t.tipo, { bg: t.cor, border: t.corBorda }])
) as Record<TipoNo, { bg: string; border: string }>;

export const LABELS_TIPO: Record<TipoNo, string> = Object.fromEntries(
  TIPOS_NO.map((t) => [t.tipo, t.label])
) as Record<TipoNo, string>;

const mkNo = (
  id: string,
  tipo: TipoNo,
  titulo: string,
  descricao: string,
  x: number,
  y: number
): Node => ({
  id,
  type: "fluxo",
  position: { x, y },
  data: { tipo, titulo, descricao },
});

const fluxoChatgpt = {
  nodes: [
    mkNo("1", "boas_vindas", "Boas-vindas", "Olá! Sou o assistente virtual da clínica.", 250, 0),
    mkNo("2", "coleta", "Nome do paciente", "Coleta o nome para personalizar o atendimento.", 250, 130),
    mkNo("3", "coleta", "Descreva o problema", "Pede ao paciente para descrever a queixa.", 250, 260),
    mkNo("4", "decisao", "É urgência?", "Classifica via IA se o caso é urgente.", 250, 390),
    mkNo("5", "transferencia", "Transferir humano", "Encaminha para a equipe agora.", 0, 540),
    mkNo("6", "sucesso", "Agendamento sugerido", "Sugere horários disponíveis.", 500, 540),
  ] as Node[],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5", label: "Sim" },
    { id: "e4-6", source: "4", target: "6", label: "Não" },
  ] as Edge[],
};

const fluxoIntegracao = {
  nodes: [
    mkNo("1", "boas_vindas", "Boas-vindas", "Saudação inicial e identificação.", 250, 0),
    mkNo("2", "menu", "Já é paciente?", "Pergunta se o contato já tem cadastro.", 250, 130),
    mkNo("3", "acao", "Buscar no sistema", "Consulta cadastro existente via integração.", 0, 280),
    mkNo("4", "acao", "Criar cadastro", "Cria novo paciente no sistema.", 500, 280),
    mkNo("5", "coleta", "Confirmar dados", "Confirma nome, CPF e telefone.", 250, 430),
    mkNo("6", "sucesso", "Agendamento", "Direciona para escolha de horário.", 250, 560),
  ] as Node[],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3", label: "Sim" },
    { id: "e2-4", source: "2", target: "4", label: "Não" },
    { id: "e3-5", source: "3", target: "5" },
    { id: "e4-5", source: "4", target: "5" },
    { id: "e5-6", source: "5", target: "6" },
  ] as Edge[],
};

const fluxoChatgptIntegracao = {
  nodes: [
    mkNo("1", "boas_vindas", "Boas-vindas", "Saudação e identificação automática.", 250, 0),
    mkNo("2", "acao", "Buscar paciente", "Tenta localizar no sistema via WhatsApp.", 250, 130),
    mkNo("3", "coleta", "Descreva o problema", "IA conversa naturalmente com o paciente.", 250, 260),
    mkNo("4", "decisao", "Urgência?", "Classifica gravidade via IA.", 250, 390),
    mkNo("5", "transferencia", "Atendimento humano", "Encaminha urgências à equipe.", 0, 540),
    mkNo("6", "acao", "Consultar agenda", "Busca horários disponíveis no sistema.", 500, 540),
    mkNo("7", "sucesso", "Agendado", "Confirma horário e envia lembretes.", 500, 670),
  ] as Node[],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5", label: "Sim" },
    { id: "e4-6", source: "4", target: "6", label: "Não" },
    { id: "e6-7", source: "6", target: "7" },
  ] as Edge[],
};

export const FLUXOS_PADRAO: Record<VariacaoFluxo, { nodes: Node[]; edges: Edge[] }> = {
  chatgpt: fluxoChatgpt,
  integracao: fluxoIntegracao,
  chatgpt_integracao: fluxoChatgptIntegracao,
};

export const VARIACOES_LABEL: Record<VariacaoFluxo, string> = {
  chatgpt: "100% ChatGPT",
  integracao: "Apenas integração",
  chatgpt_integracao: "ChatGPT + integração",
};
