import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({ meta: [{ title: "Novo cliente — Cloudia Hub" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <NovoCliente />
    </AuthGate>
  ),
});

function NovoCliente() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    nome: "", medico_contato: "", especialidade: "", data_inicio: "",
    vendedor: "", gerente: "", configurador: "", plano: "",
    mensalidade: "", num_usuarios: "", vencimento_dia: "", forma_pagamento: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nome) return toast.error("Nome é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("clientes").insert({
      nome: f.nome,
      medico_contato: f.medico_contato || null,
      especialidade: f.especialidade || null,
      data_inicio: f.data_inicio || null,
      vendedor: f.vendedor || null,
      gerente: f.gerente || null,
      configurador: f.configurador || null,
      plano: f.plano || null,
      mensalidade: f.mensalidade ? Number(f.mensalidade) : null,
      num_usuarios: f.num_usuarios ? Number(f.num_usuarios) : null,
      vencimento_dia: f.vencimento_dia ? Number(f.vencimento_dia) : null,
      forma_pagamento: f.forma_pagamento || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cliente cadastrado");
    navigate({ to: "/clientes" });
  };

  return (
    <div className="px-6 md:px-8 py-8 max-w-3xl mx-auto">
      <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Novo cliente</h1>
      <p className="mt-1 text-sm text-muted-foreground">Dados básicos. Detalhes contratuais são validados no kickoff (Fase 2).</p>

      <Card className="mt-6 p-6 border-border">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome da clínica" required value={f.nome} onChange={set("nome")} />
          <Field label="Médico de contato" value={f.medico_contato} onChange={set("medico_contato")} />
          <Field label="Especialidade" value={f.especialidade} onChange={set("especialidade")} />
          <Field label="Data de início" type="date" value={f.data_inicio} onChange={set("data_inicio")} />
          <Field label="Vendedor" value={f.vendedor} onChange={set("vendedor")} />
          <Field label="Gerente de contas" value={f.gerente} onChange={set("gerente")} />
          <Field label="Configurador" value={f.configurador} onChange={set("configurador")} />
          <Field label="Plano" value={f.plano} onChange={set("plano")} />
          <Field label="Mensalidade (R$)" type="number" value={f.mensalidade} onChange={set("mensalidade")} />
          <Field label="Nº de usuários" type="number" value={f.num_usuarios} onChange={set("num_usuarios")} />
          <Field label="Dia de vencimento" type="number" value={f.vencimento_dia} onChange={set("vencimento_dia")} />
          <Field label="Forma de pagamento" value={f.forma_pagamento} onChange={set("forma_pagamento")} />

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Link to="/clientes"><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" disabled={saving}>
              <Check className="h-4 w-4 mr-1.5" /> {saving ? "Salvando…" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, required, ...rest }: { label: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input {...rest} />
    </div>
  );
}
