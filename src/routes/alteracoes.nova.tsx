import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alteracoes/nova")({
  head: () => ({ meta: [{ title: "Nova alteração — Cloudia Hub" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <NovaAlteracao />
    </AuthGate>
  ),
});

type Cliente = { id: string; nome: string };

const TIPOS = [
  { v: "texto", l: "Texto / copy" },
  { v: "fluxo", l: "Fluxo" },
  { v: "perguntas", l: "Perguntas" },
  { v: "tecnica", l: "Técnica" },
];
const TAMANHOS = [
  { v: "pequena", l: "< 15 min" },
  { v: "media", l: "15–60 min" },
  { v: "grande", l: "> 1 h" },
];
const FASES = [
  { v: "pre_treino", l: "Pré-treino" },
  { v: "pos_treino", l: "Pós-treino" },
  { v: "pos_golive", l: "Pós go-live" },
];
const ORIGENS = [
  { v: "whatsapp", l: "WhatsApp" },
  { v: "email", l: "E-mail" },
  { v: "reuniao", l: "Reunião" },
  { v: "outro", l: "Outro" },
];

function NovaAlteracao() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [configurador, setConfigurador] = useState("");
  const [tipo, setTipo] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [fase, setFase] = useState("");
  const [origem, setOrigem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("clientes").select("id,nome").order("nome").then(({ data }) => {
      setClientes((data as any) ?? []);
    });
    const last = typeof window !== "undefined" ? localStorage.getItem("cloudia.configurador") : null;
    if (last) setConfigurador(last);
  }, []);

  const filtered = clientes.filter((c) => c.nome.toLowerCase().includes(query.toLowerCase()));
  const selectedCliente = clientes.find((c) => c.id === clienteId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return toast.error("Selecione um cliente");
    if (!configurador || !tipo || !tamanho || !fase || !origem) return toast.error("Preencha todos os campos");
    setSaving(true);
    const { error } = await supabase.from("alteracoes").insert({
      cliente_id: clienteId,
      configurador,
      tipo,
      tamanho,
      fase,
      origem,
      descricao: descricao || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    localStorage.setItem("cloudia.configurador", configurador);
    toast.success("Alteração registrada");
    navigate({ to: "/" });
  };

  return (
    <div className="px-6 md:px-8 py-8 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Nova alteração</h1>
      <p className="mt-1 text-sm text-muted-foreground">Registre em 30 segundos. Esses dados calibram a faixa contratual.</p>

      <Card className="mt-6 p-6 border-border">
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5 relative">
            <Label>Cliente</Label>
            {selectedCliente ? (
              <div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
                <span className="text-sm">{selectedCliente.nome}</span>
                <button type="button" onClick={() => { setClienteId(null); setQuery(""); }} className="text-xs text-muted-foreground hover:text-foreground">
                  trocar
                </button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Buscar cliente…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowList(true); }}
                  onFocus={() => setShowList(true)}
                />
                {showList && (
                  <div className="absolute z-10 left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-md max-h-56 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
                        <span>Nenhum cliente</span>
                        <Link to="/clientes/novo" className="text-primary text-xs">Cadastrar novo →</Link>
                      </div>
                    ) : filtered.slice(0, 8).map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => { setClienteId(c.id); setShowList(false); }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-accent"
                      >
                        {c.nome}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Configurador</Label>
            <Input placeholder="Seu nome" value={configurador} onChange={(e) => setConfigurador(e.target.value)} />
          </div>

          <ChipGroup label="Tipo" options={TIPOS} value={tipo} onChange={setTipo} />
          <ChipGroup label="Tamanho" options={TAMANHOS} value={tamanho} onChange={setTamanho} />
          <ChipGroup label="Fase" options={FASES} value={fase} onChange={setFase} />
          <ChipGroup label="Origem" options={ORIGENS} value={origem} onChange={setOrigem} />

          <div className="space-y-1.5">
            <Label>Descrição <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: ajustar fluxo de retorno pós-consulta" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link to="/"><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" disabled={saving}>
              <Check className="h-4 w-4 mr-1.5" /> {saving ? "Salvando…" : "Registrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: { v: string; l: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm border transition-colors",
              value === o.v
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
