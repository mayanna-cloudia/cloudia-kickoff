import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/kickoffs/novo")({
  head: () => ({ meta: [{ title: "Novo kickoff — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <NovoKickoff />
    </AuthGate>
  ),
});

type ClienteOption = { id: string; nome: string; especialidade: string | null; gerente: string | null };

function NovoKickoff() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [dataReuniao, setDataReuniao] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("clientes")
        .select("id,nome,especialidade,gerente")
        .order("criado_em", { ascending: false });
      setClientes((data as any) ?? []);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) return toast.error("Selecione um cliente");
    setSaving(true);
    const { data, error } = await supabase
      .from("kickoffs")
      .insert({ cliente_id: clienteId, data_reuniao: dataReuniao })
      .select("id")
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Kickoff criado");
    navigate({ to: "/kickoffs/$id", params: { id: data.id } });
  };

  return (
    <div className="px-6 md:px-8 py-8 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Novo kickoff</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha o cliente e a data da reunião. Os dados contratuais já cadastrados serão usados no wizard.
      </p>

      <Card className="mt-6 p-6 border-border">
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5">
            <Label>Cliente *</Label>
            {clientes.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhum cliente cadastrado.{" "}
                <Link to="/clientes/novo" className="text-primary hover:underline">
                  Cadastrar agora
                </Link>
              </div>
            ) : (
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente…" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                      {c.especialidade && <span className="text-muted-foreground"> · {c.especialidade}</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Data da reunião</Label>
            <Input
              type="date"
              value={dataReuniao}
              onChange={(e) => setDataReuniao(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link to="/">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving || !clienteId}>
              <Play className="h-4 w-4 mr-1.5" /> {saving ? "Criando…" : "Iniciar kickoff"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
