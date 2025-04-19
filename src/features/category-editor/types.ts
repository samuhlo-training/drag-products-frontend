export type ProductId = string;
export type RowId = string;
export type TemplateAlignment = "left" | "center" | "right";

export interface Product {
  id: ProductId;
  name: string;
  price: number; //
  imageUrl: string;
  baseId?: ProductId; // id del producto base, solo presente en instancias de filas
}

export interface EditorRow {
  id: RowId;
  products: Product[];
  template: TemplateAlignment | null; // null por si no tiene plantilla
}

export interface CategoryState {
  rows: EditorRow[];
  zoomLevel: number;
  availableProducts: Product[];
  // Next: añadir availableProducts si los obtienes de una API/lista
}

export interface CategoryActions {
  addRow: () => void;
  deleteRow: (rowId: RowId) => void;
  setZoomLevel: (level: number) => void;
  setRowTemplate: (rowId: RowId, template: TemplateAlignment | null) => void;
  deleteProduct: (productId: ProductId, rowId: RowId) => void;
  addProductToRow: (productBase: Product, rowId: RowId) => void;
  availableProducts: Product[];
  // ... acciones para productos
}
