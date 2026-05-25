import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildResumoMarkdown, postPipedriveNote } from "./pipedrive.server";

export const enviarResumoPipedrive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      kickoffId: z.string().uuid(),
      pipedriveLeadIdOverride: z.string().min(1).max(64).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: k, error } = await supabase
      .from("kickoffs")
      .select("*,clientes(*)")
      .eq("id", data.kickoffId)
      .single();
    if (error || !k) {
      return { ok: false as const, error: "Kickoff não encontrado" };
    }
    const cliente: any = (k as any).clientes;
    const leadId = data.pipedriveLeadIdOverride ?? cliente?.pipedrive_lead_id;
    if (!leadId) {
      return { ok: false as const, error: "Cliente não tem pipedrive_lead_id configurado" };
    }

    // Se veio um override, persistir no cliente pra próximas vezes
    if (data.pipedriveLeadIdOverride && data.pipedriveLeadIdOverride !== cliente?.pipedrive_lead_id) {
      await supabase.from("clientes").update({ pipedrive_lead_id: data.pipedriveLeadIdOverride }).eq("id", cliente.id);
    }

    const origin = process.env.SITE_URL ?? "https://cloudia-kickoff.lovable.app";
    const kickoffUrl = `${origin}/kickoffs/${data.kickoffId}`;
    const content = buildResumoMarkdown({ cliente, kickoff: k, kickoffUrl });

    const result = await postPipedriveNote({ dealOrLeadId: leadId, content });
    if (!result.ok) return { ok: false as const, error: result.error };
    return { ok: true as const, noteId: result.noteId, preview: content };
  });

export const previewResumoKickoff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ kickoffId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: k, error } = await supabase
      .from("kickoffs")
      .select("*,clientes(*)")
      .eq("id", data.kickoffId)
      .single();
    if (error || !k) return { ok: false as const, error: "Kickoff não encontrado" };
    const cliente: any = (k as any).clientes;
    const origin = process.env.SITE_URL ?? "https://cloudia-kickoff.lovable.app";
    const kickoffUrl = `${origin}/kickoffs/${data.kickoffId}`;
    return {
      ok: true as const,
      preview: buildResumoMarkdown({ cliente, kickoff: k, kickoffUrl }),
      pipedriveLeadId: cliente?.pipedrive_lead_id ?? null,
    };
  });
