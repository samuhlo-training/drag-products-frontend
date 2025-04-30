import React, { useState } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import Row from "./components/Row";
import EditorToolbar from "./components/EditorToolbar";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProductCard from "./components/ProductCard";
import { Product, RowId, DragData, OverDragData } from "./types/types";

const CategoryEditorView: React.FC = () => {
  // Obtener el estado del store Zustand
  const rows = useCategoryStore((state) => state.rows);
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);
  const moveRowById = useCategoryStore((state) => state.moveRowById);
  const moveProduct = useCategoryStore((state) => state.moveProduct);
  const moveProductInRow = useCategoryStore((state) => state.moveProductInRow);

  // Estado para saber qué se está arrastrando (para DragOverlay)
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<DragData | null>(null);

  // Configuración de sensores (ratón/touch y teclado para accesibilidad)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Configuración para que sea más sensible al arrastre
      activationConstraint: {
        distance: 5, // Distancia mínima para activar el arrastre (en píxeles)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // IDs de las filas para SortableContext
  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);

  // --- Manejadores de Eventos D&D ---
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    const data = event.active.data.current as DragData;
    setActiveType(data?.type || null);
    setActiveData(data || null);
    console.log("Drag Start:", data?.type, event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Preservamos la referencia a los datos actuales
    const dragData = activeData;
    const dragType = activeType;

    // Limpiamos el estado activo
    setActiveId(null);
    setActiveType(null);
    setActiveData(null);

    if (!over) {
      console.log("Dropped outside a droppable area");
      return; // Se soltó fuera de un área válida
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log(
      `Type: ${dragType}, Active ID: ${activeId}, Over ID: ${overId}`
    );

    // --- Lógica para mover Filas ---
    if (dragType === "row" && activeId !== overId) {
      console.log(`Moving Row: ${activeId} over ${overId}`);
      moveRowById(activeId as RowId, overId as RowId);
      return; // Importante salir después de manejar
    }

    // --- Lógica para mover Productos ---
    if (dragType === "product" && dragData && "productId" in dragData) {
      const productId = dragData.productId;
      const sourceRowId = dragData.rowId;

      // Necesitamos obtener el rowId del contenedor 'over'
      let targetRowId: string | null = null;

      const overData = over.data.current as OverDragData | null;

      // Verificamos si es movimiento dentro de la misma fila
      if (overData?.type === "product") {
        // Está sobre otro producto
        targetRowId = overData.rowId || null;

        if (sourceRowId === targetRowId) {
          // Es movimiento dentro de la misma fila - reordenamos
          const sourceRow = rows.find((r) => r.id === sourceRowId);
          if (sourceRow) {
            const oldIndex = sourceRow.products.findIndex(
              (p) => p.id === productId
            );
            const newIndex = sourceRow.products.findIndex(
              (p) => p.id === overId
            );
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              moveProductInRow(sourceRowId, oldIndex, newIndex);
              return;
            }
          }
        }
      }

      // Si no fue movimiento dentro de la misma fila o no pudimos procesar el movimiento interno,
      // procedemos con movimiento entre filas

      // 1. El destino es una fila (por su id)
      if (overData?.type === "row") {
        targetRowId = over.id as string;
      }
      // 2. El destino es un producto (obtenemos su fila)
      else if (overData?.type === "product") {
        targetRowId = overData.rowId || null;
      }
      // 3. El destino es un contexto sortable
      else if (overData?.sortable?.containerId) {
        targetRowId = overData.sortable.containerId;
      }
      // 4. El destino es un ID de fila conocido (fallback)
      else if (typeof over.id === "string" && rowIds.includes(over.id)) {
        targetRowId = over.id;
      }

      console.log(
        `Attempting move Product: ${productId} from ${sourceRowId} to ${targetRowId}`
      );

      // Verificar que tenemos los datos necesarios y que es un movimiento entre filas diferentes
      if (
        productId &&
        sourceRowId &&
        targetRowId &&
        sourceRowId !== targetRowId
      ) {
        moveProduct(productId, sourceRowId, targetRowId);
      } else {
        console.warn("Could not move product - missing data or same row:", {
          productId,
          sourceRowId,
          targetRowId,
        });
      }
      return;
    }

    console.log("DragEnd unhandled:", event);
  }

  // Función para renderizar el elemento en DragOverlay
  const renderDragOverlay = () => {
    if (!activeId || !activeType) return null;

    if (activeType === "row") {
      // Encontrar la fila activa y renderizarla
      const activeRowData = rows.find((row) => row.id === activeId);
      return activeRowData ? (
        <Row row={activeRowData} isOverlay={true} />
      ) : null;
    }

    if (activeType === "product" && activeData && "productId" in activeData) {
      // Crear un objeto de producto para el overlay
      const product: Product = {
        id: activeData.productId,
        name: activeData.productName,
        price: activeData.productPrice,
        imageUrl: activeData.productImageUrl,
        baseId: activeData.baseId,
      };
      const sourceRowId = activeData.rowId;
      return <ProductCard product={product} rowId={sourceRowId} />;
    }

    return null;
  };

  return (
    <>
      <h1 className="bg-white text-xl uppercase font-thin text-center px-4">
        Editor de Categoría
      </h1>

      <div className="p-4 bg-white">
        <EditorToolbar />
        <div className="mt-4 editor-area overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {/* El contenedor al que aplicaremos el zoom */}
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "top left",
                  transition: "transform 0.2s ease-out",
                }}
                className="space-y-4"
              >
                {rows.length > 0 ? (
                  rows.map((row) => <Row key={row.id} row={row} />)
                ) : (
                  <p className="text-center text-gray-500 mt-10">
                    No hay filas. ¡Añade una para empezar!
                  </p>
                )}
              </div>
            </SortableContext>

            {/* DragOverlay para mostrar el elemento arrastrado */}
            <DragOverlay dropAnimation={null}>
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "top left",
                  transition: "transform 0.2s ease-out",
                  pointerEvents: "none",
                }}
              >
                {renderDragOverlay()}
              </div>
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default CategoryEditorView;
