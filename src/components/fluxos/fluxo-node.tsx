import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { X, GripVertical } from "lucide-react";

// Cores por tipo de nó — usando paleta moderna com transparência
const TIPO_CONFIG: Record<
  string,
  { label: string; cor: string; corHex: string; corBg: string; corBorda: string }
> = {
  "boas-vindas": {
    label: "Boas-vindas",
    cor: "emerald",
    corHex: "#10b981",
    corBg: "rgba(16, 185, 129, 0.08)",
    corBorda: "rgba(16, 185, 129, 0.3)",
  },
  "menu-pergunta": {
    label: "Menu/Pergunta",
    cor: "blue",
    corHex: "#3b82f6",
    corBg: "rgba(59, 130, 246, 0.08)",
    corBorda: "rgba(59, 130, 246, 0.3)",
  },
  "coleta-dado": {
    label: "Coleta de dado",
    cor: "violet",
    corHex: "#8b5cf6",
    corBg: "rgba(139, 92, 246, 0.08)",
    corBorda: "rgba(139, 92, 246, 0.3)",
  },
  decisao: {
    label: "Decisão",
    cor: "amber",
    corHex: "#f59e0b",
    corBg: "rgba(245, 158, 11, 0.08)",
    corBorda: "rgba(245, 158, 11, 0.3)",
  },
  "acao-sistema": {
    label: "Ação de sistema",
    cor: "purple",
    corHex: "#a855f7",
    corBg: "rgba(168, 85, 247, 0.08)",
    corBorda: "rgba(168, 85, 247, 0.3)",
  },
  "transferencia-humana": {
    label: "Transferência humana",
    cor: "rose",
    corHex: "#f43f5e",
    corBg: "rgba(244, 63, 94, 0.08)",
    corBorda: "rgba(244, 63, 94, 0.3)",
  },
  sucesso: {
    label: "Sucesso",
    cor: "green",
    corHex: "#22c55e",
    corBg: "rgba(34, 197, 94, 0.08)",
    corBorda: "rgba(34, 197, 94, 0.3)",
  },
};

export type FluxoNodeData = {
  tipo: keyof typeof TIPO_CONFIG;
  titulo: string;
  descricao: string;
  onDelete?: () => void;
  onEdit?: () => void;
  readOnly?: boolean;
};

function FluxoNodeBase({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as FluxoNodeData;
  const config = TIPO_CONFIG[data.tipo] ?? TIPO_CONFIG["menu-pergunta"];

  return (
    <div
      className="group relative transition-all duration-150"
      style={{
        width: 220,
        background: `linear-gradient(135deg, ${config.corBg}, rgba(30, 35, 48, 0.95))`,
        border: `1px solid ${selected ? config.corHex : config.corBorda}`,
        borderRadius: 12,
        boxShadow: selected
          ? `0 0 0 2px ${config.corHex}33, 0 8px 24px rgba(0,0,0,0.4)`
          : "0 4px 12px rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Indicador colorido lateral */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: config.corHex,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      />

      {/* Botão deletar (só se editável) */}
      {!data.readOnly && data.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
          style={{ zIndex: 10 }}
          title="Excluir nó"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <div className="px-4 py-3 pl-5">
        {/* Label do tipo */}
        <div
          className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: config.corHex }}
        >
          {config.label}
        </div>

        {/* Título */}
        <div
          className="text-sm font-semibold leading-snug mb-1"
          style={{ color: "#f1f5f9" }}
          onDoubleClick={(e) => {
            if (!data.readOnly && data.onEdit) {
              e.stopPropagation();
              data.onEdit();
            }
          }}
        >
          {data.titulo || "Sem título"}
        </div>

        {/* Descrição */}
        {data.descricao && (
          <div className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
            {data.descricao}
          </div>
        )}
      </div>

      {/* Handles de conexão */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: config.corHex,
          width: 8,
          height: 8,
          border: "2px solid #0a0e1a",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: config.corHex,
          width: 8,
          height: 8,
          border: "2px solid #0a0e1a",
        }}
      />
    </div>
  );
}

export const FluxoNode = memo(FluxoNodeBase);

// Sidebar item arrastável — design moderno com ícone grip
export function NodeSidebarItem({
  tipo,
  onDragStart,
}: {
  tipo: keyof typeof TIPO_CONFIG;
  onDragStart: (e: React.DragEvent, tipo: string) => void;
}) {
  const config = TIPO_CONFIG[tipo];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tipo)}
      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${config.corBg}, rgba(30, 35, 48, 0.6))`,
        border: `1px solid ${config.corBorda}`,
      }}
    >
      <GripVertical
        className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ color: config.corHex }}
      />
      <div className="flex-1">
        <div
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: config.corHex }}
        >
          {config.label}
        </div>
      </div>
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: config.corHex }}
      />
    </div>
  );
}

export { TIPO_CONFIG };