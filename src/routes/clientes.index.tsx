import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Workflow } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/clientes/")({
  head: () => ({ meta: [{ title: "Clientes — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <ClientesList />
    </AuthGate>
  ),
});

type Row = {
  id: string;
  nome: string;
  especialidade: string | null;
  gerente: string | null;
  configurador: string | null;
  integracao: string | null;
  status: string;
  kickoffs: { count: number }[];
};

function ClientesList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("clientes")
        .select("id,nome,especialidade,gerente,configurador,integracao,status,kickoffs(count)")
        .order("nome");
      setRows((data as any) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Empresas cadastradas para implementação.</p>
        </div>
        <Link to="/clientes/novo">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> Novo cliente
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 border-border border-dashed text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium">Nenhum cliente cadastrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre um cliente antes de criar um kickoff.
          </p>
          <Link to="/clientes/novo" className="inline-block mt-5">
            <Button>Cadastrar primeiro cliente</Button>
          </Link>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left font-medium px-6 py-3">Nome</th>
                <th className="text-left font-medium px-4 py-3">Categoria</th>
                <th className="text-left font-medium px-4 py-3">Integração</th>
                <th className="text-left font-medium px-4 py-3">Gerente</th>
                <th className="text-left font-medium px-4 py-3">Configurador</th>
                <th className="text-right font-medium px-6 py-3">Kickoffs</th>
                <th className="text-right font-medium px-4 py-3">Fluxos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.especialidade ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.integracao ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.gerente ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.configurador ?? "—"}</td>
                  <td className="px-6 py-3 text-right text-muted-foreground">
                    {c.kickoffs?.[0]?.count ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/clientes/$id/fluxos"
                      params={{ id: c.id }}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Workflow className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}