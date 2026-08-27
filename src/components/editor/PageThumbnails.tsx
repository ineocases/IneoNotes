import { useEffect, useState } from "react";
import type { Page } from "../../types/models";
import { localService } from "../../services/localService";
import { useAppStore } from "../../stores/useAppStore";
import { Button } from "../common/Button";

export function PageThumbnails({ notebookId, currentPageId, onSelect, onNew }: {
  notebookId: string; currentPageId?: string; onSelect: (page: Page) => void; onNew: () => void;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  useEffect(() => { void localService.listPages(notebookId).then(setPages); }, [notebookId, currentPageId]);
  return (
    <aside className="hidden w-48 shrink-0 border-r border-black/5 bg-white p-3 dark:border-white/10 dark:bg-[#15171d] lg:block">
      <Button variant="primary" className="mb-3 w-full" onClick={onNew}>+ Nueva página</Button>
      <div className="space-y-3 overflow-auto">
        {pages.map((page, index) => (
          <button key={page.id} onClick={() => onSelect(page)} className={`w-full rounded-xl border p-2 text-left ${page.id === currentPageId ? "border-primary ring-2 ring-primary/20" : "border-black/10 dark:border-white/10"}`}>
            <div className="mb-2 aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="h-full scale-[.12] origin-top-left" style={{ width: page.width, height: page.height }}>
                <div className="h-full w-full bg-white" />
              </div>
            </div>
            <span className="text-xs opacity-70">Página {index + 1}</span>
          </button>
        ))}
      </div>
      {pages.length === 0 && <div className="text-center text-xs opacity-50">Sin páginas todavía.</div>}
      <div className="mt-4 text-center text-[10px] opacity-40">Local-first · InkNest</div>
      <button className="hidden" onClick={() => useAppStore.getState().setCurrent(notebookId, currentPageId ?? null)} />
    </aside>
  );
}