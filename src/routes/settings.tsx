import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Ajustes — Cloudia Hub" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <SettingsPage />
    </AuthGate>
  ),
});

function SettingsPage() {
  const [id, setId] = useState<string | null>(null);
  const [valor, setValor] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("id,alteracoes_inclusas").limit(1).single().then(({ data }) => {
      if (data) {
        setId(data.id);
        setValor(data.alteracoes_inclusas?.toString() ?? "");
      }
    });
  }, []);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from("settings").update({
      alteracoes_inclusas: valor ? Number(valor) : null,
      atualizado_em: new Date().toISOString(),
    }).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Ajustes salvos");
  };

  return (
    <div className="px-6 md:px-8 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>
      <p className="mt-1 text-sm text-muted-foreground">Parâmetros usados pelo dashboard.</p>

      <Card className="mt-6 p-6 border-border space-y-4">
        <div className="space-y-1.5">
          <Label>Alterações inclusas no contrato</Label>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ainda não definido" />
          <p className="text-xs text-muted-foreground">
            Faixa atualmente prometida ao cliente. O dashboard compara com a distribuição real.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
        </div>
      </Card>
    </div>
  );
}
