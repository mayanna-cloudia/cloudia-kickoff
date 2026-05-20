import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CORES_NO, LABELS_TIPO, type TipoNo } from "@/lib/fluxos-padrao";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

type FluxoNodeData = {
  tipo: TipoNo;
  titulo: string;
  descricao: string;
  onChange?: (patch: Partial<{ titulo: string; descricao: string }>) => void;
  onDelete?: () => void;
  readOnly?: boolean;
};

export function FluxoNode({ data, selected }: NodeProps & { data: FluxoNodeData }) {
  const cores = CORES_NO[data.tipo] ?? CORES_NO.boas_vindas;
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [editandoDesc, setEditandoDesc] = useState(false);
  const [titulo, setTitulo] = useState(data.titulo);
  const [desc, setDesc] = useState(data.descricao);

  useEffect(() => setTitulo(data.titulo), [data.titulo]);
  useEffect(() => setDesc(data.descricao), [data.descricao]);

  const readOnly = data.readOnly;

  return (
    <div
      className="rounded-xl shadow-sm relative group"
      style={{
        background: cores.bg,
        border: `1.5px solid ${cores.border}`,
        width: 200,
        padding: "10px 12px",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: cores.border }} />

      <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-600 mb-1">
        {LABELS_TIPO[data.tipo]}
      </div>

      {editandoTitulo && !readOnly ? (
        <input
          autoFocus
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={() => {
            data.onChange?.({ titulo });
            setEditandoTitulo(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          className="w-full text-sm font-bold text-slate-900 bg-white/70 rounded px-1 py-0.5 outline-none"
        />
      ) : (
        <div
          onDoubleClick={() => !readOnly && setEditandoTitulo(true)}
          className="text-sm font-bold text-slate-900 leading-tight"
        >
          {data.titulo}
        </div>
      )}

      {editandoDesc && !readOnly ? (
        <textarea
          autoFocus
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => {
            data.onChange?.({ descricao: desc });
            setEditandoDesc(false);
          }}
          rows={2}
          className="w-full text-[11px] text-slate-700 mt-1 bg-white/70 rounded px-1 py-0.5 outline-none resize-none"
        />
      ) : (
        <div
          onDoubleClick={() => !readOnly && setEditandoDesc(true)}
          className="text-[11px] text-slate-700 mt-1 leading-snug"
        >
          {data.descricao || (!readOnly && <span className="italic text-slate-500">duplo clique para editar</span>)}
        </div>
      )}

      {!readOnly && selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow"
          title="Excluir nó"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: cores.border }} />
    </div>
  );
}
