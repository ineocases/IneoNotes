import { db } from "../database/db";
import type { Folder, Notebook, Page, SyncJob } from "../types/models";

export const localService = {
  listNotebooks: () => db.notebooks.orderBy("updatedAt").reverse().toArray(),
  getNotebook: (id: string) => db.notebooks.get(id),
  saveNotebook: async (notebook: Notebook) => {
    await db.notebooks.put(notebook);
    await queue("notebook", notebook.id, notebook);
  },
  deleteNotebook: async (id: string) => {
    await db.notebooks.delete(id);
    await db.pages.where("notebookId").equals(id).delete();
  },
  listPages: (notebookId: string) =>
    db.pages.where("notebookId").equals(notebookId).sortBy("updatedAt"),
  getPage: (id: string) => db.pages.get(id),
  savePage: async (page: Page) => {
    await db.pages.put(page);
    await queue("page", page.id, page);
  },
  deletePage: async (id: string) => db.pages.delete(id),
  listFolders: () => db.folders.orderBy("updatedAt").reverse().toArray(),
  saveFolder: async (folder: Folder) => {
    await db.folders.put(folder);
  }
};

async function queue(kind: SyncJob["kind"], entityId: string, payload: unknown): Promise<void> {
  const job: SyncJob = {
    id: `${kind}:${entityId}`,
    kind,
    action: "upsert",
    entityId,
    payload,
    updatedAt: Date.now(),
    attempts: 0
  };
  await db.syncQueue.put(job);
}