import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Check,
  Phone,
  Mail,
  Users,
  Calendar,
  Bot,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

type Cliente = {
  id: string;
  nome: string;
  especialidade: string | null;
  gerente: string | null;
  configurador: string | null;
  plano: string | null;
  mensalidade: number | null;
  num_usuarios: number | null;
  vencimento_dia: number | null;
  forma_pagamento: string | null;
  medico_contato: string | null;
};

type KickoffData = {
  participantes_cliente: any;
  validacoes_contratuais: any;
  ferias_programadas: string | null;
  desafio_principal: string | null;
  expectativa: string | null;
  mapeamento: any;
  variacao_demo: string | null;
  mensagens_demo: any;
  notas_internas: string | null;
};

type StepProps = {
  cliente: Cliente;
  data: KickoffData;
  setData: (patch: Partial<KickoffData>) => void;
  modoApresentacao: boolean;
};

// ---------- PASSO 1: Boas-vindas ----------
export function Passo1BoasVindas({ cliente, modoApresentacao }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto text-center py-8">
      <h1 className={modoApresentacao ? "text-5xl font-semibold tracking-tight" : "text-3xl font-semibold"}>
        Bem-vindos à <span className="text-cloudia">Cloudia</span>
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {cliente.nome}
      </p>

      <Card className="mt-10 p-6 border-border text-left">
        <p className="text-sm text-muted-foreground mb-4">Sou seu ponto de contato principal durante toda a implantação.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Gerente de contas</div>
            <div className="text-base font-medium mt-1">{cliente.gerente ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Configurador atribuído</div>
            <div className="text-base font-medium mt-1">{cliente.configurador ?? "—"}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---------- PASSO 2: Quem é quem ----------
export function Passo2QuemEhQuem({ cliente, data, setData, modoApresentacao }: StepProps) {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Quem é quem na jornada</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Apresentação dos contatos durante toda a implantação.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-5 border-border">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Antes</div>
          <div className="font-medium">Vendedor</div>
          <p className="text-xs text-muted-foreground mt-1">Já cumpriu seu papel até aqui.</p>
        </Card>
        <Card className="p-5 border-cloudia/40 bg-cloudia/5">
          <div className="text-xs uppercase tracking-wide text-cloudia mb-2">Agora</div>
          <div className="font-medium">Implantação</div>
          <p className="text-xs text-muted-foreground mt-1">
            {cliente.gerente ?? "Gerente"} (estratégico) + {cliente.configurador ?? "Configurador"} (técnico)
          </p>
        </Card>
        <Card className="p-5 border-border">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Depois</div>
          <div className="font-medium">Suporte Cloudia</div>
          <p className="text-xs text-muted-foreground mt-1">Após implantação, no mesmo WhatsApp.</p>
        </Card>
      </div>

      {!modoApresentacao && (
        <Card className="p-5 border-border">
          <Label className="text-sm">Quem está na reunião? Função na clínica?</Label>
          <Textarea
            value={data.notas_internas ?? ""}
            onChange={(e) => setData({ notas_internas: e.target.value })}
            placeholder="Ex.: Dr. João Silva (responsável pela implantação), Maria (atendente que vai usar o sistema)"
            className="mt-2"
            rows={3}
          />
        </Card>
      )}
    </div>
  );
}

// ---------- PASSO 3: Combinados da reunião ----------
export function Passo3Combinados() {
  const topicos = [
    "Validação do que foi contratado",
    "Cronograma de implementação",
    "Diretrizes da implantação",
    "Mapeamento da clínica",
    "Demonstração do robô",
    "Próximos passos e dúvidas",
  ];
  return (
    <div className="max-w-3xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Como vai ser nossa reunião</h2>
      <p className="text-sm text-muted-foreground mb-8">Duração de 45min a 1h.</p>

      <Card className="p-6 border-border">
        <ul className="space-y-3">
          {topicos.map((t, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {i + 1}
              </div>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ---------- PASSO 4: Validação contratual ----------
export function Passo4ValidacaoContratual({ cliente, data, setData, modoApresentacao }: StepProps) {
  const campos = [
    { key: "plano", label: "Plano", valor: cliente.plano ?? "—" },
    {
      key: "mensalidade",
      label: "Mensalidade",
      valor: cliente.mensalidade ? `R$ ${cliente.mensalidade.toFixed(2)}` : "—",
      sublabel: "Recorrência independente da usabilidade",
    },
    { key: "num_usuarios", label: "Usuários", valor: cliente.num_usuarios?.toString() ?? "—" },
    {
      key: "vencimento_dia",
      label: "Vencimento",
      valor: cliente.vencimento_dia ? `Dia ${cliente.vencimento_dia}` : "—",
    },
    { key: "forma_pagamento", label: "Pagamento", valor: cliente.forma_pagamento ?? "—" },
  ];

  const validacoes = data.validacoes_contratuais ?? {};

  const confirmar = (campo: string) => {
    setData({
      validacoes_contratuais: {
        ...validacoes,
        [campo]: {
          confirmado: true,
          confirmado_em: new Date().toISOString(),
        },
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Validação contratual</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Confirme com o cliente cada item do contrato.
      </p>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {campos.map((c) => {
          const confirmado = validacoes[c.key]?.confirmado;
          return (
            <Card
              key={c.key}
              className={`p-4 border ${confirmado ? "border-emerald-500/40 bg-emerald-50/40" : "border-border"}`}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{c.label}</div>
              <div className="text-base font-medium">{c.valor}</div>
              {c.sublabel && <div className="text-[10px] text-muted-foreground mt-1">{c.sublabel}</div>}
              {!modoApresentacao && (
                <Button
                  type="button"
                  size="sm"
                  variant={confirmado ? "ghost" : "outline"}
                  onClick={() => confirmar(c.key)}
                  disabled={confirmado}
                  className="mt-3 w-full text-xs"
                >
                  {confirmado ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> Confirmado
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Confirmar
                    </>
                  )}
                </Button>
              )}
              {confirmado && modoApresentacao && (
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Confirmado
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="p-4 border-amber-200 bg-amber-50/50">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900">
            A cobrança recorrente começa na data do contrato, <strong>independente do uso da plataforma</strong>.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ---------- PASSO 5: Cronograma ----------
export function Passo5Cronograma({ data, setData, modoApresentacao }: StepProps) {
  const etapas = [
    { icon: PhoneCall, titulo: "Kickoff", prazo: "Hoje", atual: true },
    { icon: Check, titulo: "1ª Configuração", prazo: "Até 7 dias úteis", atual: false },
    { icon: AlertCircle, titulo: "Alterações", prazo: "Até 7 dias úteis", atual: false },
    { icon: Users, titulo: "Treinamento", prazo: "3ª semana", atual: false },
    { icon: CheckCircle2, titulo: "Finalização", prazo: "4ª semana", atual: false },
  ];

  const diretrizes = [
    { titulo: "Participação", texto: "Implantação dura ~30 dias. Vocês devem estar usando 100% da plataforma." },
    { titulo: "Responsável", texto: "Nós configuramos. Indicamos uma pessoa-chave do seu lado." },
    { titulo: "Comunicação", texto: "Todo contato será via WhatsApp." },
    { titulo: "Pontualidade", texto: "45min-1h com 10min de tolerância." },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Cronograma de implementação</h2>
      <p className="text-sm text-muted-foreground mb-8">Visão geral do processo de ~30 dias.</p>

      <div className="grid grid-cols-5 gap-3 mb-8">
        {etapas.map((e, i) => {
          const Icon = e.icon;
          return (
            <Card
              key={i}
              className={`p-4 border ${e.atual ? "border-cloudia bg-cloudia/5" : "border-border"}`}
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${e.atual ? "bg-cloudia text-white" : "bg-muted text-muted-foreground"} mb-3`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{e.titulo}</div>
              <div className="text-xs text-muted-foreground mt-1">{e.prazo}</div>
            </Card>
          );
        })}
      </div>

      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">Diretrizes</h3>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {diretrizes.map((d, i) => (
          <Card key={i} className="p-4 border-border">
            <div className="text-sm font-medium mb-1">{d.titulo}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{d.texto}</div>
          </Card>
        ))}
      </div>

      {!modoApresentacao && (
        <Card className="p-5 border-border">
          <Label>Tem férias programadas nos próximos dois meses?</Label>
          <Input
            value={data.ferias_programadas ?? ""}
            onChange={(e) => setData({ ferias_programadas: e.target.value })}
            placeholder="Ex.: 15 a 25 de junho"
            className="mt-2"
          />
        </Card>
      )}
    </div>
  );
}

// ---------- PASSO 6: Demonstração ao vivo ----------
const DEMOS = {
  chatgpt: {
    label: "100% ChatGPT",
    desc: "O robô conduz toda a conversa via IA. Sua equipe entra só se o paciente pedir atendente humano.",
    mensagens: [
      { from: "paciente", texto: "Bom dia!", hora: "10:37" },
      { from: "robo", texto: "Oi, tudo bem? Sou da Clínica Dr. Exemplo 👋 Como posso te ajudar hoje?", hora: "10:38" },
      { from: "paciente", texto: "Quero marcar uma consulta", hora: "10:38" },
      { from: "robo", texto: "Claro! Você já é nossa paciente?", hora: "10:38" },
      { from: "paciente", texto: "Primeira vez", hora: "10:39" },
      { from: "robo", texto: "Pode me dizer seu nome completo e o que está sentindo?", hora: "10:39" },
    ],
  },
  integracao: {
    label: "Apenas integração",
    desc: "O robô usa integração com seu sistema para buscar horários e confirmar agendamentos.",
    mensagens: [
      { from: "paciente", texto: "Oi, quero remarcar minha consulta", hora: "14:20" },
      { from: "robo", texto: "Olá Maria! Vejo sua consulta para 25/05 às 14h. Pra qual data prefere mover?", hora: "14:20" },
      { from: "paciente", texto: "Próxima semana de manhã", hora: "14:21" },
      { from: "robo", texto: "Tenho horários disponíveis: terça 28/05 às 9h ou quinta 30/05 às 10h. Qual prefere?", hora: "14:21" },
    ],
  },
  chatgpt_integracao: {
    label: "ChatGPT + integração",
    desc: "Combinação: o robô qualifica o paciente com IA e integra com seu sistema para agendar.",
    mensagens: [
      { from: "paciente", texto: "Tô com uma dor de cabeça forte há 3 dias", hora: "16:10" },
      { from: "robo", texto: "Sinto muito, Maria. Vou te ajudar a marcar com um neurologista. Você tem convênio ou prefere particular?", hora: "16:10" },
      { from: "paciente", texto: "Tenho Unimed", hora: "16:11" },
      { from: "robo", texto: "Perfeito. Encontrei horário com Dr. Silva (neuro) amanhã às 14h. Posso confirmar?", hora: "16:11" },
    ],
  },
};

export function Passo6DemoAoVivo({ data, setData, modoApresentacao }: StepProps) {
  const variacaoAtual = (data.variacao_demo ?? "chatgpt") as keyof typeof DEMOS;
  const demo = DEMOS[variacaoAtual];

  return (
    <div className="max-w-6xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Como a Cloudia vai funcionar pra sua clínica</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Sua paciente no WhatsApp à esquerda, sua equipe na Central de Mensagens à direita.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(Object.keys(DEMOS) as Array<keyof typeof DEMOS>).map((k) => (
          <button
            key={k}
            onClick={() => setData({ variacao_demo: k })}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              variacaoAtual === k
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {DEMOS[k].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4 items-start">
        {/* Coluna esquerda: WhatsApp do paciente */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <Phone className="h-3 w-3" /> O que sua paciente vê
          </div>
          <div className="bg-[#0d1418] rounded-[24px] p-2">
            <div className="bg-[#efeae2] rounded-[18px] overflow-hidden h-[480px] flex flex-col">
              <div className="bg-[#008069] text-white px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-xs font-medium">
                  DE
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium">Clínica Dr. Exemplo</div>
                  <div className="text-[9px] opacity-85">online</div>
                </div>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-hidden">
                {demo.mensagens.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-md px-2 py-1.5 max-w-[80%] shadow-sm ${
                      m.from === "paciente"
                        ? "bg-[#d9fdd3] self-end"
                        : "bg-white self-start"
                    }`}
                  >
                    <p className="text-[11px] text-[#111b21] leading-snug">{m.texto}</p>
                    <p className="text-[8px] text-[#667781] text-right mt-0.5">
                      {m.hora} {m.from === "paciente" && "✓✓"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita: Central de Mensagens (tema escuro fiel) */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <MessageCircle className="h-3 w-3" /> O que sua equipe vê na Central de Mensagens
          </div>
          <div className="bg-[#1e2330] rounded-lg overflow-hidden grid grid-cols-[1fr_180px] min-h-[480px]">
            {/* Chat principal */}
            <div className="flex flex-col border-r border-[#2a3142]">
              {/* Header */}
              <div className="bg-[#1e2330] px-4 py-2.5 flex items-center gap-2.5 border-b border-[#2a3142]">
                <div className="w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  DE
                </div>
                <div className="text-sm font-medium text-gray-200">Denise Almeida</div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">BOT</span>
                </div>
              </div>

              {/* Mensagens */}
              <div
                className="flex-1 p-3 flex flex-col gap-2.5"
                style={{
                  background: "#14171f",
                  backgroundImage: "radial-gradient(circle, #1a1f2e 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="text-center">
                  <span className="bg-[#2a3142] text-gray-400 text-[10px] px-2.5 py-0.5 rounded-full">Hoje</span>
                </div>

                {demo.mensagens.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-md px-2.5 py-1.5 max-w-[85%] ${
                      m.from === "robo" ? "bg-blue-600 self-end" : "bg-[#2a3142] self-start"
                    }`}
                  >
                    {m.from === "robo" && (
                      <p className="text-[10px] text-blue-200 font-medium flex items-center gap-1 mb-0.5">
                        <Bot className="h-3 w-3" /> Cloudia
                      </p>
                    )}
                    <p className={`text-[11px] leading-snug ${m.from === "robo" ? "text-white" : "text-gray-200"}`}>
                      {m.texto}
                    </p>
                    <p
                      className={`text-[9px] text-right mt-0.5 ${
                        m.from === "robo" ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {m.hora} {m.from === "robo" && "✓✓"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="bg-[#1e2330] px-3 py-2 border-t border-[#2a3142]">
                <div className="bg-[#14171f] rounded px-2.5 py-1.5 text-[11px] text-gray-600">
                  Digite uma mensagem...
                </div>
              </div>
            </div>

            {/* Painel de contato */}
            <div className="bg-[#14171f] p-3 flex flex-col gap-2.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Dados do contato</p>
              <div className="flex flex-col items-center gap-1.5 py-2">
                <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-lg font-medium">
                  D
                </div>
                <div className="text-xs font-medium text-gray-200">Denise Almeida</div>
                <div className="text-[10px] text-gray-400">55 11 98888-7777</div>
              </div>
              <div className="bg-[#1e2330] rounded-md px-2.5 py-2">
                <div className="text-[9px] text-gray-500 uppercase mb-0.5">Atribuído a</div>
                <div className="text-[11px] text-gray-200">Robô Cloudia</div>
              </div>
              <div className="bg-[#1e2330] rounded-md px-2.5 py-2">
                <div className="text-[9px] text-gray-500 uppercase mb-0.5">Etapa</div>
                <div className="text-[11px] text-gray-200">Triagem</div>
              </div>
              <div className="bg-[#1e2330] rounded-md px-2.5 py-2">
                <div className="text-[9px] text-gray-500 uppercase mb-0.5">Origem</div>
                <div className="text-[11px] text-gray-200">WhatsApp</div>
              </div>
            </div>
          </div>

          <Card className="mt-3 p-3 border-primary/30 bg-primary/5">
            <p className="text-xs text-foreground leading-relaxed">{demo.desc}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------- PASSO 7: Mapeamento ----------
const PERGUNTAS_MAPEAMENTO = [
  { key: "matriz_filiais", label: "Matriz ou filiais?" },
  { key: "precos_unidade", label: "Os preços mudam por unidade?" },
  { key: "outros_sistemas", label: "Outros sistemas usados" },
  { key: "estrutura_equipe", label: "Estrutura da equipe, funcionários, gestão" },
  { key: "especialidades", label: "Especialidades + nº de profissionais" },
  { key: "tipos_atendimento", label: "Tipos de atendimento" },
  { key: "convenios", label: "Atende convênios?" },
  { key: "filtro_convenios", label: "Como filtra os planos dos convênios?" },
  { key: "operacionaliza", label: "Quem operacionaliza o atendimento hoje?" },
  { key: "whatsapp_api", label: "WhatsApp Web ou API oficial?" },
];

export function Passo7Mapeamento({ data, setData, modoApresentacao }: StepProps) {
  const mapeamento = data.mapeamento ?? {};
  return (
    <div className="max-w-5xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Mapeamento da clínica</h2>
      <p className="text-sm text-muted-foreground mb-8">Hora de conhecer melhor o seu dia a dia.</p>

      <Card className="p-6 border-cloudia/40 bg-cloudia/5 mb-6">
        <Label className="text-base font-medium">
          Quais os principais desafios enfrentados hoje e qual sua expectativa com a contratação da Cloudia?
        </Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          {!modoApresentacao && "(Esta resposta é referência para conversas de retenção futuras — anote em detalhes.)"}
        </p>
        {modoApresentacao ? (
          <p className="text-sm">{data.desafio_principal ?? "—"}</p>
        ) : (
          <Textarea
            value={data.desafio_principal ?? ""}
            onChange={(e) => setData({ desafio_principal: e.target.value })}
            rows={4}
            placeholder="Anote em detalhes a dor do cliente e o que ele espera..."
          />
        )}
      </Card>

      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
        Conhecendo sua jornada
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {PERGUNTAS_MAPEAMENTO.map((p) => (
          <Card key={p.key} className="p-4 border-border">
            <Label className="text-sm">{p.label}</Label>
            {modoApresentacao ? (
              <p className="text-sm text-muted-foreground mt-2">{mapeamento[p.key] || "—"}</p>
            ) : (
              <Input
                value={mapeamento[p.key] ?? ""}
                onChange={(e) =>
                  setData({ mapeamento: { ...mapeamento, [p.key]: e.target.value } })
                }
                className="mt-2"
                placeholder="Resposta do cliente"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- PASSO 8: Próximos passos ----------
export function Passo8ProximosPassos({ cliente, data }: StepProps) {
  const validacoes = data.validacoes_contratuais ?? {};
  const confirmados = Object.values(validacoes).filter((v: any) => v?.confirmado).length;
  const mapeamento = data.mapeamento ?? {};
  const respostas = Object.values(mapeamento).filter((v) => v).length;

  return (
    <div className="max-w-3xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Próximos passos</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Vamos iniciar suas configurações!
      </p>

      <Card className="p-6 border-border mb-6">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
          Resumo da reunião
        </h3>
        <div className="space-y-3 text-sm">
          <Row label="Cliente" valor={cliente.nome} />
          <Row label="Gerente de contas" valor={cliente.gerente ?? "—"} />
          <Row label="Validações contratuais" valor={`${confirmados} de 5 confirmadas`} />
          <Row label="Respostas de mapeamento" valor={`${respostas} de 10 preenchidas`} />
          <Row label="Desafio principal capturado" valor={data.desafio_principal ? "Sim" : "Não"} />
          <Row label="Variação demo apresentada" valor={data.variacao_demo ?? "—"} />
        </div>
      </Card>

      <Card className="p-6 border-cloudia/40 bg-cloudia/5">
        <Clock className="h-5 w-5 text-cloudia mb-2" />
        <h3 className="text-base font-medium mb-3">O que vem depois</h3>
        <ul className="space-y-2 text-sm">
          <li>· Sua configuração será entregue em até 7 dias úteis</li>
          <li>· Você receberá um link de teste por WhatsApp</li>
          <li>· Treinamento agendado para a 3ª semana</li>
        </ul>
      </Card>
    </div>
  );
}

function Row({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );
}
