import { Copy, MoreHorizontal, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ButtonIcon } from "../common/Modal";
import type { Notebook } from "../../types/models";
import { useAppStore } from "../../stores/useAppStore";

export function NotebookCard({ notebook }: { notebook: Notebook }) {
  const navigate = useNavigate();
  const updateNotebook = useAppStore((s) => s.updateNotebook);
  const moveToTrash = useAppStore((s) => s.moveToTrash);

  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#191b22]">
      <button className="block w-full text-left" onClick={() => navigate(`/app/notebooks/${notebook.id}`)}>
        <div className="h-40 p-5" style={{ background: `linear-gradient(135deg, ${notebook.color}, #ffffff66)` }}>
          <div className="flex h-full items-end rounded-2xl bg-white/75 p-4 shadow-inner backdrop-blur dark:bg-black/20">
            <div className="text-sm font-semibold text-black/75">{notebook.name}</div>
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between p-4">
        <div>
          <div className="font-medium">{notebook.name}</div>
          <div className="text-xs opacity-50">{new Date(notebook.updatedAt).toLocaleDateString("es-AR")}</div>
        </div>
        <div className="flex items-center">
          <ButtonIcon label="Favorito" onClick={() => updateNotebook(notebook.id, { favorite: !notebook.favorite })}>
            <Star size={17} fill={notebook.favorite ? "currentColor" : "none"} />
          </ButtonIcon>
          <ButtonIcon label="Duplicar" onClick={async () => {
            const copy = await useAppStore.getState().createNotebook(`${notebook.name} (copia)`);
            await updateNotebook(copy.id, { color: notebook.color });
          }}><Copy size={17}/></ButtonIcon>
          <ButtonIcon label="Enviar a papelera" onClick={() => moveToTrash(notebook.id)}><Trash2 size={17}/></ButtonIcon>
          <ButtonIcon label="Más opciones"><MoreHorizontal size={17}/></ButtonIcon>
        </div>
      </div>
    </article>
  );
}