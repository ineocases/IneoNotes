import { useRef, type ElementType } from "react";
import { MousePointer2, PenLine, Highlighter, Eraser, Type, Square, Circle, Minus, ArrowUpRight, Image as ImageIcon, Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";
import { ButtonIcon } from "../common/Modal";
import { useAppStore } from "../../stores/useAppStore";
import type { Tool } from "../../types/models";

const tools: [Tool, ElementType, string][] = [
  ["select", MousePointer2, "Selector"],
  ["pen", PenLine, "Pluma"],
  ["pencil", PenLine, "Lápiz"],
  ["highlighter", Highlighter, "Resaltador"],
  ["eraser", Eraser, "Borrador"],
  ["text", Type, "Texto"],
  ["rectangle", Square, "Rectángulo"],
  ["circle", Circle, "Círculo"],
  ["line", Minus, "Línea"],
  ["arrow", ArrowUpRight, "Flecha"]
];

export function EditorToolbar() {
  const tool = useAppStore((s) => s.tool);
  const setTool = useAppStore((s) => s.setTool);
  const color = useAppStore((s) => s.color);
  const setColor = useAppStore((s) => s.setColor);
  const width = useAppStore((s) => s.strokeWidth);
  const setWidth = useAppStore((s) => s.setStrokeWidth);
  const zoom = useAppStore((s) => s.zoom);
  const setZoom = useAppStore((s) => s.setZoom);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-black/5 bg-white/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-[#15171d]/95">
      {tools.map(([id, Icon, label]) => (
        <ButtonIcon key={id} label={label} onClick={() => setTool(id)}>
          <span className={`block rounded-lg p-1 ${tool === id ? "bg-primary/15 text-primary" : ""}`}><Icon size={19}/></span>
        </ButtonIcon>
      ))}
      <div className="mx-2 h-7 w-px bg-black/10 dark:bg-white/10" />
      <input aria-label="Color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
      <select aria-label="Grosor" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="rounded-lg border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10">
        <option value={2}>2 px</option><option value={3}>3 px</option><option value={5}>5 px</option><option value={8}>8 px</option><option value={12}>12 px</option>
      </select>
      <div className="ml-auto flex items-center">
        <ButtonIcon label="Deshacer" onClick={() => useAppStore.getState().undo()}><Undo2 size={19}/></ButtonIcon>
        <ButtonIcon label="Rehacer" onClick={() => useAppStore.getState().redo()}><Redo2 size={19}/></ButtonIcon>
        <ButtonIcon label="Alejar" onClick={() => setZoom(zoom - 0.1)}><ZoomOut size={19}/></ButtonIcon>
        <span className="min-w-12 text-center text-xs">{Math.round(zoom * 100)}%</span>
        <ButtonIcon label="Acercar" onClick={() => setZoom(zoom + 0.1)}><ZoomIn size={19}/></ButtonIcon>
        <ButtonIcon label="Insertar imagen" onClick={() => fileRef.current?.click()}><ImageIcon size={19}/></ButtonIcon>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" />
      </div>
    </div>
  );
}