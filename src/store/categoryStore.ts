import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  CategoryState,
  CategoryActions,
  EditorRow,
  Product,
} from "../features/category-editor/types";

// --- Datos Fake Iniciales
const initialProducts: Product[] = [
  {
    id: uuidv4(),
    name: "Conjunto estampado",
    price: 49.95,
    imageUrl: "../public/photos/imagen-modelo-1.jpg",
  },
  {
    id: uuidv4(),
    name: "Conjunto vestido negro",
    price: 89.95,
    imageUrl: "../public/photos/imagen-modelo-2.jpg",
  },
  {
    id: uuidv4(),
    name: "Cinturon cuero antiguo",
    price: 19.95,
    imageUrl: "../public/photos/imagen-modelo-3.jpg",
  },
  {
    id: uuidv4(),
    name: "Pantalon pirata vaquero",
    price: 79.95,
    imageUrl: "../public/photos/imagen-modelo-4.jpg",
  },
  {
    id: uuidv4(),
    name: "Jeans cortos vaqueros",
    price: 29.95,
    imageUrl: "../public/photos/imagen-modelo-5.jpg",
  },
  {
    id: uuidv4(),
    name: "Blusa amarilla",
    price: 39.95,
    imageUrl: "../public/photos/imagen-modelo-6.jpg",
  },
];

const initialRows: EditorRow[] = [
  {
    id: uuidv4(),
    products: [initialProducts[0]],
    template: "right",
  },
  {
    id: uuidv4(),
    products: [initialProducts[1], initialProducts[2]],
    template: "left",
  },
  {
    id: uuidv4(),
    products: [
      initialProducts[3],
      { ...initialProducts[0], id: uuidv4() },
      { ...initialProducts[1], id: uuidv4() },
    ], // 3 productos (con copias para IDs únicos)
    template: "center",
  },
];
// --- Fin Datos Fake ---

export const useCategoryStore = create<CategoryState & CategoryActions>(
  (set) => ({
    // Estado Inicial
    rows: initialRows,
    zoomLevel: 1,

    // Acciones
    addRow: () =>
      set((state) => ({
        rows: [...state.rows, { id: uuidv4(), products: [], template: null }],
      })),

    deleteRow: (rowId) =>
      set((state) => ({
        rows: state.rows.filter((row) => row.id !== rowId),
      })),

    setZoomLevel: (level) => set({ zoomLevel: Math.max(0.1, level) }), // Evitar zoom negativo

    // Agregar resto de acciones
  })
);
