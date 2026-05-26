import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Check,
  Phone,
  Users,
  Bot,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Pencil,
  X,
  ExternalLink,
  Send,
  Loader2,
  Eye,
} from "lucide-react";
import { FluxoReadOnly } from "@/components/fluxos/fluxo-read-only";
import { enviarResumoPipedrive, previewResumoKickoff } from "@/lib/pipedrive.functions";

type Cliente = {
  id: string;
  nome: string;
  especialidade: string | null; // exibido como "Categoria" na UI
  gerente: string | null;
  configurador: string | null;
  plano: string | null;
  mensalidade: number | null;
  num_usuarios: number | null;
  creditos: number | null;
  integracao: string | null;
  expectativas: string | null;
  medico_contato: string | null;
};

type KickoffData = {
  participantes_cliente: any;
  validacoes_contratuais: any;
  responsavel_implementacao: string | null;
  operador_atendimento: string | null; // movido pra cá do mapeamento
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

// ============ PASSO 1: Boas-vindas ============
export function Passo1BoasVindas({ cliente, modoApresentacao }: StepProps) {
  return (
    <div className="max-w-3xl mx-auto text-center py-8">
      <h1 className={modoApresentacao ? "text-5xl font-semibold tracking-tight" : "text-3xl font-semibold"}>
        Bem-vindos à <span className="text-cloudia">Cloudia</span>
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{cliente.nome}</p>

      <Card className="mt-10 p-6 border-border text-left">
        <p className="text-sm text-muted-foreground mb-4">
          Sou seu ponto de contato principal durante toda a implantação.
        </p>
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

// ============ PASSO 2: Quem é quem ============
export function Passo2QuemEhQuem({ cliente, data, setData, modoApresentacao }: StepProps) {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Quem é quem na jornada</h2>
      <p className="text-sm text-muted-foreground mb-8">Apresentação dos contatos durante toda a implantação.</p>

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

// ============ PASSO 3: Combinados ============
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
      <p className="text-sm text-muted-foreground mb-8">Duração: 45 minutos.</p>

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

// ============ PASSO 4: Validação contratual ============
export function Passo4ValidacaoContratual({ cliente, data, setData, modoApresentacao }: StepProps) {
  const validacoes = data.validacoes_contratuais ?? {};

  const campos = [
    {
      key: "plano",
      label: "Plano",
      valor: validacoes.plano?.valor ?? cliente.plano ?? "",
      placeholder: "Ex.: Premium 1200",
    },
    {
      key: "mensalidade",
      label: "Mensalidade",
      valor: validacoes.mensalidade?.valor ?? (cliente.mensalidade ? `R$ ${cliente.mensalidade.toFixed(2)}` : ""),
      placeholder: "R$ 0,00",
      sublabel: "Recorrência independente da usabilidade",
    },
    {
      key: "num_usuarios",
      label: "Usuários",
      valor: validacoes.num_usuarios?.valor ?? (cliente.num_usuarios?.toString() ?? ""),
      placeholder: "Quantos",
    },
    {
      key: "creditos",
      label: "Créditos",
      valor: validacoes.creditos?.valor ?? (cliente.creditos?.toString() ?? ""),
      placeholder: "Quantos",
    },
    {
      key: "integracao",
      label: "Integração",
      valor: validacoes.integracao?.valor ?? cliente.integracao ?? "",
      placeholder: "Ex.: Clinicorp",
    },
  ];

  const confirmar = (campo: string, valorAtual: string) => {
    setData({
      validacoes_contratuais: {
        ...validacoes,
        [campo]: { confirmado: true, valor: valorAtual, confirmado_em: new Date().toISOString() },
      },
    });
  };

  const atualizarValor = (campo: string, novoValor: string) => {
    setData({
      validacoes_contratuais: {
        ...validacoes,
        [campo]: { ...(validacoes[campo] ?? {}), valor: novoValor, confirmado: false },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Validação contratual</h2>
      <p className="text-sm text-muted-foreground mb-8">Confirme com o cliente cada item do contrato.</p>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {campos.map((c) => {
          const confirmado = validacoes[c.key]?.confirmado;
          return (
            <Card
              key={c.key}
              className={`p-4 border ${confirmado ? "border-emerald-500/40 bg-emerald-50/40" : "border-border"}`}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{c.label}</div>
              {modoApresentacao ? (
                <div className="text-base font-medium min-h-[24px]">{c.valor || "—"}</div>
              ) : (
                <Input
                  value={c.valor}
                  onChange={(e) => atualizarValor(c.key, e.target.value)}
                  placeholder={c.placeholder}
                  className="text-base font-medium border-none p-0 h-auto focus-visible:ring-0 shadow-none bg-transparent"
                />
              )}
              {c.sublabel && <div className="text-[10px] text-muted-foreground mt-1">{c.sublabel}</div>}
              {!modoApresentacao && (
                <Button
                  type="button"
                  size="sm"
                  variant={confirmado ? "ghost" : "outline"}
                  onClick={() => confirmar(c.key, c.valor)}
                  disabled={confirmado || !c.valor}
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

      <Card className="p-4 border-border bg-card mb-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">
            A cobrança recorrente começa na data do contrato, <strong>independente do uso da plataforma</strong>.
          </p>
        </div>
      </Card>

      <Card className="p-5 border-border">
        <Label className="text-sm">Vai usar WhatsApp Web ou API Oficial?</Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Confirme com o cliente o tipo de WhatsApp contratado.
        </p>
        {modoApresentacao ? (
          <div className="text-base font-medium">{validacoes.whatsapp_tipo?.valor || "—"}</div>
        ) : (
          <div className="flex gap-2 mb-3">
            {["WhatsApp Web", "API Oficial"].map((opt) => {
              const ativo = validacoes.whatsapp_tipo?.valor === opt;
              return (
                <Button
                  key={opt}
                  type="button"
                  size="sm"
                  variant={ativo ? "default" : "outline"}
                  onClick={() =>
                    setData({
                      validacoes_contratuais: {
                        ...validacoes,
                        whatsapp_tipo: {
                          confirmado: true,
                          valor: opt,
                          confirmado_em: new Date().toISOString(),
                        },
                      },
                    })
                  }
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        )}

        {validacoes.whatsapp_tipo?.valor === "API Oficial" && (
          <div className="mt-3 p-3 rounded-md border border-border bg-card">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-foreground leading-relaxed">
                <strong>Importante deixar muito claro que:</strong> na API Oficial,{" "}
                <strong>não é a Cloudia</strong> que cobra templates ou bloqueia o envio depois das 24h,{" "}
                <strong>é a Meta</strong>. Toda mensagem fora da janela de 24h precisa ser um template
                aprovado pela Meta, e o custo dos templates é cobrado direto por ela.
              </div>
            </div>
            <img
              src="https://scontent.whatsapp.net/v/t39.8562-34/378456547_1393815101226879_3068617121358519814_n.png?_nc_sid=2fbf2a&_nc_ohc=Xq8nE7tWp8MQ7kNvgEZqB_Z&_nc_zt=3&_nc_ht=scontent.whatsapp.net"
              alt="Janela de 24h e templates da Meta para WhatsApp Business API"
              className="mt-3 rounded-md border border-border max-w-full h-auto block mx-auto"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <Label className="text-sm">Está em processo de migração de alguma API de WhatsApp oficial?</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Caso esteja vindo de outro provedor (Take, Twilio, 360dialog, etc.), é importante mapear.
          </p>
          {modoApresentacao ? (
            <p className="text-sm">
              {validacoes.migracao_api?.resposta
                ? `${validacoes.migracao_api.resposta === "sim" ? "Sim" : "Não"}${
                    validacoes.migracao_api?.detalhe ? ` — ${validacoes.migracao_api.detalhe}` : ""
                  }`
                : "—"}
            </p>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                {(["sim", "nao"] as const).map((r) => {
                  const ativo = validacoes.migracao_api?.resposta === r;
                  return (
                    <Button
                      key={r}
                      type="button"
                      size="sm"
                      variant={ativo ? "default" : "outline"}
                      onClick={() =>
                        setData({
                          validacoes_contratuais: {
                            ...validacoes,
                            migracao_api: {
                              ...(validacoes.migracao_api ?? {}),
                              confirmado: true,
                              resposta: ativo ? null : r,
                              confirmado_em: new Date().toISOString(),
                            },
                          },
                        })
                      }
                    >
                      {r === "sim" ? "Sim" : "Não"}
                    </Button>
                  );
                })}
              </div>
              {validacoes.migracao_api?.resposta === "sim" && (
                <Input
                  value={validacoes.migracao_api?.detalhe ?? ""}
                  onChange={(e) =>
                    setData({
                      validacoes_contratuais: {
                        ...validacoes,
                        migracao_api: {
                          ...(validacoes.migracao_api ?? {}),
                          detalhe: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="De qual provedor está migrando?"
                />
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============ PASSO 5: Cronograma + Responsável + Quem opera ============
export function Passo5Cronograma({ data, setData, modoApresentacao }: StepProps) {
  const etapas = [
    { icon: PhoneCall, titulo: "Kickoff", prazo: "Hoje", atual: true },
    { icon: Check, titulo: "1ª Configuração", prazo: "7 a 15 dias úteis", atual: false },
    { icon: AlertCircle, titulo: "Alterações", prazo: "Até ~30 dias (depende da participação do cliente)", atual: false },
    { icon: Users, titulo: "Treinamento e Ativação", prazo: "Após configuração finalizada", atual: false },
    { icon: CheckCircle2, titulo: "Finalização", prazo: "Após treinamento", atual: false },
  ];

  const diretrizes = [
    {
      titulo: "Participação",
      texto:
        "A implantação dura cerca de 30 dias. Nesse período é essencial que vocês usem 100% a plataforma, testem o robô, deem feedbacks rápidos e participem dos treinamentos. Quanto mais cedo o uso, mais cedo o resultado.",
    },
    {
      titulo: "Responsável",
      texto:
        "Indique uma pessoa-chave da clínica que será responsável por: realizar os testes do robô, passar feedbacks de alterações necessárias, validar configurações e disseminar o conteúdo dos treinamentos internamente. Essa pessoa será nosso ponto de contato no dia a dia.",
    },
    {
      titulo: "Comunicação",
      texto:
        "Todo nosso contato será via WhatsApp, no mesmo número que vocês acabaram de receber. Eu (gerente) sou seu ponto principal. Para dúvidas técnicas e alterações, falamos diretamente. Após a implantação, o suporte continua no mesmo canal.",
    },
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
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
                  e.atual ? "bg-cloudia text-white" : "bg-muted text-muted-foreground"
                } mb-3`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{e.titulo}</div>
              <div className="text-xs text-muted-foreground mt-1">{e.prazo}</div>
            </Card>
          );
        })}
      </div>

      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">Diretrizes</h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {diretrizes.map((d, i) => (
          <Card key={i} className="p-4 border-border">
            <div className="text-sm font-medium mb-2">{d.titulo}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{d.texto}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 border-border bg-card mb-6">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-foreground leading-relaxed">
            <strong>Treinamento e Ativação:</strong> o treinamento é feito <strong>apenas 1 vez</strong> e
            acontece <strong>somente após a configuração estar finalizada</strong>. Não realizamos
            treinamento antes de o robô estar pronto, isso evita retrabalho e desalinhamento da equipe.
          </div>
        </div>
      </Card>

      {!modoApresentacao && (
        <div className="space-y-3">
          <Card className="p-5 border-border">
            <Label>Quem vai ser o responsável pela implementação?</Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Responsável por realizar os testes, passar feedbacks das alterações que precisam ser ajustadas, etc.
            </p>
            <Input
              value={data.responsavel_implementacao ?? ""}
              onChange={(e) => setData({ responsavel_implementacao: e.target.value })}
              placeholder="Nome e função da pessoa-chave da clínica"
            />
          </Card>

          <Card className="p-5 border-border">
            <Label>Quem opera o atendimento hoje?</Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              Recepção, secretária, atendente — como funciona o fluxo atual.
            </p>
            <Input
              value={data.operador_atendimento ?? ""}
              onChange={(e) => setData({ operador_atendimento: e.target.value })}
              placeholder="Ex.: 2 secretárias na recepção atendem WhatsApp + telefone"
            />
          </Card>
        </div>
      )}
    </div>
  );
}

// ============ PASSO 6: Mapeamento (estrutura modular Sim/Não + textarea + perguntas por integração) ============

// --- Componente helper: pergunta Sim/Não com textarea condicional ---
function SimNaoComTextarea({
  pergunta,
  helper,
  valor,
  onChange,
  modoApresentacao,
  placeholderTextarea,
  alertaSeSim,
  alertaSeNao,
}: {
  pergunta: string;
  helper?: string;
  valor: { resposta?: "sim" | "nao" | null; detalhe?: string } | undefined;
  onChange: (v: { resposta?: "sim" | "nao" | null; detalhe?: string }) => void;
  modoApresentacao: boolean;
  placeholderTextarea?: string;
  alertaSeSim?: React.ReactNode;
  alertaSeNao?: React.ReactNode;
}) {
  const resposta = valor?.resposta ?? null;
  const detalhe = valor?.detalhe ?? "";

  return (
    <Card className="p-4 border-border">
      <Label className="text-sm">{pergunta}</Label>
      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}

      {modoApresentacao ? (
        <p className="text-sm text-muted-foreground mt-2">
          {resposta ? (
            <>
              <strong>{resposta === "sim" ? "Sim" : "Não"}</strong>
              {detalhe && <> · {detalhe}</>}
            </>
          ) : (
            "—"
          )}
        </p>
      ) : (
        <>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              size="sm"
              variant={resposta === "sim" ? "default" : "outline"}
              onClick={() => onChange({ ...valor, resposta: resposta === "sim" ? null : "sim" })}
            >
              Sim
            </Button>
            <Button
              type="button"
              size="sm"
              variant={resposta === "nao" ? "default" : "outline"}
              onClick={() => onChange({ ...valor, resposta: resposta === "nao" ? null : "nao" })}
            >
              Não
            </Button>
          </div>

          {resposta === "sim" && (
            <>
              <Textarea
                value={detalhe}
                onChange={(e) => onChange({ ...valor, detalhe: e.target.value })}
                placeholder={placeholderTextarea ?? "Conte mais detalhes"}
                rows={2}
                className="mt-2"
              />
              {alertaSeSim}
            </>
          )}
          {resposta === "nao" && alertaSeNao}
        </>
      )}
    </Card>
  );
}

// --- Componente helper: pergunta de texto livre ---
function TextLivre({
  pergunta,
  valor,
  onChange,
  modoApresentacao,
  placeholder,
  rows = 2,
}: {
  pergunta: string;
  valor: string;
  onChange: (v: string) => void;
  modoApresentacao: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Card className="p-4 border-border">
      <Label className="text-sm">{pergunta}</Label>
      {modoApresentacao ? (
        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{valor || "—"}</p>
      ) : (
        <Textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Resposta do cliente"}
          rows={rows}
          className="mt-2"
        />
      )}
    </Card>
  );
}

// --- Componente helper: dropdown ---
function DropdownSimples({
  pergunta,
  valor,
  onChange,
  modoApresentacao,
  opcoes,
}: {
  pergunta: string;
  valor: string;
  onChange: (v: string) => void;
  modoApresentacao: boolean;
  opcoes: string[];
}) {
  return (
    <Card className="p-4 border-border">
      <Label className="text-sm">{pergunta}</Label>
      {modoApresentacao ? (
        <p className="text-sm text-muted-foreground mt-2">{valor || "—"}</p>
      ) : (
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Selecione…</option>
          {opcoes.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </Card>
  );
}

export function Passo6Mapeamento({ cliente, data, setData, modoApresentacao }: StepProps) {
  const mapeamento = data.mapeamento ?? {};
  const integracao = cliente.integracao ?? "";
  const semIntegracao = ["Triagem", "Triagem + IA", "100% IA"].some((s) =>
    integracao.toLowerCase().includes(s.toLowerCase())
  );

  const setCampo = (key: string, valor: any) => {
    setData({ mapeamento: { ...mapeamento, [key]: valor } });
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Mapeamento da clínica</h2>
      <p className="text-sm text-muted-foreground mb-6">Hora de conhecer melhor o seu dia a dia.</p>

      {/* Pergunta âncora */}
      <Card className="p-6 border-cloudia/40 bg-cloudia/5 mb-6">
        <div className="flex items-start gap-2">
          <Label className="text-base font-medium flex-1">
            Quais os principais desafios enfrentados hoje e qual sua expectativa com a contratação da Cloudia?
          </Label>
          {!modoApresentacao && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  Esta resposta é referência para conversas de retenção futuras — anote em detalhes.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {modoApresentacao ? (
          <p className="text-sm mt-3 whitespace-pre-wrap">{data.desafio_principal ?? "—"}</p>
        ) : (
          <Textarea
            value={data.desafio_principal ?? ""}
            onChange={(e) => setData({ desafio_principal: e.target.value })}
            rows={4}
            placeholder="Anote em detalhes a dor do cliente e o que ele espera..."
            className="mt-3"
          />
        )}
      </Card>

      {/* Perguntas genéricas */}
      <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
        Conhecendo sua jornada
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SimNaoComTextarea
          pergunta="Tem mais de uma unidade?"
          valor={mapeamento.unidades}
          onChange={(v) => setCampo("unidades", v)}
          modoApresentacao={modoApresentacao}
          placeholderTextarea="Quais e quantas?"
        />

        {semIntegracao && (
          <SimNaoComTextarea
            pergunta="Você utiliza algum sistema de agendamento?"
            valor={mapeamento.sistema_agendamento}
            onChange={(v) => setCampo("sistema_agendamento", v)}
            modoApresentacao={modoApresentacao}
            placeholderTextarea="Qual sistema?"
          />
        )}

        <TextLivre
          pergunta="Quais as especialidades que você quer oferecer e profissionais de cada uma?"
          valor={mapeamento.especialidades_profissionais ?? ""}
          onChange={(v) => setCampo("especialidades_profissionais", v)}
          modoApresentacao={modoApresentacao}
          placeholder="Ex.: Ortodontia (Dr. João, Dra. Ana), Implante (Dr. Carlos)"
          rows={3}
        />

        <TextLivre
          pergunta="Que tipo de serviço vocês oferecem?"
          valor={mapeamento.tipos_servico ?? ""}
          onChange={(v) => setCampo("tipos_servico", v)}
          modoApresentacao={modoApresentacao}
          placeholder="Procedimentos, consultas, exames, etc."
          rows={2}
        />

        <SimNaoComTextarea
          pergunta="Atende convênios?"
          valor={mapeamento.convenios}
          onChange={(v) => setCampo("convenios", v)}
          modoApresentacao={modoApresentacao}
          placeholderTextarea="Quais convênios?"
        />

      </div>

      {/* Perguntas específicas por integração — Clinicorp */}
      {integracao.toLowerCase().includes("clinicorp") && (
        <>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
            <span>Perguntas específicas — Clinicorp</span>
            <span className="text-[10px] bg-cloudia/10 text-cloudia px-2 py-0.5 rounded-full normal-case tracking-normal">
              integração selecionada
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <SimNaoComTextarea
              pergunta="Os horários dos profissionais já estão cadastrados no Clinicorp?"
              valor={mapeamento.clinicorp_horarios}
              onChange={(v) => setCampo("clinicorp_horarios", v)}
              modoApresentacao={modoApresentacao}
              alertaSeNao={
                <div className="mt-2 p-2.5 bg-card border border-border rounded-md text-[11px] text-foreground leading-relaxed">
                  <AlertCircle className="h-3 w-3 inline mr-1 -mt-0.5" />
                  Verificar se o fluxo do cliente é <strong>API Online</strong> ou <strong>API Completa</strong>. Enviar
                  link de tutorial no WhatsApp.
                </div>
              }
            />

            <SimNaoComTextarea
              pergunta="Essas especialidades têm horários diferentes?"
              valor={mapeamento.clinicorp_horarios_diferentes}
              onChange={(v) => setCampo("clinicorp_horarios_diferentes", v)}
              modoApresentacao={modoApresentacao}
              alertaSeSim={
                <div className="mt-2 p-2.5 bg-card border border-border rounded-md text-[11px] text-foreground leading-relaxed">
                  <AlertCircle className="h-3 w-3 inline mr-1 -mt-0.5" />
                  Verificar a configuração dos <strong>slots no Clinicorp</strong>.{" "}
                  <a
                    href="https://www.notion.so/cloudiabot/Fluxos-Clinicorp-b748e29fe079455fbec5ea13acdadaaf?source=copy_link#24152f76f2c080dda25cec982409c8ba"
                    target="_blank"
                    rel="noreferrer"
                    className="underline inline-flex items-center gap-0.5"
                  >
                    Mais informações <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              }
            />

            <SimNaoComTextarea
              pergunta="Está em processo de migração de outro sistema?"
              valor={mapeamento.clinicorp_migracao}
              onChange={(v) => setCampo("clinicorp_migracao", v)}
              modoApresentacao={modoApresentacao}
              placeholderTextarea="De qual sistema está migrando?"
            />
          </div>
        </>
      )}
    </div>
  );
}

// ============ PASSO 7: Demonstração ao vivo (era passo 6) ============
const DEMOS_INICIAIS: Record<string, { label: string; desc: string; mensagens: { from: string; texto: string; hora: string; botoes?: string[] }[] }> = {
  chatgpt: {
    label: "100% IA",
    desc: "O robô conduz toda a conversa via IA. Sua equipe entra só se o paciente pedir atendente humano.",
    mensagens: [
      { from: "paciente", texto: "Bom dia!", hora: "10:37" },
      { from: "robo", texto: "Oi, tudo bem? Sou da Clínica Dr. Exemplo 👋 Como posso te ajudar hoje?", hora: "10:38" },
      { from: "paciente", texto: "Quero marcar uma consulta", hora: "10:38" },
      { from: "robo", texto: "Claro! Você já é nossa paciente?", hora: "10:38", botoes: ["Apenas integração", "IA + Integração"] },
      { from: "paciente", texto: "Primeira vez", hora: "10:39" },
      { from: "robo", texto: "Pode me dizer seu nome completo e o que está sentindo?", hora: "10:39" },
    ],
  },
  integracao: {
    label: "Apenas integração",
    desc: "O robô usa integração com seu sistema para buscar horários e confirmar agendamentos.",
    mensagens: [
      { from: "paciente", texto: "Oi, quero remarcar minha consulta", hora: "14:20" },
      { from: "robo", texto: "Olá Maria! Vejo sua consulta para 25/05 às 14h. Pra qual data prefere mover?", hora: "14:20", botoes: ["Apenas integração", "IA + Integração"] },
      { from: "paciente", texto: "Próxima semana de manhã", hora: "14:21" },
      { from: "robo", texto: "Tenho horários disponíveis: terça 28/05 às 9h ou quinta 30/05 às 10h. Qual prefere?", hora: "14:21" },
    ],
  },
  chatgpt_integracao: {
    label: "IA + Integração",
    desc: "Combinação: o robô qualifica o paciente com IA e integra com seu sistema para agendar.",
    mensagens: [
      { from: "paciente", texto: "Tô com uma dor de cabeça forte há 3 dias", hora: "16:10" },
      { from: "robo", texto: "Sinto muito, Maria. Vou te ajudar a marcar com um neurologista. Você tem convênio ou prefere particular?", hora: "16:10", botoes: ["Apenas integração", "IA + Integração"] },
      { from: "paciente", texto: "Tenho Unimed", hora: "16:11" },
      { from: "robo", texto: "Perfeito. Encontrei horário com Dr. Silva (neuro) amanhã às 14h. Posso confirmar?", hora: "16:11" },
    ],
  },
};

export function Passo7DemoAoVivo({ cliente, data, setData, modoApresentacao }: StepProps) {
  const variacaoAtual = (data.variacao_demo ?? "chatgpt") as string;
  const mensagensCustomizadas = data.mensagens_demo?.[variacaoAtual];
  const demoInicial = DEMOS_INICIAIS[variacaoAtual];
  const mensagens = mensagensCustomizadas ?? demoInicial.mensagens;

  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [botoesEdicao, setBotoesEdicao] = useState<string[]>([]);

  const salvarEdicao = (idx: number) => {
    const novas = [...mensagens];
    const botoes = botoesEdicao.map((b) => b.trim()).filter(Boolean).slice(0, 10);
    novas[idx] = { ...novas[idx], texto: textoEdicao, ...(botoes.length ? { botoes } : { botoes: undefined }) };
    setData({ mensagens_demo: { ...(data.mensagens_demo ?? {}), [variacaoAtual]: novas } });
    setEditandoIdx(null);
    setTextoEdicao("");
    setBotoesEdicao([]);
  };

  const resetarVariacao = () => {
    const novas = { ...(data.mensagens_demo ?? {}) };
    delete novas[variacaoAtual];
    setData({ mensagens_demo: novas });
  };

  const trocarVariacao = (k: string) => {
    setData({ variacao_demo: k });
    setEditandoIdx(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Como a Cloudia vai funcionar pra sua clínica</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Sua paciente no WhatsApp à esquerda, sua equipe na Central de Mensagens à direita.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {Object.keys(DEMOS_INICIAIS).map((k) => (
          <button
            key={k}
            onClick={() => trocarVariacao(k)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              variacaoAtual === k
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {DEMOS_INICIAIS[k].label}
          </button>
        ))}

        {!modoApresentacao && mensagensCustomizadas && (
          <Button type="button" size="sm" variant="ghost" onClick={resetarVariacao} className="ml-auto text-xs">
            Restaurar mensagens padrão
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4 items-start">
        {/* WhatsApp da paciente */}
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
              <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-auto">
                {mensagens.map((m: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-md max-w-[80%] shadow-sm overflow-hidden ${
                      m.from === "paciente" ? "bg-[#d9fdd3] self-end" : "bg-white self-start"
                    }`}
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] text-[#111b21] leading-snug">{m.texto}</p>
                      <p className="text-[8px] text-[#667781] text-right mt-0.5">
                        {m.hora} {m.from === "paciente" && "✓✓"}
                      </p>
                    </div>
                    {m.botoes && m.botoes.length > 0 && (
                      <div className="border-t border-black/5 flex flex-col">
                        {m.botoes.map((b: string, bi: number) => (
                          <button
                            key={bi}
                            type="button"
                            className="text-[10px] text-[#00a5f4] font-medium py-1.5 px-2 border-t border-black/5 first:border-t-0 hover:bg-black/[0.02]"
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Central de Mensagens */}
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <MessageCircle className="h-3 w-3" /> O que sua equipe vê na Central de Mensagens
          </div>
          <div className="bg-[#1e2330] rounded-lg overflow-hidden grid grid-cols-[1fr_180px] min-h-[480px]">
            <div className="flex flex-col border-r border-[#2a3142]">
              <div className="bg-[#1e2330] px-4 py-2.5 flex items-center gap-2.5 border-b border-[#2a3142]">
                <div className="w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  DE
                </div>
                <div className="text-sm font-medium text-gray-200">Denise Almeida</div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded">BOT</span>
                </div>
              </div>

              <div
                className="flex-1 p-3 flex flex-col gap-2.5 overflow-auto"
                style={{
                  background: "#14171f",
                  backgroundImage: "radial-gradient(circle, #1a1f2e 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <div className="text-center">
                  <span className="bg-[#2a3142] text-gray-400 text-[10px] px-2.5 py-0.5 rounded-full">Hoje</span>
                </div>

                {mensagens.map((m: any, i: number) => {
                  const isEditando = editandoIdx === i;
                  return (
                    <div key={i} className={`flex flex-col ${m.from === "robo" ? "items-end" : "items-start"} group`}>
                      <div
                        className={`rounded-md px-2.5 py-1.5 max-w-[85%] ${
                          m.from === "robo" ? "bg-blue-600" : "bg-[#2a3142]"
                        } ${!modoApresentacao ? "relative" : ""}`}
                      >
                        {m.from === "robo" && (
                          <p className="text-[10px] text-blue-200 font-medium flex items-center gap-1 mb-0.5">
                            <Bot className="h-3 w-3" /> Cloudia
                          </p>
                        )}

                        {isEditando ? (
                          <div className="flex flex-col gap-1.5">
                            <Textarea
                              value={textoEdicao}
                              onChange={(e) => setTextoEdicao(e.target.value)}
                              className="text-[11px] bg-white/10 text-white border-white/20 min-h-[60px]"
                              autoFocus
                            />
                            <div className="border-t border-white/20 pt-1.5 flex flex-col gap-1">
                              <div className="text-[9px] uppercase tracking-wide text-white/60">
                                Botões ({botoesEdicao.length}/10)
                              </div>
                              {botoesEdicao.map((b, bi) => (
                                <div key={bi} className="flex gap-1">
                                  <input
                                    value={b}
                                    onChange={(e) => {
                                      const novos = [...botoesEdicao];
                                      novos[bi] = e.target.value;
                                      setBotoesEdicao(novos);
                                    }}
                                    placeholder="Texto do botão"
                                    className="flex-1 text-[10px] bg-white/10 text-white border border-white/20 rounded px-1.5 py-0.5"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setBotoesEdicao(botoesEdicao.filter((_, idx) => idx !== bi))}
                                    className="text-[10px] text-white/60 hover:text-white px-1"
                                    title="Remover"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                              {botoesEdicao.length < 10 && (
                                <button
                                  type="button"
                                  onClick={() => setBotoesEdicao([...botoesEdicao, ""])}
                                  className="text-[10px] text-white/70 hover:text-white text-left px-1"
                                >
                                  + adicionar botão
                                </button>
                              )}
                            </div>
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => {
                                  setEditandoIdx(null);
                                  setTextoEdicao("");
                                  setBotoesEdicao([]);
                                }}
                                className="text-[10px] text-white/70 hover:text-white px-2 py-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => salvarEdicao(i)}
                                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className={`text-[11px] leading-snug ${m.from === "robo" ? "text-white" : "text-gray-200"}`}>
                            {m.texto}
                          </p>
                        )}

                        {!isEditando && (
                          <p
                            className={`text-[9px] text-right mt-0.5 ${
                              m.from === "robo" ? "text-blue-200" : "text-gray-500"
                            }`}
                          >
                            {m.hora} {m.from === "robo" && "✓✓"}
                          </p>
                        )}

                        {!isEditando && m.botoes && m.botoes.length > 0 && (
                          <div className="mt-1.5 -mx-2.5 -mb-1.5 border-t border-white/20 flex flex-col">
                            {m.botoes.map((b: string, bi: number) => (
                              <div
                                key={bi}
                                className={`text-[10px] font-medium py-1 px-2 border-t border-white/20 first:border-t-0 ${
                                  m.from === "robo" ? "text-blue-100" : "text-gray-300"
                                }`}
                              >
                                {b}
                              </div>
                            ))}
                          </div>
                        )}

                        {!modoApresentacao && !isEditando && (
                          <button
                            onClick={() => {
                              setEditandoIdx(i);
                              setTextoEdicao(m.texto);
                              setBotoesEdicao([...(m.botoes ?? [])]);
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Editar mensagem"
                          >
                            <Pencil className="h-2.5 w-2.5 text-gray-700" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#1e2330] px-3 py-2 border-t border-[#2a3142]">
                <div className="bg-[#14171f] rounded px-2.5 py-1.5 text-[11px] text-gray-600">
                  Digite uma mensagem...
                </div>
              </div>
            </div>

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
            <p className="text-xs text-foreground leading-relaxed">{demoInicial.desc}</p>
          </Card>

          {!modoApresentacao && (
            <p className="text-[11px] text-muted-foreground mt-2">
              💡 Passe o mouse em cima de qualquer mensagem para editar. As alterações ficam salvas para essa kickoff.
            </p>
          )}
        </div>
      </div>

      {/* Fluxo do robô (read-only) — abaixo das duas colunas */}
      <FluxoReadOnly
        clienteId={cliente.id}
        variacao={variacaoAtual}
        modoApresentacao={modoApresentacao}
      />
    </div>
  );
}

// ============ PASSO 8: Próximos passos ============
// Pra editar os textos: altere o array COMPROMISSOS_FINAIS abaixo.
const COMPROMISSOS_FINAIS = [
  {
    icon: Users,
    titulo: "Participação do responsável",
    descricao:
      "A participação ativa do responsável pela implementação é essencial. É essa pessoa que vai testar o robô, dar feedbacks e garantir que tudo esteja redondo até o go-live.",
  },
  {
    icon: Clock,
    titulo: "Seguir o cronograma",
    descricao:
      "Nosso processo é desenhado pra durar 30 dias. Se algum dos prazos atrasar (configuração, testes, treinamento), o cronograma todo desliza — e a clínica fica mais tempo sem usar o robô.",
  },
  {
    icon: MessageCircle,
    titulo: "Pendências da reunião",
    descricao:
      "Se ficou alguma pendência levantada hoje (dúvida, ajuste, decisão pendente), envie diretamente para o seu gerente de contas pelo WhatsApp.",
  },
];

export function Passo8ProximosPassos({ cliente, data, setData, modoApresentacao }: StepProps) {
  const validacoes = data.validacoes_contratuais ?? {};
  const confirmados = Object.values(validacoes).filter((v: any) => v?.confirmado).length;
  const mapeamento = data.mapeamento ?? {};
  const respostas = Object.values(mapeamento).filter((v) => v).length;

  return (
    <div className="max-w-4xl mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-2">Próximos passos</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Pra que tudo dê certo, esses 3 pontos são importantes:
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {COMPROMISSOS_FINAIS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Card key={i} className="p-5 border-cloudia/30 bg-cloudia/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cloudia text-white mb-3">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium mb-2">{c.titulo}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.descricao}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 border-border mb-6">
        <Label className="text-sm font-medium">Pendências levantadas nesta reunião</Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Anote qualquer ponto que ficou em aberto durante a kickoff (dúvidas técnicas, decisões pendentes,
          ajustes que o cliente quer revisar, etc).
        </p>
        {modoApresentacao ? (
          <p className="text-sm whitespace-pre-wrap">{data.expectativa ?? "Nenhuma pendência registrada."}</p>
        ) : (
          <Textarea
            value={data.expectativa ?? ""}
            onChange={(e) => setData({ expectativa: e.target.value })}
            placeholder="Ex.: Cliente quer revisar o fluxo de pacientes recorrentes. Aguarda envio das perguntas de qualificação."
            rows={3}
          />
        )}
      </Card>

      {!modoApresentacao && (
        <Card className="p-5 border-border bg-muted/30 mb-6">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Resumo interno da reunião
          </h3>
          <div className="space-y-2 text-sm">
            <Row label="Cliente" valor={cliente.nome} />
            <Row label="Gerente de contas" valor={cliente.gerente ?? "—"} />
            <Row label="Validações contratuais" valor={`${confirmados} de 5 confirmadas`} />
            <Row label="Respostas de mapeamento" valor={`${respostas} preenchidas`} />
            <Row label="Desafio principal capturado" valor={data.desafio_principal ? "Sim" : "Não"} />
            <Row label="Variação demo apresentada" valor={data.variacao_demo ?? "—"} />
            <Row label="Pendências registradas" valor={data.expectativa ? "Sim" : "Não"} />
          </div>
        </Card>
      )}

      {!modoApresentacao && <PipedriveResumoCard cliente={cliente} />}
    </div>
  );
}

function validarPipedriveLink(raw: string): { ok: true; kind: "deal" | "lead"; id: string; domain?: string } | { ok: false; error: string } {
  const v = raw.trim();
  if (!v) return { ok: false, error: "Informe o link ou ID do Pipedrive" };
  if (v.startsWith("http://") || v.startsWith("https://")) {
    try {
      const url = new URL(v);
      const host = url.hostname;
      if (!host.endsWith(".pipedrive.com")) return { ok: false, error: "O domínio precisa ser *.pipedrive.com" };
      const domain = host.replace(".pipedrive.com", "");
      const segs = url.pathname.split("/").filter(Boolean);
      const idx = segs.findIndex((s) => s === "deal" || s === "deals" || s === "lead" || s === "leads");
      if (idx < 0 || !segs[idx + 1]) return { ok: false, error: "URL sem /deal/<id> ou /leads/<uuid>" };
      const kind: "deal" | "lead" = segs[idx].startsWith("lead") ? "lead" : "deal";
      return { ok: true, kind, id: segs[idx + 1], domain };
    } catch {
      return { ok: false, error: "URL inválida" };
    }
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(v)) return { ok: true, kind: "lead", id: v };
  if (/^\d+$/.test(v)) return { ok: true, kind: "deal", id: v };
  return { ok: false, error: "Cole a URL completa ou o ID numérico" };
}

function PipedriveResumoCard({ cliente }: { cliente: Cliente }) {
  const { id: kickoffId } = useParams({ from: "/kickoffs/$id" });
  const preview = useServerFn(previewResumoKickoff);
  const enviar = useServerFn(enviarResumoPipedrive);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string>((cliente as any).pipedrive_lead_id ?? "");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const validacao = validarPipedriveLink(leadId);
  const linkValido = validacao.ok;

  const onPreview = async () => {
    setLoadingPreview(true);
    try {
      const res = await preview({ data: { kickoffId } });
      if (res.ok) {
        setPreviewText(res.preview);
        if (res.pipedriveLeadId && !leadId) setLeadId(res.pipedriveLeadId);
      } else toast.error(res.error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const onEnviar = async () => {
    if (!linkValido) {
      toast.error((validacao as any).error);
      return;
    }
    setEnviando(true);
    try {
      const res = await enviar({
        data: { kickoffId, pipedriveLeadIdOverride: leadId.trim() },
      });
      if (res.ok) {
        setEnviado(true);
        setPreviewText(res.preview);
        toast.success("Resumo enviado ao Pipedrive!");
      } else {
        toast.error(res.error);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card className="p-5 border-cloudia/30 bg-cloudia/5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Send className="h-4 w-4 text-cloudia" /> Enviar resumo ao Pipedrive
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Gera uma nota no deal/lead do cliente com o resumo da kickoff e o link desta reunião.
          </p>
        </div>
        {enviado && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Enviado
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end mb-3">
        <div>
          <Label className="text-xs">Link do deal no Pipedrive</Label>
          <Input
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            placeholder="https://cloudia-1a6571.pipedrive.com/deal/75189"
            className="mt-1"
          />
          {leadId.trim() ? (
            linkValido ? (
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {validacao.kind === "deal" ? "Deal" : "Lead"} <strong>#{validacao.id}</strong>
                {validacao.domain && <> em <strong>{validacao.domain}.pipedrive.com</strong></>}
              </p>
            ) : (
              <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {validacao.error}
              </p>
            )
          ) : (
            <p className="text-[10px] text-muted-foreground mt-1">
              Cole a URL completa do negócio. Também aceita só o ID numérico ou um UUID de lead.
            </p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onPreview} disabled={loadingPreview}>
          {loadingPreview ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
          <span className="ml-1.5">Preview</span>
        </Button>
        <Button type="button" size="sm" onClick={onEnviar} disabled={enviando || !linkValido}>
          {enviando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          <span className="ml-1.5">Enviar</span>
        </Button>
      </div>

      {previewText && (
        <div className="rounded-md border border-border bg-background p-3 max-h-72 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">{previewText}</pre>
        </div>
      )}
    </Card>
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