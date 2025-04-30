import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
// Importa arrayMove de dnd-kit utilities
import { arrayMove } from "@dnd-kit/sortable";
import {
  CategoryState,
  CategoryActions,
  EditorRow,
  Product,
  ProductId,
  RowId,
} from "../features/category-editor/types/types";

// --- Datos Fake ---
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
  {
    id: uuidv4(),
    name: "Conjunto vestido negro",
    price: 89.95,
    imageUrl: "/photos/imagen-modelo-7.jpg",
  },
  {
    id: uuidv4(),
    name: "Falda plisada azul",
    price: 34.95,
    imageUrl: "/photos/imagen-modelo-8.jpg",
  },
  {
    id: uuidv4(),
    name: "Camisa lino blanca",
    price: 44.95,
    imageUrl: "/photos/imagen-modelo-9.jpg",
  },
  {
    id: uuidv4(),
    name: "Chaqueta vaquera clásica",
    price: 69.95,
    imageUrl: "/photos/imagen-modelo-10.jpg",
  },
  {
    id: uuidv4(),
    name: "Vestido flores primavera",
    price: 59.95,
    imageUrl: "/photos/imagen-modelo-11.jpg",
  },
  {
    id: uuidv4(),
    name: "Shorts deportivos",
    price: 24.95,
    imageUrl: "/photos/imagen-modelo-12.jpg",
  },
  {
    id: uuidv4(),
    name: "Sudadera oversize gris",
    price: 49.95,
    imageUrl: "/photos/imagen-modelo-13.jpg",
  },
  {
    id: uuidv4(),
    name: "Abrigo largo camel",
    price: 109.95,
    imageUrl: "/photos/imagen-modelo-14.jpg",
  },
  {
    id: uuidv4(),
    name: "Jersey trenzado beige",
    price: 39.95,
    imageUrl: "/photos/imagen-modelo-15.jpg",
  },
  {
    id: uuidv4(),
    name: "Mono corto estampado",
    price: 54.95,
    imageUrl: "/photos/imagen-modelo-16.jpg",
  },
  {
    id: uuidv4(),
    name: "Top de tirantes",
    price: 19.95,
    imageUrl: "/photos/imagen-modelo-17.jpg",
  },
  {
    id: uuidv4(),
    name: "Pantalón cargo verde",
    price: 59.95,
    imageUrl: "/photos/imagen-modelo-18.jpg",
  },
  {
    id: uuidv4(),
    name: "Camisa cuadros rojos",
    price: 29.95,
    imageUrl: "/photos/imagen-modelo-19.jpg",
  },
  {
    id: uuidv4(),
    name: "Falda midi floral",
    price: 44.95,
    imageUrl: "/photos/imagen-modelo-20.jpg",
  },
  {
    id: uuidv4(),
    name: "Camiseta básica negra",
    price: 14.95,
    imageUrl: "/photos/imagen-modelo-21.jpg",
  },
];

const initialRows: EditorRow[] = [
  {
    id: uuidv4(),
    products: [
      { ...initialProducts[0], id: uuidv4(), baseId: initialProducts[0].id },
    ],
    template: "right",
  },
  {
    id: uuidv4(),
    products: [
      { ...initialProducts[1], id: uuidv4(), baseId: initialProducts[1].id },
      { ...initialProducts[2], id: uuidv4(), baseId: initialProducts[2].id },
    ],
    template: "left",
  },
  {
    id: uuidv4(),
    products: [
      { ...initialProducts[3], id: uuidv4(), baseId: initialProducts[3].id },
      { ...initialProducts[4], id: uuidv4(), baseId: initialProducts[4].id },
      { ...initialProducts[5], id: uuidv4(), baseId: initialProducts[5].id },
    ],
    template: "center",
  },
];
// --- Fin Datos Fake ---

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  persist(
    (set) => ({
      // Estado Inicial
      rows: initialRows,
      availableProducts: initialProducts,
      zoomLevel: 1,

      // Acciones
      // AÑADIR FILA
      addRow: () =>
        set((state) => ({
          rows: [
            ...state.rows,
            { id: uuidv4(), products: [], template: "center" },
          ],
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
          // Extra de seguridad, para no duplicar
          const isUsed = state.rows.some((row) =>
            row.products.some((p) => p.baseId === productBase.id)
          );
          if (isUsed) {
            console.warn(
              `El producto con id ${productBase.id} ya está en alguna fila.`
            );
            return state;
          }

          // Encontrar fila y verificar límite
          const targetRowIndex = state.rows.findIndex(
            (row) => row.id === rowId
          );
          if (targetRowIndex === -1) return state; // Fila no encontrada (improbable)

          const targetRow = state.rows[targetRowIndex];
          if (targetRow.products.length >= 3) {
            console.warn(
              `La fila ${rowId} ya tiene 3 productos. No se puede añadir más.`
            );
            return state;
          }

          // Crear una nueva instancia del producto (id único y baseId)
          const newProductInstance: Product = {
            ...productBase,
            id: uuidv4(),
            baseId: productBase.id,
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

      // Acción para mover productos dentro de una fila
      moveProductInRow: (rowId: RowId, oldIndex: number, newIndex: number) =>
        set((state) => {
          const rowIndex = state.rows.findIndex((row) => row.id === rowId);
          if (rowIndex === -1) return state;
          const row = state.rows[rowIndex];
          const newProducts = [...row.products];
          const [removed] = newProducts.splice(oldIndex, 1);
          newProducts.splice(newIndex, 0, removed);
          const newRows = [...state.rows];
          newRows[rowIndex] = { ...row, products: newProducts };
          return { rows: newRows };
        }),

      // --- ACCIÓN ORIGINAL: Mover una fila por índices ---
      moveRow: (oldIndex: number, newIndex: number) =>
        set((state) => {
          const newRows = [...state.rows];
          const [removed] = newRows.splice(oldIndex, 1);
          newRows.splice(newIndex, 0, removed);
          return { rows: newRows };
        }),

      // --- NUEVA ACCIÓN D&D: Mover una fila por IDs ---
      moveRowById: (activeId: RowId, overId: RowId) =>
        set((state) => {
          const oldIndex = state.rows.findIndex((row) => row.id === activeId);
          const newIndex = state.rows.findIndex((row) => row.id === overId);

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            return state; // No mover si no se encuentran o son el mismo
          }
          // Reordenar el array de filas
          return { rows: arrayMove(state.rows, oldIndex, newIndex) };
        }),

      // --- NUEVA ACCIÓN D&D: Mover un producto entre filas ---
      moveProduct: (
        productId: ProductId,
        sourceRowId: RowId,
        targetRowId: RowId
      ) =>
        set((state) => {
          const sourceRowIndex = state.rows.findIndex(
            (r) => r.id === sourceRowId
          );
          const targetRowIndex = state.rows.findIndex(
            (r) => r.id === targetRowId
          );

          if (sourceRowIndex === -1 || targetRowIndex === -1) return state; // No encontrado

          const sourceRow = state.rows[sourceRowIndex];
          const targetRow = state.rows[targetRowIndex];
          const productToMove = sourceRow.products.find(
            (p) => p.id === productId
          );

          if (!productToMove) return state; // Producto no encontrado

          // Mover dentro de la misma fila (solo si se implementa reordenamiento interno)
          if (sourceRowId === targetRowId) {
            // TODO: Implementar lógica de reordenamiento dentro de la misma fila si es necesario
            // Por ahora, no hacemos nada si origen y destino son iguales
            console.log("Mover dentro de la misma fila - Lógica pendiente");
            return state;
          }

          // Mover a una fila diferente: verificar límite
          if (targetRow.products.length >= 3) {
            console.warn(`La fila destino ${targetRowId} está llena.`);
            // Podríamos añadir feedback visual al usuario aquí
            return state;
          }

          // Crear nuevos arrays de forma inmutable
          const newSourceProducts = sourceRow.products.filter(
            (p) => p.id !== productId
          );
          const newTargetProducts = [...targetRow.products, productToMove]; // Añadir al final

          // Crear nuevas filas actualizadas
          const updatedSourceRow = {
            ...sourceRow,
            products: newSourceProducts,
          };
          const updatedTargetRow = {
            ...targetRow,
            products: newTargetProducts,
          };

          // Crear el nuevo array general de filas
          const finalRows = [...state.rows];
          finalRows[sourceRowIndex] = updatedSourceRow;
          finalRows[targetRowIndex] = updatedTargetRow;

          return { rows: finalRows };
        }),

      // --- AUTORELLENAR FILAS ---
      autoFillRows: () =>
        set((state) => {
          const MAX_PER_ROW = 3;
          let rows = [...state.rows];
          // Productos ya usados (por baseId)
          const usedBaseIds = rows.flatMap((row) =>
            row.products.map((p) => p.baseId)
          );
          let availableProducts = state.availableProducts.filter(
            (p) => !usedBaseIds.includes(p.id)
          );
          // 1. Rellenar filas parcialmente llenas
          rows = rows.map((row) => {
            if (
              row.products.length < MAX_PER_ROW &&
              availableProducts.length > 0
            ) {
              const toAdd = Math.min(
                MAX_PER_ROW - row.products.length,
                availableProducts.length
              );
              const newProducts = availableProducts
                .slice(0, toAdd)
                .map((base) => ({
                  ...base,
                  id: uuidv4(),
                  baseId: base.id,
                }));
              availableProducts = availableProducts.slice(toAdd);
              return { ...row, products: [...row.products, ...newProducts] };
            }
            return row;
          });
          // 2. Crear nuevas filas llenas
          while (availableProducts.length > 0) {
            const toAdd = Math.min(MAX_PER_ROW, availableProducts.length);
            const newProducts = availableProducts
              .slice(0, toAdd)
              .map((base) => ({
                ...base,
                id: uuidv4(),
                baseId: base.id,
              }));
            rows.push({
              id: uuidv4(),
              products: newProducts,
              template: "center",
            });
            availableProducts = availableProducts.slice(toAdd);
          }
          return { rows };
        }),
    }),
    {
      name: "category-editor-store",
      partialize: (state) => ({
        rows: state.rows,
        availableProducts: state.availableProducts,
        zoomLevel: state.zoomLevel,
      }),
    }
  )
);
