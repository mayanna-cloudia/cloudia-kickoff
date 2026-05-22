import { useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@/components/fluxos/cloudia-flow.css";

import { supabase } from "@/integrations/supabase/client";
import { FluxoNode, TIPO_CONFIG } from "@/components/fluxos/fluxo-node";
import { FLUXOS_PADRAO } from "@/lib/fluxos-padrao";
import { Workflow } from "lucide-react";

const nodeTypes = { fluxoNode: FluxoNode };

export function FluxoReadOnly({
  clienteId,
  variacao,
  modoApresentacao,
}: {
  clienteId: string;
  variacao: string;
  modoApresentacao: boolean;
}) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      const { data } = await supabase
        .from("fluxos_robo")
        .select("nodes, edges")
        .eq("cliente_id", clienteId)
        .eq("variacao", variacao)
        .maybeSingle();

      const fluxo = data ?? FLUXOS_PADRAO[variacao as keyof typeof FLUXOS_PADRAO];
      const nodesReadOnly = (fluxo.nodes ?? []).map((n: any) => ({
        ...n,
        type: "fluxoNode",
        draggable: false,
        connectable: false,
        selectable: false,
        data: { ...n.data, readOnly: true },
      }));
      setNodes(nodesReadOnly);
      setEdges(fluxo.edges ?? []);
      setCarregando(false);
    })();
  }, [clienteId, variacao]);

  return (
    <div className="mt-6">
      {!modoApresentacao && (
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
          <Workflow className="h-3 w-3" /> Fluxo do robô
        </div>
      )}

      <div
        className="rounded-xl overflow-hidden border border-white/5"
        style={{
          height: window.innerWidth < 768 ? 400 : 700,
          background: "#0a0e1a",
        }}
      >
        {carregando ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Carregando fluxo…
          </div>
        ) : (
          <ReactFlowProvider>
            <ReactFlow
              className="cloudia-flow"
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              fitView
              proOptions={{ hideAttribution: false }}
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1e293b" />
              <Controls position="bottom-left" showInteractive={false} />
              <MiniMap
                position="bottom-right"
                nodeColor={(n) => {
                  const tipo = (n.data as any)?.tipo as keyof typeof TIPO_CONFIG;
                  return TIPO_CONFIG[tipo]?.corHex ?? "#3b82f6";
                }}
                maskColor="rgba(10, 14, 26, 0.6)"
                style={{ width: 160, height: 100 }}
              />
            </ReactFlow>
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}