import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ListPlus, TrendingUp, Users, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Cloudia Hub" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <Dashboard />
    </AuthGate>
  ),
});

type Alteracao = {
  id: string;
  cliente_id: string;
  tipo: string;
  tamanho: string;
  fase: string;
  origem: string;
  criado_em: string;
};
type Cliente = { id: string; nome: string };

const TIPO_LABEL: Record<string, string> = { texto: "Texto/copy", fluxo: "Fluxo", perguntas: "Perguntas", tecnica: "Técnica" };
const FASE_LABEL: Record<string, string> = { pre_treino: "Pré-treino", pos_treino: "Pós-treino", pos_golive: "Pós go-live" };
const ORIGEM_LABEL: Record<string, string> = { whatsapp: "WhatsApp", email: "E-mail", reuniao: "Reunião", outro: "Outro" };

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function Dashboard() {
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [inclusas, setInclusas] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, c, s] = await Promise.all([
        supabase.from("alteracoes").select("id,cliente_id,tipo,tamanho,fase,origem,criado_em").order("criado_em", { ascending: false }),
        supabase.from("clientes").select("id,nome"),
        supabase.from("settings").select("alteracoes_inclusas").limit(1).single(),
      ]);
      setAlteracoes((a.data as any) ?? []);
      setClientes((c.data as any) ?? []);
      setInclusas(s.data?.alteracoes_inclusas ?? null);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const byCli = new Map<string, number>();
    alteracoes.forEach((x) => byCli.set(x.cliente_id, (byCli.get(x.cliente_id) ?? 0) + 1));
    const counts = Array.from(byCli.values());
    const median = percentile(counts, 0.5);
    const p90 = percentile(counts, 0.9);
    const avg = counts.length ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
    const suggestedLow = Math.max(1, Math.round(median));
    const suggestedHigh = Math.max(suggestedLow, Math.round(p90));
    const pctAtOrBelowHigh = counts.length ? (counts.filter((n) => n <= suggestedHigh).length / counts.length) * 100 : 0;

    const dist = new Map<number, number>();
    counts.forEach((n) => dist.set(n, (dist.get(n) ?? 0) + 1));
    const distArr = Array.from(dist.entries()).sort((a, b) => a[0] - b[0]).map(([k, v]) => ({ n: k, clientes: v }));

    const groupBy = (key: keyof Alteracao, label: Record<string, string>) => {
      const m = new Map<string, number>();
      alteracoes.forEach((x) => m.set(String(x[key]), (m.get(String(x[key])) ?? 0) + 1));
      return Array.from(m.entries()).map(([k, v]) => ({ name: label[k] ?? k, value: v }));
    };

    return {
      total: alteracoes.length,
      clientesCount: byCli.size,
      median,
      avg,
      p90,
      suggestedLow,
      suggestedHigh,
      pctAtOrBelowHigh,
      distArr,
      porTipo: groupBy("tipo", TIPO_LABEL),
      porFase: groupBy("fase", FASE_LABEL),
      porOrigem: groupBy("origem", ORIGEM_LABEL),
    };
  }, [alteracoes]);

  const clientName = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "—";
  const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tracker de alterações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dados em tempo real para calibrar a faixa contratual de alterações inclusas.
          </p>
        </div>
        <Link to="/alteracoes/nova">
          <Button>
            <ListPlus className="h-4 w-4 mr-1.5" /> Registrar alteração
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : alteracoes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Stat label="Alterações registradas" value={stats.total} icon={ListPlus} />
            <Stat label="Clientes ativos" value={stats.clientesCount} icon={Users} />
            <Stat label="Mediana por cliente" value={stats.median.toFixed(1)} icon={TrendingUp} />
            <Stat label="P90 por cliente" value={stats.p90.toFixed(1)} icon={TrendingUp} />
          </div>

          <Card className="p-6 mb-6 border-border">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Insight automático</div>
                <p className="mt-1 text-base text-foreground">
                  <strong>{stats.pctAtOrBelowHigh.toFixed(0)}%</strong> dos clientes pedem{" "}
                  <strong>{stats.suggestedHigh}</strong> alterações ou menos. Faixa sugerida para o contrato:{" "}
                  <strong className="text-primary">{stats.suggestedLow}–{stats.suggestedHigh}</strong> alterações.
                </p>
                {inclusas != null && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Valor atual configurado: {inclusas} alterações.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="lg:col-span-2 p-6 border-border">
              <h3 className="text-sm font-medium mb-4">Distribuição por número de alterações</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={stats.distArr}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="n" stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="clientes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <h3 className="text-sm font-medium mb-4">Por tipo</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={stats.porTipo} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                      {stats.porTipo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <BreakCard title="Por fase" data={stats.porFase} colors={COLORS} />
            <BreakCard title="Por origem" data={stats.porOrigem} colors={COLORS} />
          </div>

          <Card className="border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-medium">Últimas alterações</h3>
              <span className="text-xs text-muted-foreground">{Math.min(20, alteracoes.length)} de {alteracoes.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left font-medium px-6 py-3">Cliente</th>
                    <th className="text-left font-medium px-4 py-3">Tipo</th>
                    <th className="text-left font-medium px-4 py-3">Tamanho</th>
                    <th className="text-left font-medium px-4 py-3">Fase</th>
                    <th className="text-left font-medium px-4 py-3">Origem</th>
                    <th className="text-left font-medium px-6 py-3">Quando</th>
                  </tr>
                </thead>
                <tbody>
                  {alteracoes.slice(0, 20).map((a) => (
                    <tr key={a.id} className="border-b border-border/60 last:border-0">
                      <td className="px-6 py-3 font-medium">{clientName(a.cliente_id)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{TIPO_LABEL[a.tipo]}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{a.tamanho}</td>
                      <td className="px-4 py-3 text-muted-foreground">{FASE_LABEL[a.fase]}</td>
                      <td className="px-4 py-3 text-muted-foreground">{ORIGEM_LABEL[a.origem]}</td>
                      <td className="px-6 py-3 text-muted-foreground">{new Date(a.criado_em).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <Card className="p-5 border-border">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </Card>
  );
}

function BreakCard({ title, data, colors }: { title: string; data: { name: string; value: number }[]; colors: string[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <Card className="p-6 border-border">
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((d, i) => {
          const pct = total ? (d.value / total) * 100 : 0;
          return (
            <div key={d.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{d.name}</span>
                <span className="text-muted-foreground">{d.value} <span className="text-xs">({pct.toFixed(0)}%)</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="p-12 border-border border-dashed text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
        <ListPlus className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-medium">Nenhuma alteração registrada</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Cada alteração registrada aqui vira dado para definir, em 1–2 meses, quantas alterações estarão inclusas no contrato.
      </p>
      <Link to="/alteracoes/nova" className="inline-block mt-5">
        <Button>Registrar primeira alteração</Button>
      </Link>
    </Card>
  );
}
