import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, ArrowRight, Eye, Pencil, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { useAutoSave } from "@/lib/use-auto-save";
import {
  Passo1BoasVindas,
  Passo2QuemEhQuem,
  Passo3Combinados,
  Passo4ValidacaoContratual,
  Passo5Cronograma,
  Passo6DemoAoVivo,
  Passo7Mapeamento,
  Passo8ProximosPassos,
} from "@/components/kickoff/steps";

export const Route = createFileRoute("/kickoffs/$id")({
  head: () => ({ meta: [{ title: "Kickoff — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <KickoffWizard />
    </AuthGate>
  ),
});

const PASSOS = [
  { num: 1, label: "Boas-vindas", Component: Passo1BoasVindas },
  { num: 2, label: "Quem é quem", Component: Passo2QuemEhQuem },
  { num: 3, label: "Combinados", Component: Passo3Combinados },
  { num: 4, label: "Validação contratual", Component: Passo4ValidacaoContratual },
  { num: 5, label: "Cronograma", Component: Passo5Cronograma },
  { num: 6, label: "Demonstração", Component: Passo6DemoAoVivo },
  { num: 7, label: "Mapeamento", Component: Passo7Mapeamento },
  { num: 8, label: "Próximos passos", Component: Passo8ProximosPassos },
];

function KickoffWizard() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [kickoff, setKickoff] = useState<any>(null);
  const [passo, setPasso] = useState(1);
  const [modoApresentacao, setModoApresentacao] = useState(false);

  const [data, setDataState] = useState<any>({
    participantes_cliente: [],
    validacoes_contratuais: {},
    responsavel_implementacao: null,
    desafio_principal: null,
    expectativa: null,
    mapeamento: {},
    variacao_demo: "chatgpt",
    mensagens_demo: null,
    notas_internas: null,
  });

  // Atalho P
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        setModoApresentacao((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: k, error } = await supabase
        .from("kickoffs")
        .select("*,clientes(*)")
        .eq("id", id)
        .single();
      if (error || !k) {
        toast.error("Kickoff não encontrado");
        navigate({ to: "/" });
        return;
      }
      setKickoff(k);
      setCliente((k as any).clientes);
      setPasso((k as any).passo_atual ?? 1);
      // Lê responsavel_implementacao do campo ferias_programadas (reusamos a coluna)
      setDataState({
        participantes_cliente: (k as any).participantes_cliente ?? [],
        validacoes_contratuais: (k as any).validacoes_contratuais ?? {},
        responsavel_implementacao: (k as any).ferias_programadas, // reuso da coluna
        desafio_principal: (k as any).desafio_principal,
        expectativa: (k as any).expectativa,
        mapeamento: (k as any).mapeamento ?? {},
        variacao_demo: (k as any).variacao_demo ?? "chatgpt",
        mensagens_demo: (k as any).mensagens_demo,
        notas_internas: (k as any).notas_internas,
      });
      setLoading(false);
    })();
  }, [id, navigate]);

  const save = useCallback(
    async (v: any) => {
      await supabase
        .from("kickoffs")
        .update({
          participantes_cliente: v.participantes_cliente,
          validacoes_contratuais: v.validacoes_contratuais,
          ferias_programadas: v.responsavel_implementacao, // salva no mesmo campo, sem alterar banco
          desafio_principal: v.desafio_principal,
          expectativa: v.expectativa,
          mapeamento: v.mapeamento,
          variacao_demo: v.variacao_demo,
          mensagens_demo: v.mensagens_demo,
          notas_internas: v.notas_internas,
          passo_atual: passo,
        })
        .eq("id", id);
    },
    [id, passo]
  );
  const status = useAutoSave(data, save);

  const setData = (patch: any) => setDataState((d: any) => ({ ...d, ...patch }));

  const finalizar = async () => {
    const { error } = await supabase
      .from("kickoffs")
      .update({ status: "finalizado", finalizado_em: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Kickoff finalizado!");
    navigate({ to: "/" });
  };

  if (loading) {
    return <div className="px-8 py-8 text-sm text-muted-foreground">Carregando…</div>;
  }

  const PassoComponent = PASSOS[passo - 1].Component;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{cliente?.nome}</div>
              <div className="text-xs text-muted-foreground">
                {cliente?.especialidade ?? "Kickoff"} ·{" "}
                {kickoff?.data_reuniao && new Date(kickoff.data_reuniao).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground min-w-[60px] text-right">
              {status === "saving" && "Salvando…"}
              {status === "saved" && (
                <span className="flex items-center gap-1 justify-end text-emerald-600">
                  <Check className="h-3 w-3" /> Salvo
                </span>
              )}
              {status === "error" && <span className="text-destructive">Erro</span>}
            </div>

            <Button
              type="button"
              size="sm"
              variant={modoApresentacao ? "default" : "outline"}
              onClick={() => setModoApresentacao((m) => !m)}
            >
              {modoApresentacao ? (
                <>
                  <Eye className="h-3.5 w-3.5 mr-1.5" /> Apresentação
                </>
              ) : (
                <>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edição
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="px-6 pb-2 flex gap-1.5 overflow-x-auto">
          {PASSOS.map((p) => (
            <button
              key={p.num}
              onClick={() => setPasso(p.num)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                p.num === passo
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="font-medium">{p.num}.</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-6 py-6 overflow-y-auto">
        <PassoComponent
          cliente={cliente}
          data={data}
          setData={setData}
          modoApresentacao={modoApresentacao}
        />
      </main>

      <footer className="border-t border-border bg-card px-6 py-3 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPasso((p) => Math.max(1, p - 1))}
          disabled={passo === 1}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Anterior
        </Button>
        <div className="text-xs text-muted-foreground">
          Passo {passo} de {PASSOS.length} ·{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">P</kbd> alterna modo
        </div>
        {passo === PASSOS.length ? (
          <Button type="button" size="sm" onClick={finalizar}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Finalizar kickoff
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={() => setPasso((p) => Math.min(PASSOS.length, p + 1))}>
            Próximo <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        )}
      </footer>
    </div>
  );
}