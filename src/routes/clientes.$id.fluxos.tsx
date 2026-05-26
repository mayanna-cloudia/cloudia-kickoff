import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@/components/fluxos/cloudia-flow.css";

import { supabase } from "@/integrations/supabase/client";
import { AuthGate } from "@/components/auth-gate";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, RotateCcw, Menu } from "lucide-react";
import { toast } from "sonner";
import {
  FLUXOS_PADRAO,
  TIPOS_NO,
  VARIACOES_LABEL,
  type VariacaoFluxo,
  type TipoNo,
} from "@/lib/fluxos-padrao";
import { FluxoNode, TIPO_CONFIG } from "@/components/fluxos/fluxo-node";
import { useAutoSave } from "@/lib/use-auto-save";

export const Route = createFileRoute("/clientes/$id/fluxos")({
  head: () => ({ meta: [{ title: "Fluxos do robô — Cloudia" }] }),
  component: () => (
    <AuthGate>
      <Toaster />
      <ReactFlowProvider>
        <FluxosEditor />
      </ReactFlowProvider>
    </AuthGate>
  ),
});

const VARIACOES: VariacaoFluxo[] = ["chatgpt", "integracao", "chatgpt_integracao"];
const nodeTypes = { fluxo: FluxoNode, fluxoNode: FluxoNode };

function FluxosEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<{ id: string; nome: string } | null>(null);
  const [variacao, setVariacao] = useState<VariacaoFluxo>("chatgpt");
  const [fluxos, setFluxos] = useState<Record<VariacaoFluxo, { nodes: Node[]; edges: Edge[] }>>({
    chatgpt: FLUXOS_PADRAO.chatgpt,
    integracao: FLUXOS_PADRAO.integracao,
    chatgpt_integracao: FLUXOS_PADRAO.chatgpt_integracao,
  });
  const [loaded, setLoaded] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  // Carregar cliente + fluxos
  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("clientes").select("id,nome").eq("id", id).single();
      if (!c) {
        toast.error("Cliente não encontrado");
        navigate({ to: "/clientes" });
        return;
      }
      setCliente(c as any);

      const { data: rows } = await supabase
        .from("fluxos_robo")
        .select("variacao,nodes,edges")
        .eq("cliente_id", id);

      const normalizar = (ns: any[]) =>
        ns.map((n) => ({ ...n, type: n.type ?? "fluxoNode" })) as Node[];

      const novos = { ...fluxos };
      for (const v of VARIACOES) {
        novos[v] = { nodes: normalizar(FLUXOS_PADRAO[v].nodes as any), edges: FLUXOS_PADRAO[v].edges as Edge[] };
      }
      for (const r of rows ?? []) {
        const v = (r as any).variacao as VariacaoFluxo;
        novos[v] = {
          nodes: normalizar(((r as any).nodes ?? []) as any[]),
          edges: ((r as any).edges ?? []) as Edge[],
        };
      }
      setFluxos(novos);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fluxoAtual = fluxos[variacao];

  const setFluxoAtual = useCallback(
    (patch: Partial<{ nodes: Node[]; edges: Edge[] }>) => {
      setFluxos((f) => ({ ...f, [variacao]: { ...f[variacao], ...patch } }));
    },
    [variacao]
  );

  // Auto-save: separado por variação
  const saveFn = useCallback(
    async (snapshot: { nodes: Node[]; edges: Edge[] }) => {
      if (!loaded) return;
      const { error } = await supabase
        .from("fluxos_robo")
        .upsert(
          {
            cliente_id: id,
            variacao,
            nodes: snapshot.nodes as any,
            edges: snapshot.edges as any,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: "cliente_id,variacao" }
        );
      if (error) throw error;
    },
    [id, variacao, loaded]
  );
  const status = useAutoSave(fluxoAtual, saveFn);

  // Handlers React Flow
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setFluxoAtual({ nodes: applyNodeChanges(changes, fluxoAtual.nodes) }),
    [fluxoAtual, setFluxoAtual]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setFluxoAtual({ edges: applyEdgeChanges(changes, fluxoAtual.edges) }),
    [fluxoAtual, setFluxoAtual]
  );
  const onConnect = useCallback(
    (conn: Connection) => setFluxoAtual({ edges: addEdge(conn, fluxoAtual.edges) }),
    [fluxoAtual, setFluxoAtual]
  );

  const atualizarNo = useCallback(
    (nodeId: string, patch: any) => {
      const novos = fluxoAtual.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n
      );
      setFluxoAtual({ nodes: novos });
    },
    [fluxoAtual, setFluxoAtual]
  );
  const excluirNo = useCallback(
    (nodeId: string) => {
      setFluxoAtual({
        nodes: fluxoAtual.nodes.filter((n) => n.id !== nodeId),
        edges: fluxoAtual.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      });
    },
    [fluxoAtual, setFluxoAtual]
  );

  // Injeta callbacks nos nós
  const nodesComCallbacks = useMemo(
    () =>
      fluxoAtual.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onChange: (patch: any) => atualizarNo(n.id, patch),
          onDelete: () => excluirNo(n.id),
        },
      })),
    [fluxoAtual.nodes, atualizarNo, excluirNo]
  );

  // Drag & drop da sidebar
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const tipo = e.dataTransfer.getData("application/fluxo-tipo") as TipoNo;
      if (!tipo) return;
      const tipoInfo = TIPOS_NO.find((t) => t.tipo === tipo);
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const novoNo: Node = {
        id: `n_${Date.now()}`,
        type: "fluxo",
        position,
        data: { tipo, titulo: tipoInfo?.label ?? "Novo nó", descricao: "" },
      };
      setFluxoAtual({ nodes: [...fluxoAtual.nodes, novoNo] });
      setSidebarAberta(false);
    },
    [fluxoAtual.nodes, setFluxoAtual, screenToFlowPosition]
  );

  const restaurarPadrao = () => {
    if (!confirm(`Restaurar o fluxo padrão de "${VARIACOES_LABEL[variacao]}"? As alterações serão perdidas.`)) return;
    setFluxoAtual({ ...FLUXOS_PADRAO[variacao] });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <header className="border-b border-border bg-card px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/clientes" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Fluxos do robô</div>
            <div className="text-sm font-semibold truncate">{cliente?.nome ?? "…"}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground min-w-[60px] text-right">
            {status === "saving" && "Salvando…"}
            {status === "saved" && (
              <span className="flex items-center gap-1 justify-end text-emerald-600">
                <Check className="h-3 w-3" /> Salvo
              </span>
            )}
            {status === "error" && <span className="text-destructive">Erro</span>}
          </div>
          <Button size="sm" variant="outline" onClick={restaurarPadrao}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Restaurar padrão
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="md:hidden"
            onClick={() => setSidebarAberta((s) => !s)}
          >
            <Menu className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <div className="px-4 md:px-6 pt-3 bg-card border-b border-border">
        <Tabs value={variacao} onValueChange={(v) => setVariacao(v as VariacaoFluxo)}>
          <TabsList>
            {VARIACOES.map((v) => (
              <TabsTrigger key={v} value={v}>
                {VARIACOES_LABEL[v]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarAberta ? "block" : "hidden"
          } md:block w-56 border-r border-border bg-card p-3 overflow-y-auto absolute md:relative inset-y-0 left-0 z-20 md:z-0`}
          style={{ top: 0 }}
        >
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
            Arraste para o canvas
          </div>
          <div className="flex flex-col gap-2">
            {TIPOS_NO.map((t) => (
              <div
                key={t.tipo}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/fluxo-tipo", t.tipo);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-grab active:cursor-grabbing shadow-sm"
                style={{ background: t.cor, border: `1.5px solid ${t.corBorda}`, color: "#0f172a" }}
              >
                {t.label}
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 relative" ref={wrapperRef} style={{ background: "#0a0e1a" }}>
          <ReactFlow
            className="cloudia-flow"
            nodes={nodesComCallbacks}
            edges={fluxoAtual.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1e293b" />
            <Controls position="bottom-left" showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              position="bottom-right"
              nodeColor={(n) => {
                const tipo = (n.data as any)?.tipo as keyof typeof TIPO_CONFIG;
                return TIPO_CONFIG[tipo]?.corHex ?? "#3b82f6";
              }}
              maskColor="rgba(10, 14, 26, 0.6)"
              style={{ width: 160, height: 100 }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
