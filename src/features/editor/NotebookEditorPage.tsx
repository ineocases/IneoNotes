import { useEffect, useState } from "react";
import { ArrowLeft, Cloud, CloudOff, Download, Menu, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorToolbar } from "../../components/editor/EditorToolbar";
import { CanvasEditor } from "../../components/editor/CanvasEditor";
import { PageThumbnails } from "../../components/editor/PageThumbnails";
import { localService } from "../../services/localService";
import { useAppStore } from "../../stores/useAppStore";
import type { Page } from "../../types/models";
import { exportPagePdf } from "../../features/pdf/exportPdf";
import { ButtonIcon } from "../../components/common/Modal";

export function NotebookEditorPage() {
  const { notebookId, pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const online = useAppStore((s) => s.online);
  const notebook = useAppStore((s) => s.notebooks.find((n) => n.id === notebookId));

  const load = async () => {
    if (!notebookId) return;
    let pages = await localService.listPages(notebookId);
    if (pages.length === 0) {
      const created = await useAppStore.getState().createPage(notebookId, "Página 1");
      pages = [created];
    }
    const selected = pages.find((p) => p.id === pageId) ?? pages[0];
    setPage(selected);
    useAppStore.getState().setCurrent(notebookId, selected.id);
  };

  useEffect(() => { void load(); }, [notebookId, pageId]);

  const save = async (next: Page) => {
    setPage(next);
    setSaving(true);
    await useAppStore.getState().updatePage(next);
    setTimeout(() => setSaving(false), 350);
  };

  if (!notebookId || !notebook) return <div className="p-8">Cuaderno no encontrado.</div>;
  if (!page) return <div className="grid min-h-screen place-items-center">Cargando editor…</div>;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-3 border-b border-black/5 bg-white px-3 dark:border-white/10 dark:bg-[#15171d]">
        <ButtonIcon label="Volver" onClick={() => navigate("/app")}><ArrowLeft size={20}/></ButtonIcon>
        <div className="min-w-0"><div className="truncate font-semibold">{notebook.name}</div><div className="text-xs opacity-50">{page.title}</div></div>
        <div className="ml-auto flex items-center gap-2 text-xs opacity-60">{online ? <Cloud size={16}/> : <CloudOff size={16}/>} {online ? "Sincronizado" : "Offline"} {saving ? " · Guardando…" : " · Guardado local"}</div>
        <ButtonIcon label="Exportar PDF" onClick={() => void exportPagePdf(page)}><Download size={19}/></ButtonIcon>
        <ButtonIcon label="Guardar" onClick={() => void save(page)}><Save size={19}/></ButtonIcon>
        <ButtonIcon label="Menú"><Menu size={19}/></ButtonIcon>
      </header>
      <EditorToolbar/>
      <div className="flex min-h-0 flex-1">
        <PageThumbnails notebookId={notebookId} currentPageId={page.id} onSelect={(p) => navigate(`/app/notebooks/${notebookId}/pages/${p.id}`)} onNew={() => void (async () => { const p = await useAppStore.getState().createPage(notebookId, "Página nueva"); setPage(p); navigate(`/app/notebooks/${notebookId}/pages/${p.id}`); })()}/>
        <main className="min-w-0 flex-1"><CanvasEditor page={page} onChange={(next) => void save(next)}/></main>
      </div>
    </div>
  );
}