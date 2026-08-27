export type Tool =
  | "select"
  | "pen"
  | "pencil"
  | "highlighter"
  | "eraser"
  | "text"
  | "image"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "sticky";

export type Template =
  | "blank"
  | "lined"
  | "grid"
  | "dots"
  | "cornell"
  | "tasks"
  | "daily"
  | "weekly"
  | "graph";

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface StrokeElement {
  id: string;
  type: "stroke";
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  tool: Tool;
  createdAt: number;
  updatedAt: number;
}

export interface TextElement {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: "left" | "center" | "right";
  background?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShapeElement {
  id: string;
  type: "shape";
  shape: "rectangle" | "circle" | "line" | "arrow";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  opacity: number;
  createdAt: number;
  updatedAt: number;
}

export interface ImageElement {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  createdAt: number;
  updatedAt: number;
}

export interface StickyElement {
  id: string;
  type: "sticky";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export type Element = StrokeElement | TextElement | ShapeElement | ImageElement | StickyElement;

export interface Page {
  id: string;
  notebookId: string;
  title: string;
  template: Template;
  width: number;
  height: number;
  elements: Element[];
  createdAt: number;
  updatedAt: number;
  pdfDataUrl?: string;
}

export interface Notebook {
  id: string;
  name: string;
  color: string;
  cover?: string;
  favorite: boolean;
  folderId?: string;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
}

export interface SyncJob {
  id: string;
  kind: "notebook" | "page" | "element";
  action: "upsert" | "delete";
  entityId: string;
  payload: unknown;
  updatedAt: number;
  attempts: number;
}