import Dexie, { type Table } from "dexie";
import type { Folder, Notebook, Page, SyncJob, UserProfile } from "../types/models";

export class InkNestDB extends Dexie {
  notebooks!: Table<Notebook, string>;
  pages!: Table<Page, string>;
  folders!: Table<Folder, string>;
  syncQueue!: Table<SyncJob, string>;
  profile!: Table<UserProfile, string>;

  constructor() {
    super("InkNestDB");
    this.version(1).stores({
      notebooks: "id, updatedAt, favorite, folderId, deletedAt",
      pages: "id, notebookId, updatedAt",
      folders: "id, updatedAt",
      syncQueue: "id, updatedAt",
      profile: "id"
    });
  }
}

export const db = new InkNestDB();