import { useEffect, useMemo, useState } from "react";
import { FilePlus2, FolderPlus, Grid2X2, List, Search, Upload, Sparkles } from "lucide-react";
import { NotebookCard } from "../../components/library/NotebookCard";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { useAppStore } from "../../stores/useAppStore";
import { uid } from "../../utils/id";
import { localService } from "../../services/localService";

export function LibraryPage() {
  const { notebooks, loadLocal, createNotebook } = useAppStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Mi nuevo cuaderno");
  const [query, setQuery] = useState("");
  const [list, setList] = useState(false);

  useEffect(() => { void loadLocal(); }, [loadLocal]);

  const visible = useMemo(() => notebooks.filter((n) => !n.deletedAt && n.name.toLowerCase().includes(query.toLowerCase())), [notebooks, query]);

  const create = async () => {
    const notebook = await createNotebook(name.trim() || "Nuevo cuaderno");
    await localService.savePage({
      id: uid("page"), notebookId: notebook.id, title: "Página de bienvenida", template: "lined",
      width: 900, height: 1200, elements: [{
        id: uid("text"), type: "text", x: 100, y: 100, width: 700, height: 80,
        text: "Bienvenido a InkNest ✨", fontSize: 42, color: "#6750A4", bold: true,
        italic: false, underline: false, align: "left", createdAt: Date.now(), updatedAt: Date.now()
      }], createdAt: Date.now(), updatedAt: Date.now()
    });
    setOpen(false);
  };

  return (
    <div className="min-h-screen p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div><p className="text-sm font-medium text-primary">Tu espacio creativo</p><h1 className="text-3xl font-bold">Mis cuadernos</h1><p className="mt-1 text-sm opacity-60">Escribí, dibujá y organizá tus ideas sin perder el hilo.</p></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setOpen(true)}><FilePlus2 className="mr-2 inline" size={17}/>Nuevo cuaderno</Button>
          <Button onClick={() => setOpen(true)}><Upload className="mr-2 inline" size={17}/>Importar PDF</Button>
          <Button><FolderPlus className="mr-2 inline" size={17}/>Nueva carpeta</Button>
        </div>
      </header>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-3 opacity-40" size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cuadernos…" className="w-full rounded-2xl border border-black/10 bg-white py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#191b22]"/></div>
        <Button onClick={() => setList(!list)}>{list ? <Grid2X2 size={18}/> : <List size={18}/>}</Button>
      </div>
      {visible.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-[#191b22]">
          <Sparkles className="mx-auto mb-4 text-primary" size={36}/><h2 className="text-xl font-semibold">Tu biblioteca está lista para empezar</h2><p className="mx-auto mt-2 max-w-md text-sm opacity-60">Creá un cuaderno o probá el modo demo para explorar el editor.</p><Button variant="primary" className="mt-5" onClick={() => setOpen(true)}>Crear mi primer cuaderno</Button>
        </div>
      ) : (
        <div className={list ? "space-y-3" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}>
          {visible.map((notebook) => <NotebookCard key={notebook.id} notebook={notebook}/>)}
        </div>
      )}
      <Modal open={open} title="Crear cuaderno" onClose={() => setOpen(false)}>
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="mb-4 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
        <div className="flex justify-end gap-2"><Button onClick={() => setOpen(false)}>Cancelar</Button><Button variant="primary" onClick={create}>Crear</Button></div>
      </Modal>
    </div>
  );
}