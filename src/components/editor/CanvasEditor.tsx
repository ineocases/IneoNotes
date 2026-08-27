import { useEffect, useRef, useState } from "react";
import { Circle, Layer, Line, Rect, Stage, Text, Arrow } from "react-konva";
import type Konva from "konva";
import type { Element, Page, Point } from "../../types/models";
import { uid } from "../../utils/id";
import { useAppStore } from "../../stores/useAppStore";

function templateBackground(template: Page["template"], width: number, height: number) {
  const lines: React.ReactElement[] = [];
  if (template === "lined") {
    for (let y = 70; y < height; y += 36) lines.push(<Line key={`l-${y}`} points={[0, y, width, y]} stroke="#d5d7df" strokeWidth={1} />);
  }
  if (template === "grid" || template === "graph") {
    for (let x = 0; x < width; x += 30) lines.push(<Line key={`x-${x}`} points={[x, 0, x, height]} stroke="#dfe1e7" strokeWidth={0.7} />);
    for (let y = 0; y < height; y += 30) lines.push(<Line key={`y-${y}`} points={[0, y, width, y]} stroke="#dfe1e7" strokeWidth={0.7} />);
  }
  if (template === "dots") {
    for (let x = 20; x < width; x += 30) for (let y = 20; y < height; y += 30)
      lines.push(<Circle key={`d-${x}-${y}`} x={x} y={y} radius={1.2} fill="#c8cad3" />);
  }
  return lines;
}

export function CanvasEditor({ page, onChange }: { page: Page; onChange: (page: Page) => void }) {
  const tool = useAppStore((s) => s.tool);
  const color = useAppStore((s) => s.color);
  const strokeWidth = useAppStore((s) => s.strokeWidth);
  const zoom = useAppStore((s) => s.zoom);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [draft, setDraft] = useState<Point[]>([]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        useAppStore.getState().undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        useAppStore.getState().redo();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const pointer = () => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pos = stage.getPointerPosition();
    if (!pos) return null;
    return { x: pos.x / zoom, y: pos.y / zoom, pressure: 1 };
  };

  const start = () => {
    const p = pointer();
    if (!p || !["pen", "pencil", "highlighter", "eraser"].includes(tool)) return;
    setDrawing(true);
    setDraft([p]);
  };

  const move = () => {
    if (!drawing) return;
    const p = pointer();
    if (!p) return;
    setDraft((points) => [...points, p]);
  };

  const finish = () => {
    if (!drawing || draft.length < 2) {
      setDrawing(false);
      setDraft([]);
      return;
    }
    const now = Date.now();
    if (tool === "eraser") {
      const last = draft[draft.length - 1];
      const remaining = page.elements.filter((el) => {
        if (el.type !== "stroke") return true;
        return !el.points.some((p) => Math.hypot(p.x - last.x, p.y - last.y) < 25);
      });
      onChange({ ...page, elements: remaining, updatedAt: now });
    } else {
      const stroke: Element = {
        id: uid("stroke"), type: "stroke", points: draft, color,
        width: tool === "highlighter" ? strokeWidth * 4 : strokeWidth,
        opacity: tool === "highlighter" ? 0.25 : 1,
        tool, createdAt: now, updatedAt: now
      };
      onChange({ ...page, elements: [...page.elements, stroke], updatedAt: now });
    }
    setDrawing(false);
    setDraft([]);
  };

  const addText = () => {
    const text: Element = {
      id: uid("text"), type: "text", x: 100, y: 100, width: 320, height: 60,
      text: "Doble clic para editar", fontSize: 26, color, bold: false, italic: false,
      underline: false, align: "left", createdAt: Date.now(), updatedAt: Date.now()
    };
    onChange({ ...page, elements: [...page.elements, text] });
  };

  const addShape = (shape: "rectangle" | "circle" | "line" | "arrow") => {
    const item: Element = {
      id: uid("shape"), type: "shape", shape, x: 160, y: 220, width: 240, height: 120,
      color, strokeWidth, opacity: 1, createdAt: Date.now(), updatedAt: Date.now()
    };
    onChange({ ...page, elements: [...page.elements, item] });
  };

  return (
    <div className="relative flex h-full min-h-[calc(100vh-72px)] items-start justify-center overflow-auto bg-[#e9e9ee] p-8 dark:bg-[#0e1014]">
      <div className="origin-top-left shadow-2xl" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
        <Stage
          ref={stageRef}
          width={page.width}
          height={page.height}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={finish}
          onDblClick={() => tool === "text" && addText()}
          onContextMenu={(event) => event.evt.preventDefault()}
          className="touch-none"
        >
          <Layer>
            <Rect x={0} y={0} width={page.width} height={page.height} fill="white" />
            {templateBackground(page.template, page.width, page.height)}
            {page.elements.map((element) => {
              if (element.type === "stroke") return <Line key={element.id} points={element.points.flatMap((p) => [p.x, p.y])} stroke={element.color} strokeWidth={element.width} opacity={element.opacity} lineCap="round" lineJoin="round" tension={0.1} />;
              if (element.type === "text") return <Text key={element.id} x={element.x} y={element.y} width={element.width} text={element.text} fontSize={element.fontSize} fill={element.color} fontStyle={`${element.bold ? "bold " : ""}${element.italic ? "italic" : ""}`.trim() || "normal"} />;
              if (element.type === "shape" && element.shape === "rectangle") return <Rect key={element.id} x={element.x} y={element.y} width={element.width} height={element.height} stroke={element.color} strokeWidth={element.strokeWidth} opacity={element.opacity} />;
              if (element.type === "shape" && element.shape === "circle") return <Circle key={element.id} x={element.x + element.width / 2} y={element.y + element.height / 2} radius={Math.min(element.width, element.height) / 2} stroke={element.color} strokeWidth={element.strokeWidth} opacity={element.opacity} />;
              if (element.type === "shape" && element.shape === "arrow") return <Arrow key={element.id} points={[element.x, element.y, element.x + element.width, element.y + element.height]} stroke={element.color} fill={element.color} strokeWidth={element.strokeWidth} />;
              if (element.type === "shape") return <Line key={element.id} points={[element.x, element.y, element.x + element.width, element.y + element.height]} stroke={element.color} strokeWidth={element.strokeWidth} />;
              return null;
            })}
            {draft.length > 1 && <Line points={draft.flatMap((p) => [p.x, p.y])} stroke={color} strokeWidth={strokeWidth} lineCap="round" lineJoin="round" opacity={tool === "highlighter" ? 0.25 : 1} />}
          </Layer>
        </Stage>
      </div>
      <div className="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs shadow-lg backdrop-blur dark:bg-[#1b1d24]/90">
        {tool === "pen" ? "Lápiz" : tool === "pencil" ? "Portaminas" : tool === "highlighter" ? "Resaltador" : tool === "eraser" ? "Borrador" : tool === "text" ? "Texto" : "Seleccionar"}
      </div>
    </div>
  );
}