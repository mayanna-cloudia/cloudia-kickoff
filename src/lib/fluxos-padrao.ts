// Fluxos padrão hardcoded por variação
// Pra customizar, edite os arrays nodes/edges abaixo

export type TipoNo =
  | "boas_vindas"
  | "boas-vindas"
  | "menu-pergunta"
  | "coleta-dado"
  | "decisao"
  | "acao-sistema"
  | "transferencia-humana"
  | "sucesso";

export type VariacaoFluxo = "chatgpt" | "integracao" | "chatgpt_integracao";

export const VARIACOES_LABEL: Record<VariacaoFluxo, string> = {
  chatgpt: "IA",
  integracao: "Apenas integração",
  chatgpt_integracao: "IA + Integração",
};

export const CORES_NO: Record<string, { bg: string; border: string }> = {
  "boas-vindas": { bg: "#d1fae5", border: "#10b981" },
  boas_vindas: { bg: "#d1fae5", border: "#10b981" },
  "menu-pergunta": { bg: "#dbeafe", border: "#3b82f6" },
  "coleta-dado": { bg: "#ede9fe", border: "#8b5cf6" },
  decisao: { bg: "#fef3c7", border: "#f59e0b" },
  "acao-sistema": { bg: "#f3e8ff", border: "#a855f7" },
  "transferencia-humana": { bg: "#ffe4e6", border: "#f43f5e" },
  sucesso: { bg: "#dcfce7", border: "#22c55e" },
};

export const LABELS_TIPO: Record<string, string> = {
  "boas-vindas": "Boas-vindas",
  boas_vindas: "Boas-vindas",
  "menu-pergunta": "Menu/Pergunta",
  "coleta-dado": "Coleta de dado",
  decisao: "Decisão",
  "acao-sistema": "Ação de sistema",
  "transferencia-humana": "Transferência humana",
  sucesso: "Sucesso",
};

export const TIPOS_NO: Array<{ tipo: TipoNo; label: string; cor: string; corBorda: string }> = [
  { tipo: "boas-vindas", label: "Boas-vindas", cor: CORES_NO["boas-vindas"].bg, corBorda: CORES_NO["boas-vindas"].border },
  { tipo: "menu-pergunta", label: "Menu/Pergunta", cor: CORES_NO["menu-pergunta"].bg, corBorda: CORES_NO["menu-pergunta"].border },
  { tipo: "coleta-dado", label: "Coleta de dado", cor: CORES_NO["coleta-dado"].bg, corBorda: CORES_NO["coleta-dado"].border },
  { tipo: "decisao", label: "Decisão", cor: CORES_NO["decisao"].bg, corBorda: CORES_NO["decisao"].border },
  { tipo: "acao-sistema", label: "Ação de sistema", cor: CORES_NO["acao-sistema"].bg, corBorda: CORES_NO["acao-sistema"].border },
  { tipo: "transferencia-humana", label: "Transferência humana", cor: CORES_NO["transferencia-humana"].bg, corBorda: CORES_NO["transferencia-humana"].border },
  { tipo: "sucesso", label: "Sucesso", cor: CORES_NO["sucesso"].bg, corBorda: CORES_NO["sucesso"].border },
];

export type FluxoData = {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: { tipo: string; titulo: string; descricao: string };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    sourceHandle?: string;
  }>;
};

export const FLUXOS_PADRAO: Record<string, FluxoData> = {
  chatgpt: {
    nodes: [
      {
        id: "boas-vindas-1",
        position: { x: 400, y: 0 },
        data: {
          tipo: "boas-vindas",
          titulo: "Boas-vindas",
          descricao: "Saudação e identificação automática.",
        },
      },
      {
        id: "coleta-nome",
        position: { x: 400, y: 140 },
        data: {
          tipo: "coleta-dado",
          titulo: "Nome do paciente",
          descricao: "Pergunta o nome completo.",
        },
      },
      {
        id: "coleta-problema",
        position: { x: 400, y: 280 },
        data: {
          tipo: "coleta-dado",
          titulo: "Descreva o problema",
          descricao: "IA conversa naturalmente com o paciente.",
        },
      },
      {
        id: "decisao-urgencia",
        position: { x: 400, y: 420 },
        data: {
          tipo: "decisao",
          titulo: "Urgência?",
          descricao: "Classifica gravidade via IA.",
        },
      },
      {
        id: "transferencia",
        position: { x: 200, y: 580 },
        data: {
          tipo: "transferencia-humana",
          titulo: "Atendimento humano",
          descricao: "Encaminha urgências à equipe.",
        },
      },
      {
        id: "sucesso-1",
        position: { x: 600, y: 580 },
        data: {
          tipo: "sucesso",
          titulo: "Agendado",
          descricao: "Confirma horário e envia lembretes.",
        },
      },
    ],
    edges: [
      { id: "e1", source: "boas-vindas-1", target: "coleta-nome" },
      { id: "e2", source: "coleta-nome", target: "coleta-problema" },
      { id: "e3", source: "coleta-problema", target: "decisao-urgencia" },
      { id: "e4", source: "decisao-urgencia", target: "transferencia", label: "Sim" },
      { id: "e5", source: "decisao-urgencia", target: "sucesso-1", label: "Não" },
    ],
  },

  integracao: {
    nodes: [
      {
        id: "boas-vindas-1",
        position: { x: 400, y: 0 },
        data: {
          tipo: "boas-vindas",
          titulo: "Boas-vindas",
          descricao: "Saudação inicial.",
        },
      },
      {
        id: "menu-paciente",
        position: { x: 400, y: 140 },
        data: {
          tipo: "menu-pergunta",
          titulo: "Já é paciente?",
          descricao: "Pergunta de identificação.",
        },
      },
      {
        id: "buscar-paciente",
        position: { x: 200, y: 300 },
        data: {
          tipo: "acao-sistema",
          titulo: "Buscar paciente",
          descricao: "Consulta cadastro no sistema integrado.",
        },
      },
      {
        id: "criar-paciente",
        position: { x: 600, y: 300 },
        data: {
          tipo: "acao-sistema",
          titulo: "Criar cadastro",
          descricao: "Coleta dados e cria no sistema.",
        },
      },
      {
        id: "agendar",
        position: { x: 400, y: 460 },
        data: {
          tipo: "acao-sistema",
          titulo: "Consultar agenda",
          descricao: "Busca horários disponíveis no sistema.",
        },
      },
      {
        id: "sucesso-1",
        position: { x: 400, y: 600 },
        data: {
          tipo: "sucesso",
          titulo: "Agendado",
          descricao: "Confirma e envia lembrete.",
        },
      },
    ],
    edges: [
      { id: "e1", source: "boas-vindas-1", target: "menu-paciente" },
      { id: "e2", source: "menu-paciente", target: "buscar-paciente", label: "Sim" },
      { id: "e3", source: "menu-paciente", target: "criar-paciente", label: "Não" },
      { id: "e4", source: "buscar-paciente", target: "agendar" },
      { id: "e5", source: "criar-paciente", target: "agendar" },
      { id: "e6", source: "agendar", target: "sucesso-1" },
    ],
  },

  chatgpt_integracao: {
    nodes: [
      {
        id: "boas-vindas-1",
        position: { x: 400, y: 0 },
        data: {
          tipo: "boas-vindas",
          titulo: "Boas-vindas",
          descricao: "Saudação com IA.",
        },
      },
      {
        id: "coleta-ia",
        position: { x: 400, y: 140 },
        data: {
          tipo: "coleta-dado",
          titulo: "Qualificação via IA",
          descricao: "IA pergunta o motivo e qualifica o paciente.",
        },
      },
      {
        id: "decisao-tipo",
        position: { x: 400, y: 290 },
        data: {
          tipo: "decisao",
          titulo: "Que especialidade?",
          descricao: "IA identifica área e convênio.",
        },
      },
      {
        id: "buscar-horario",
        position: { x: 400, y: 440 },
        data: {
          tipo: "acao-sistema",
          titulo: "Consultar agenda",
          descricao: "Busca horários no sistema integrado.",
        },
      },
      {
        id: "menu-confirmar",
        position: { x: 400, y: 580 },
        data: {
          tipo: "menu-pergunta",
          titulo: "Confirmar agendamento?",
          descricao: "Oferece opções de horário.",
        },
      },
      {
        id: "sucesso-1",
        position: { x: 400, y: 740 },
        data: {
          tipo: "sucesso",
          titulo: "Agendado",
          descricao: "Confirma e envia lembrete.",
        },
      },
    ],
    edges: [
      { id: "e1", source: "boas-vindas-1", target: "coleta-ia" },
      { id: "e2", source: "coleta-ia", target: "decisao-tipo" },
      { id: "e3", source: "decisao-tipo", target: "buscar-horario" },
      { id: "e4", source: "buscar-horario", target: "menu-confirmar" },
      { id: "e5", source: "menu-confirmar", target: "sucesso-1" },
    ],
  },
};