import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/clientes/$id/editar")({
  head: () => ({ meta: [{ title: "Editar cliente — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <EditarCliente />
    </AuthGate>
  ),
});

const VENDEDORES = ["Elis", "Samuel", "Aron", "Gabe", "Hiana", "André"];
const GERENTES = ["Gabi Rios", "Joice", "Debora", "Marcos"];
const CONFIGURADORES = ["Mayanna", "Bruna", "Dickson", "Pedro"];

const INTEGRACOES_GRUPOS: { grupo: string; itens: string[] }[] = [
  { grupo: "Triagem", itens: ["Triagem", "Triagem + IA", "100% IA"] },
  {
    grupo: "Odontológicas",
    itens: ["Controle Odonto", "Clinicorp", "Dontus", "Dental Office", "Oral Sin (Doctor Help)", "Sorridents (SISO)", "Odontoway", "Euroo", "Ortoplan / e-Clinica", "MedicIT"],
  },
  {
    grupo: "Médicas e Estética",
    itens: ["Feegow", "Amigo Tech (Amigo App)", "Dr e Cia", "Sigma Computel", "ViSaúde", "ANImati / NetRIS", "Vizi Saúde / App Health", "Tecnarte / Visual Asa", "Quark Clinic", "ProntMed", "Klingo", "Bossmed", "Moderna", "ClinicWeb", "Oral Sin (Franqueadora)"],
  },
  { grupo: "Estética", itens: ["Belle Software", "trinks"] },
  { grupo: "Outros", itens: ["Outro"] },
];

const SEM_FLAG_IA = ["Triagem", "Triagem + IA", "100% IA", "Outro", ""];

// Separar integração salva em base + flag IA
function parsearIntegracao(v: string | null): { base: string; comIa: boolean; outro: string } {
  if (!v) return { base: "", comIa: false, outro: "" };
  if (v.endsWith(" + IA")) {
    const base = v.slice(0, -5);
    return { base, comIa: true, outro: "" };
  }
  // Verificar se é um valor reconhecido
  const todasOpcoes = INTEGRACOES_GRUPOS.flatMap((g) => g.itens);
  if (todasOpcoes.includes(v)) return { base: v, comIa: false, outro: "" };
  return { base: "Outro", comIa: false, outro: v };
}

function EditarCliente() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [f, setF] = useState({
    nome: "",
    medico_contato: "",
    idclinic: "",
    especialidade: "",
    data_inicio: "",
    vendedor: "",
    gerente: "",
    configurador: "",
    plano: "",
    mensalidade: "",
    num_usuarios: "",
    creditos: "",
    integracao_base: "",
    integracao_com_ia: false,
    integracao_outro: "",
    expectativas: "",
  });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (error || !data) {
        toast.error("Cliente não encontrado");
        navigate({ to: "/clientes" });
        return;
      }
      const c = data as any;
      const intParsed = parsearIntegracao(c.integracao);
      setF({
        nome: c.nome ?? "",
        medico_contato: c.medico_contato ?? "",
        idclinic: c.idclinic?.toString() ?? "",
        especialidade: c.especialidade ?? "",
        data_inicio: c.data_inicio ?? "",
        vendedor: c.vendedor ?? "",
        gerente: c.gerente ?? "",
        configurador: c.configurador ?? "",
        plano: c.plano ?? "",
        mensalidade: c.mensalidade?.toString() ?? "",
        num_usuarios: c.num_usuarios?.toString() ?? "",
        creditos: c.creditos?.toString() ?? "",
        integracao_base: intParsed.base,
        integracao_com_ia: intParsed.comIa,
        integracao_outro: intParsed.outro,
        expectativas: c.expectativas ?? "",
      });
      setLoading(false);
    })();
  }, [id, navigate]);

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });

  const podeMarcarIa = !SEM_FLAG_IA.includes(f.integracao_base);

  const integracaoFinal = () => {
    if (f.integracao_base === "Outro") return f.integracao_outro || "Outro";
    if (!f.integracao_base) return "";
    if (SEM_FLAG_IA.includes(f.integracao_base)) return f.integracao_base;
    return f.integracao_com_ia ? `${f.integracao_base} + IA` : f.integracao_base;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nome) return toast.error("Nome da empresa é obrigatório");
    if (!f.idclinic) return toast.error("idclinic é obrigatório");
    setSaving(true);
    const { error } = await supabase.from("clientes").update({
      nome: f.nome,
      medico_contato: f.medico_contato || null,
      idclinic: f.idclinic ? Number(f.idclinic) : null,
      especialidade: f.especialidade || null,
      data_inicio: f.data_inicio || null,
      vendedor: f.vendedor || null,
      gerente: f.gerente || null,
      configurador: f.configurador || null,
      plano: f.plano || null,
      mensalidade: f.mensalidade ? Number(f.mensalidade) : null,
      num_usuarios: f.num_usuarios ? Number(f.num_usuarios) : null,
      creditos: f.creditos ? Number(f.creditos) : null,
      integracao: integracaoFinal() || null,
      expectativas: f.expectativas || null,
    }).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Cliente atualizado");
    navigate({ to: "/clientes" });
  };

  if (loading) return <div className="px-8 py-8 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="px-6 md:px-8 py-8 max-w-3xl mx-auto">
      <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Editar cliente</h1>
      <p className="mt-1 text-sm text-muted-foreground">{f.nome}</p>

      <Card className="mt-6 p-6 border-border">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldText label="Nome da Empresa" required value={f.nome} onChange={set("nome")} />
          <FieldText label="Contato Principal" value={f.medico_contato} onChange={set("medico_contato")} />
          <FieldText label="idclinic" required type="number" value={f.idclinic} onChange={set("idclinic")} placeholder="ID numérico" />
          <FieldText label="Categoria" placeholder="Ex.: Odontologia, Médico" value={f.especialidade} onChange={set("especialidade")} />
          <FieldText label="Data de início" type="date" value={f.data_inicio} onChange={set("data_inicio")} />
          <FieldDropdown label="Vendedor" value={f.vendedor} onChange={(v) => setF({ ...f, vendedor: v })} opcoes={VENDEDORES} />
          <FieldDropdown label="Gerente de contas" value={f.gerente} onChange={(v) => setF({ ...f, gerente: v })} opcoes={GERENTES} />
          <FieldDropdown label="Configurador" value={f.configurador} onChange={(v) => setF({ ...f, configurador: v })} opcoes={CONFIGURADORES} />
          <FieldText label="Plano" value={f.plano} onChange={set("plano")} />
          <FieldText label="Mensalidade (R$)" type="number" value={f.mensalidade} onChange={set("mensalidade")} />
          <FieldText label="Nº de usuários" type="number" value={f.num_usuarios} onChange={set("num_usuarios")} />
          <FieldText label="Créditos" type="number" value={f.creditos} onChange={set("creditos")} />

          <div className="md:col-span-2 space-y-1.5">
            <Label>Integração</Label>
            <select
              value={f.integracao_base}
              onChange={(e) => setF({ ...f, integracao_base: e.target.value, integracao_com_ia: false })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione…</option>
              {INTEGRACOES_GRUPOS.map((g) => (
                <optgroup key={g.grupo} label={g.grupo}>
                  {g.itens.map((i) => (<option key={i} value={i}>{i}</option>))}
                </optgroup>
              ))}
            </select>
            {podeMarcarIa && (
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <Checkbox checked={f.integracao_com_ia} onCheckedChange={(v) => setF({ ...f, integracao_com_ia: !!v })} />
                <span className="text-sm">Com IA</span>
              </label>
            )}
            {f.integracao_base === "Outro" && (
              <Input value={f.integracao_outro} onChange={set("integracao_outro")} placeholder="Qual integração?" className="mt-2" />
            )}
            {f.integracao_base && (
              <p className="text-xs text-muted-foreground mt-1">
                Será salvo como: <strong>{integracaoFinal() || "—"}</strong>
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label>Expectativas do cliente</Label>
            <Textarea value={f.expectativas} onChange={set("expectativas")} placeholder="O que o cliente espera com a Cloudia." rows={3} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Link to="/clientes"><Button type="button" variant="ghost">Cancelar</Button></Link>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-1.5" /> {saving ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function FieldText({ label, required, ...rest }: { label: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input {...rest} />
    </div>
  );
}

function FieldDropdown({ label, value, onChange, opcoes }: { label: string; value: string; onChange: (v: string) => void; opcoes: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="">Selecione…</option>
        {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}