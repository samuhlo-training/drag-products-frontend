import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  CategoryState,
  CategoryActions,
  EditorRow,
  Product,
  ProductId,
  RowId,
} from "../features/category-editor/types";

// --- Datos Fake Iniciales
const initialProducts: Product[] = [
  {
    id: uuidv4(),
    name: "Conjunto estampado",
    price: 49.95,
    imageUrl: "/photos/imagen-modelo-1.jpg",
  },
  {
    id: uuidv4(),
    name: "Conjunto vestido negro",
    price: 89.95,
    imageUrl: "/photos/imagen-modelo-2.jpg",
  },
  {
    id: uuidv4(),
    name: "Cinturon cuero antiguo",
    price: 19.95,
    imageUrl: "/photos/imagen-modelo-3.jpg",
  },
  {
    id: uuidv4(),
    name: "Pantalon pirata vaquero",
    price: 79.95,
    imageUrl: "/photos/imagen-modelo-4.jpg",
  },
  {
    id: uuidv4(),
    name: "Jeans cortos vaqueros",
    price: 29.95,
    imageUrl: "/photos/imagen-modelo-5.jpg",
  },
  {
    id: uuidv4(),
    name: "Blusa amarilla",
    price: 39.95,
    imageUrl: "/photos/imagen-modelo-6.jpg",
  },
];

const initialRows: EditorRow[] = [
  {
    id: uuidv4(),
    products: [{ ...initialProducts[0], id: uuidv4() }],
    template: "right",
  },
  {
    id: uuidv4(),
    products: [
      { ...initialProducts[1], id: uuidv4() },
      { ...initialProducts[2], id: uuidv4() },
    ],
    template: "left",
  },
  {
    id: uuidv4(),
    products: [
      { ...initialProducts[3], id: uuidv4() },
      { ...initialProducts[4], id: uuidv4() },
      { ...initialProducts[5], id: uuidv4() },
    ],
    template: "center",
  },
];
// --- Fin Datos Fake ---

export const useCategoryStore = create<CategoryState & CategoryActions>(
  (set) => ({
    // Estado Inicial
    rows: initialRows,
    availableProducts: initialProducts,
    zoomLevel: 1,

    // Acciones
    // AÑADIR FILA
    addRow: () =>
      set((state) => ({
        rows: [...state.rows, { id: uuidv4(), products: [], template: null }],
      })),

    // BORRAR FILA
    deleteRow: (rowId) =>
      set((state) => ({
        rows: state.rows.filter((row) => row.id !== rowId),
      })),

    setZoomLevel: (level) => set({ zoomLevel: Math.max(0.1, level) }), // Evitar zoom negativo

    // CAMBIO PLANTILLA DE FILA
    setRowTemplate: (rowId, template) =>
      set((state) => ({
        rows: state.rows.map((row) =>
          row.id === rowId ? { ...row, template: template } : row
        ),
      })),

    // BORRAR PRODUCTO DE LA FILA
    deleteProduct: (productId: ProductId, rowId: RowId) =>
      set((state) => ({
        rows: state.rows.map((row) => {
          if (row.id === rowId) {
            // Fila correcta se filtra producto
            const updatedProducts = row.products.filter(
              (product) => product.id !== productId
            );
            return { ...row, products: updatedProducts };
          }
          return row; // Devolvemos las otras filas sin cambios
        }),
      })),

    // AÑADIR PRODUCTO A LA FILA
    addProductToRow: (productBase: Product, rowId: RowId) =>
      set((state) => {
        // Encontrar la fila y verificar el límite
        const targetRowIndex = state.rows.findIndex((row) => row.id === rowId);
        if (targetRowIndex === -1) return state; // Fila no encontrada (improbable)

        const targetRow = state.rows[targetRowIndex];
        if (targetRow.products.length >= 3) {
          console.warn(
            `La fila ${rowId} ya tiene 3 productos. No se puede añadir más.`
          ); // O mostrar un mensaje al usuario
          return state; // Límite alcanzado, no hacer nada
        }

        // Crear una nueva instancia del producto con un ID único
        const newProductInstance: Product = {
          ...productBase, // Copia las propiedades base (name, price, imageUrl)
          id: uuidv4(), // Genera un NUEVO ID único para esta instancia
        };

        // Actualizar la fila de forma inmutable
        const updatedRow = {
          ...targetRow,
          products: [...targetRow.products, newProductInstance],
        };

        // Crear el nuevo array de filas
        const updatedRows = [...state.rows];
        updatedRows[targetRowIndex] = updatedRow;

        return { rows: updatedRows };
      }),

    // Agregar resto de acciones
  })
);
