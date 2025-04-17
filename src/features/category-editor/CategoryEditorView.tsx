import React from "react";
import { useCategoryStore } from "../../store/categoryStore"; // Ajusta ruta
import Row from "./components/Row";
import EditorToolbar from "./components/EditorToolbar";

const CategoryEditorView: React.FC = () => {
  // Obtener el estado del store Zustand
  const rows = useCategoryStore((state) => state.rows);
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);

  return (
    <div className="p-4">
      {" "}
      {/* Padding general */}
      <EditorToolbar />
      <div className="mt-4 editor-area overflow-auto">
        {" "}
        {/* Contenedor general del editor */}
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
        {/* Aquí irá el DndContext de dnd-kit envolviendo las filas */}
      </div>
    </div>
  );
};

export default CategoryEditorView;
