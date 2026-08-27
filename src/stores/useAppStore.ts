import { create } from "zustand";
import type { Notebook, Page, Tool, UserProfile, Folder } from "../types/models";
import { localService } from "../services/localService";
import { uid } from "../utils/id";

interface AppState {
  profile: UserProfile | null;
  notebooks: Notebook[];
  folders: Folder[];
  currentNotebookId: string | null;
  currentPageId: string | null;
  tool: Tool;
  color: string;
  strokeWidth: number;
  zoom: number;
  darkMode: boolean;
  online: boolean;
  lastSavedAt: number | null;
  history: Page[][];
  historyIndex: number;
  loadLocal: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  createNotebook: (name?: string) => Promise<Notebook>;
  renameNotebook: (id: string, name: string) => Promise<void>;
  updateNotebook: (id: string, patch: Partial<Notebook>) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  restoreNotebook: (id: string) => Promise<void>;
  createPage: (notebookId: string, title?: string) => Promise<Page>;
  setCurrent: (notebookId: string | null, pageId: string | null) => void;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setZoom: (zoom: number) => void;
  toggleTheme: () => void;
  setOnline: (online: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: (page: Page) => void;
}

const themeKey = "inknest-theme";

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  notebooks: [],
  folders: [],
  currentNotebookId: null,
  currentPageId: null,
  tool: "pen",
  color: "#6750A4",
  strokeWidth: 3,
  zoom: 1,
  darkMode: localStorage.getItem(themeKey) === "dark",
  online: navigator.onLine,
  lastSavedAt: null,
  history: [],
  historyIndex: -1,

  loadLocal: async () => {
    const [notebooks, folders] = await Promise.all([
      localService.listNotebooks(),
      localService.listFolders()
    ]);
    set({ notebooks, folders });
  },

  setProfile: (profile) => set({ profile }),

  createNotebook: async (name = "Nuevo cuaderno") => {
    const now = Date.now();
    const notebook: Notebook = {
      id: uid("notebook"), name, color: "#6750A4", favorite: false,
      createdAt: now, updatedAt: now
    };
    await localService.saveNotebook(notebook);
    set((state) => ({ notebooks: [notebook, ...state.notebooks] }));
    return notebook;
  },

  renameNotebook: async (id, name) => {
    const notebook = get().notebooks.find((item) => item.id === id);
    if (!notebook) return;
    await get().updateNotebook(id, { name });
  },

  updateNotebook: async (id, patch) => {
    const notebook = get().notebooks.find((item) => item.id === id);
    if (!notebook) return;
    const next = { ...notebook, ...patch, updatedAt: Date.now() };
    await localService.saveNotebook(next);
    set((state) => ({ notebooks: state.notebooks.map((item) => item.id === id ? next : item) }));
  },

  moveToTrash: async (id) => get().updateNotebook(id, { deletedAt: Date.now() }),
  restoreNotebook: async (id) => get().updateNotebook(id, { deletedAt: undefined }),

  createPage: async (notebookId, title = "Página nueva") => {
    const now = Date.now();
    const page: Page = {
      id: uid("page"), notebookId, title, template: "blank",
      width: 900, height: 1200, elements: [], createdAt: now, updatedAt: now
    };
    await localService.savePage(page);
    return page;
  },

  setCurrent: (notebookId, pageId) => set({ currentNotebookId: notebookId, currentPageId: pageId }),

  updatePage: async (page) => {
    const next = { ...page, updatedAt: Date.now() };
    await localService.savePage(next);
    set({ lastSavedAt: Date.now(), currentPageId: next.id });
  },

  deletePage: async (pageId) => {
    await localService.deletePage(pageId);
  },

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2.5, zoom)) }),

  toggleTheme: () => set((state) => {
    const darkMode = !state.darkMode;
    localStorage.setItem(themeKey, darkMode ? "dark" : "light");
    return { darkMode };
  }),

  setOnline: (online) => set({ online }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    set({ historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    set({ historyIndex: historyIndex + 1 });
  },

  pushHistory: (page) => set((state) => {
    const trimmed = state.history.slice(0, state.historyIndex + 1);
    const next = [...trimmed, [page]];
    return { history: next, historyIndex: next.length - 1 };
  })
}));