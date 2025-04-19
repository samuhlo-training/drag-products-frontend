import React from "react";
import { useCategoryStore } from "../../store/categoryStore"; // Ajusta ruta
import Row from "./components/Row";
import EditorToolbar from "./components/EditorToolbar";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const CategoryEditorView: React.FC = () => {
  // Obtener el estado del store Zustand
  const rows = useCategoryStore((state) => state.rows);
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);
  const moveRow = useCategoryStore((state) => state.moveRow);

  // Handler para drag & drop de filas
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      moveRow(oldIndex, newIndex);
    }
  }

  return (
    <div className="p-4">
      {" "}
      {/* Padding general */}
      <EditorToolbar />
      <div className="mt-4 editor-area overflow-auto">
        {" "}
        {/* Contenedor general del editor */}
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* El contenedor al que aplicaremos el zoom */}
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left", // Importante para que el zoom se expanda desde la esquina
                transition: "transform 0.2s ease-out", // Transición suave para el zoom
              }}
              className="space-y-4" // Espacio entre filas (alternativa a mb-4 en Row)
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
        </DndContext>
        {/* Aquí irá el DndContext de dnd-kit envolviendo las filas */}
      </div>
    </div>
  );
};

export default CategoryEditorView;
