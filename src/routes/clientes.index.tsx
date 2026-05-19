import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/clientes/")({
  head: () => ({ meta: [{ title: "Clientes — Cloudia Hub" }] }),
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
  status: string;
  alteracoes: { count: number }[];
};

function ClientesList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("clientes")
      .select("id,nome,especialidade,gerente,configurador,status, alteracoes(count)")
      .order("nome")
      .then(({ data }) => {
        setRows((data as any) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Base compartilhada entre o Tracker e o Kickoff.</p>
        </div>
        <Link to="/clientes/novo"><Button><Plus className="h-4 w-4 mr-1.5" /> Novo cliente</Button></Link>
      </header>

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : rows.length === 0 ? (
        <Card className="p-12 border-border border-dashed text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium">Nenhum cliente cadastrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Cadastre o primeiro cliente para começar a registrar alterações.</p>
          <Link to="/clientes/novo" className="inline-block mt-5"><Button>Cadastrar cliente</Button></Link>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground bg-muted/40">
              <tr className="border-b border-border">
                <th className="text-left font-medium px-6 py-3">Cliente</th>
                <th className="text-left font-medium px-4 py-3">Especialidade</th>
                <th className="text-left font-medium px-4 py-3">Gerente</th>
                <th className="text-left font-medium px-4 py-3">Configurador</th>
                <th className="text-left font-medium px-4 py-3">Alterações</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="px-6 py-3 font-medium">{r.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.especialidade ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.gerente ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.configurador ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.alteracoes?.[0]?.count ?? 0}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs capitalize">
                      {r.status}
                    </span>
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
