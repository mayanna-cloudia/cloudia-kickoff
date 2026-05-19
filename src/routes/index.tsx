import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Presentation, Plus, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Kickoffs — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <KickoffsList />
    </AuthGate>
  ),
});

type KickoffRow = {
  id: string;
  cliente_id: string;
  data_reuniao: string | null;
  passo_atual: number;
  status: string;
  criado_em: string;
  finalizado_em: string | null;
  clientes?: { nome: string; especialidade: string | null; gerente: string | null } | null;
};

function KickoffsList() {
  const [kickoffs, setKickoffs] = useState<KickoffRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("kickoffs")
        .select("id,cliente_id,data_reuniao,passo_atual,status,criado_em,finalizado_em,clientes(nome,especialidade,gerente)")
        .order("criado_em", { ascending: false });
      setKickoffs((data as any) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kickoffs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reuniões de kickoff conduzidas pela equipe de implementação.
          </p>
        </div>
        <Link to="/kickoffs/novo">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> Novo kickoff
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : kickoffs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kickoffs.map((k) => (
            <Link key={k.id} to="/kickoffs/$id" params={{ id: k.id }}>
              <Card className="p-5 border-border hover:border-primary/40 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-medium">{k.clientes?.nome ?? "Cliente"}</h3>
                    {k.clientes?.especialidade && (
                      <p className="text-xs text-muted-foreground mt-0.5">{k.clientes.especialidade}</p>
                    )}
                  </div>
                  {k.status === "finalizado" ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Finalizado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" /> Em andamento
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {k.data_reuniao && (
                    <div>Reunião: {new Date(k.data_reuniao).toLocaleDateString("pt-BR")}</div>
                  )}
                  {k.clientes?.gerente && <div>Gerente: {k.clientes.gerente}</div>}
                  {k.status === "em_andamento" && (
                    <div className="text-primary">Passo {k.passo_atual} de 8</div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-12 border-border border-dashed text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
        <Presentation className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-medium">Nenhum kickoff ainda</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Crie um kickoff antes de cada reunião de implementação. Você compartilha a tela com o cliente e
        conduz a conversa pelos 8 passos do wizard.
      </p>
      <Link to="/kickoffs/novo" className="inline-block mt-5">
        <Button>Criar primeiro kickoff</Button>
      </Link>
    </Card>
  );
}
