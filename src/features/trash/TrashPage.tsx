import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAppStore } from "../../stores/useAppStore";

export function TrashPage() {
  const notebooks = useAppStore((s) => s.notebooks.filter((n) => n.deletedAt));
  const restore = useAppStore((s) => s.restoreNotebook);
  return (
    <div className="min-h-screen p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Papelera</h1>
      <p className="mt-1 text-sm opacity-60">Los cuadernos eliminados pueden restaurarse desde acá.</p>
      <div className="mt-8 space-y-3">
        {notebooks.map((n) => <div key={n.id} className="flex items-center justify-between rounded-2xl bg-white p-4 dark:bg-[#191b22]"><span>{n.name}</span><Button onClick={() => void restore(n.id)}><RotateCcw size={16} className="mr-2 inline"/>Restaurar</Button></div>)}
        {notebooks.length === 0 && <div className="rounded-2xl border border-dashed p-12 text-center opacity-50"><Trash2 className="mx-auto mb-3"/><p>La papelera está vacía.</p></div>}
      </div>
    </div>
  );
}