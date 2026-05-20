import { useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { FLUXOS_PADRAO, type VariacaoFluxo } from "@/lib/fluxos-padrao";
import { FluxoNode } from "./fluxo-node";

const nodeTypes = { fluxo: FluxoNode };

export function FluxoViewer({
  clienteId,
  variacao,
}: {
  clienteId: string;
  variacao: VariacaoFluxo;
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const { data } = await supabase
        .from("fluxos_robo")
        .select("nodes,edges")
        .eq("cliente_id", clienteId)
        .eq("variacao", variacao)
        .maybeSingle();

      if (cancelado) return;

      const fonte =
        data && (data as any).nodes?.length
          ? { nodes: (data as any).nodes as Node[], edges: ((data as any).edges ?? []) as Edge[] }
          : FLUXOS_PADRAO[variacao];

      // Marca os nós como read-only
      setNodes(fonte.nodes.map((n) => ({ ...n, data: { ...n.data, readOnly: true } })));
      setEdges(fonte.edges);
    })();
    return () => {
      cancelado = true;
    };
  }, [clienteId, variacao]);

  return (
    <div className="w-full h-[400px] md:h-[700px] rounded-lg border border-border bg-card overflow-hidden">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
