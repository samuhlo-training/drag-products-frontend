export type ProductId = string;
export type RowId = string;
export type TemplateAlignment = "left" | "center" | "right";

export interface Product {
  id: ProductId;
  name: string;
  price: number; //
  imageUrl: string;
}

export interface EditorRow {
  id: RowId;
  products: Product[];
  template: TemplateAlignment | null; // null por si no tiene plantilla
}

export interface CategoryState {
  rows: EditorRow[];
  zoomLevel: number;
  // Next: añadir availableProducts si los obtienes de una API/lista
}

export interface CategoryActions {
  addRow: () => void;
  deleteRow: (rowId: RowId) => void;
  setZoomLevel: (level: number) => void;
  // ... acciones para productos
}
