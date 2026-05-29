import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/kickoffs/$id/pdf")({
  head: () => ({ meta: [{ title: "Resumo do Kickoff — Cloudia" }] }),
  component: KickoffPDF,
});

const VARIACAO_LABEL: Record<string, string> = {
  chatgpt: "100% IA (ChatGPT)",
  integracao: "Apenas integração",
  chatgpt_integracao: "IA + Integração",
};

const MAPEAMENTO_PERGUNTAS: Record<string, string> = {
  unidades: "Tem mais de uma unidade?",
  sistema_agendamento: "Utiliza sistema de agendamento?",
  especialidades_profissionais: "Especialidades e profissionais",
  tipos_servico: "Tipos de serviço oferecidos",
  convenios: "Atende convênios?",
  clinicorp_horarios: "Horários cadastrados no Clinicorp?",
  clinicorp_horarios_diferentes: "Especialidades com horários diferentes?",
  clinicorp_migracao: "Em migração de outro sistema?",
};

function formatarResposta(val: any): string | null {
  if (val == null || val === "") return null;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && "resposta" in val) {
    if (!val.resposta) return null;
    const base = val.resposta === "sim" ? "Sim" : "Não";
    return val.detalhe ? `${base} — ${val.detalhe}` : base;
  }
  if (typeof val === "object" && "valor" in val) {
    return val.valor || null;
  }
  return null;
}

function KickoffPDF() {
  const { id } = Route.useParams();
  const [kickoff, setKickoff] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("kickoffs")
        .select("*,clientes(*)")
        .eq("id", id)
        .single();
      if (data) {
        setKickoff(data);
        setCliente((data as any).clientes);
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!loading && kickoff) {
      // Pequeno delay pra garantir que o conteúdo renderizou
      const t = setTimeout(() => window.print(), 800);
      return () => clearTimeout(t);
    }
  }, [loading, kickoff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Preparando PDF…
      </div>
    );
  }

  if (!kickoff || !cliente) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Kickoff não encontrado.</div>;
  }

  const v = kickoff.validacoes_contratuais ?? {};
  const m = kickoff.mapeamento ?? {};
  const dataReuniao = kickoff.data_reuniao
    ? new Date(kickoff.data_reuniao).toLocaleDateString("pt-BR")
    : "—";
  const responsavel = kickoff.ferias_programadas ?? "—";

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 2cm; size: A4; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: 'Inter', -apple-system, sans-serif; color: #111827; }
        .page { max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 28px; }
        .logo-text { font-size: 22px; font-weight: 700; color: #3b82f6; }
        .cliente-nome { font-size: 26px; font-weight: 700; margin: 6px 0; }
        .meta { font-size: 13px; color: #6b7280; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #3b82f6; margin-bottom: 10px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; }
        .card-label { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin-bottom: 3px; }
        .card-value { font-size: 14px; font-weight: 500; }
        .compromisso { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .compromisso-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; margin-top: 5px; }
        .compromisso-titulo { font-weight: 600; font-size: 13px; }
        .compromisso-desc { font-size: 12px; color: #4b5563; line-height: 1.5; }
        .q-row { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .q-row:last-child { border-bottom: none; }
        .q-label { font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 3px; }
        .q-value { font-size: 13px; color: #111827; }
        .highlight { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
        .print-btn { position: fixed; bottom: 24px; right: 24px; background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 4px 12px rgba(59,130,246,0.4); }
      `}</style>

      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="logo-text">Cloudia</div>
          <div className="cliente-nome">{cliente.nome}</div>
          <div className="meta">
            Reunião de kickoff · {dataReuniao}
            {cliente.gerente && ` · Conduzida por ${cliente.gerente}`}
          </div>
        </div>

        {/* Validação contratual */}
        {Object.keys(v).length > 0 && (
          <div className="section">
            <div className="section-title">O que foi contratado</div>
            <div className="grid-2">
              {[
                { key: "plano", label: "Plano" },
                { key: "mensalidade", label: "Mensalidade" },
                { key: "num_usuarios", label: "Usuários" },
                { key: "creditos", label: "Créditos" },
                { key: "integracao", label: "Integração" },
                { key: "whatsapp_tipo", label: "Tipo de WhatsApp" },
              ].map(({ key, label }) => {
                const val = formatarResposta(v[key]);
                if (!val) return null;
                return (
                  <div key={key} className="card">
                    <div className="card-label">{label}</div>
                    <div className="card-value">{val.replace(" ✅", "")}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cronograma */}
        <div className="section">
          <div className="section-title">Cronograma de implementação</div>
          <div className="grid-2">
            {[
              { label: "Kickoff / Validação", prazo: "Hoje" },
              { label: "1ª Configuração", prazo: "Até 7 dias úteis" },
              { label: "Alterações", prazo: "Até 7 dias úteis" },
              { label: "Treinamento", prazo: "3ª semana" },
              { label: "Finalização", prazo: "4ª semana" },
            ].map((e) => (
              <div key={e.label} className="card">
                <div className="card-label">{e.label}</div>
                <div className="card-value">{e.prazo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsável */}
        {responsavel !== "—" && (
          <div className="section">
            <div className="section-title">Responsável pela implementação</div>
            <div className="card">
              <div className="card-value">{responsavel}</div>
            </div>
          </div>
        )}

        {/* Desafio principal */}
        {kickoff.desafio_principal && (
          <div className="section">
            <div className="section-title">Principal desafio e expectativa</div>
            <div className="highlight">
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{kickoff.desafio_principal}</p>
            </div>
          </div>
        )}

        {/* Mapeamento */}
        {Object.keys(m).length > 0 && (
          <div className="section">
            <div className="section-title">Mapeamento da clínica</div>
            {Object.entries(MAPEAMENTO_PERGUNTAS).map(([key, pergunta]) => {
              const val = formatarResposta(m[key]);
              if (!val) return null;
              return (
                <div key={key} className="q-row">
                  <div className="q-label">{pergunta}</div>
                  <div className="q-value">{val}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo apresentada */}
        {kickoff.variacao_demo && (
          <div className="section">
            <div className="section-title">Demonstração apresentada</div>
            <div className="card">
              <div className="card-value">{VARIACAO_LABEL[kickoff.variacao_demo] ?? kickoff.variacao_demo}</div>
            </div>
          </div>
        )}

        {/* Próximos passos */}
        <div className="section">
          <div className="section-title">Próximos passos e compromissos</div>
          {[
            {
              titulo: "Participação do responsável",
              desc: "A participação ativa do responsável pela implementação é essencial — testes, feedbacks e go-live.",
            },
            {
              titulo: "Seguir o cronograma",
              desc: "Nosso processo é desenhado pra durar 30 dias. Qualquer atraso nos prazos adiará o go-live.",
            },
            {
              titulo: "Pendências",
              desc: kickoff.expectativa || "Nenhuma pendência registrada nesta reunião.",
            },
          ].map((c) => (
            <div key={c.titulo} className="compromisso">
              <div className="compromisso-dot" />
              <div>
                <div className="compromisso-titulo">{c.titulo}</div>
                <div className="compromisso-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer">
          Documento gerado em {new Date().toLocaleDateString("pt-BR")} · Cloudia · cloudia.com.br
        </div>
      </div>

      {/* Botão flutuante (desaparece na impressão) */}
      <button className="print-btn no-print" onClick={() => window.print()}>
        🖨️ Imprimir / Salvar PDF
      </button>
    </>
  );
}