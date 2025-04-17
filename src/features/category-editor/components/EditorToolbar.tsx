import React from "react";
import { useCategoryStore } from "../../../store/categoryStore"; // Ajusta ruta

const EditorToolbar: React.FC = () => {
  // Accedemos a las acciones y estado necesarios del store
  const addRow = useCategoryStore((state) => state.addRow);
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);
  const setZoomLevel = useCategoryStore((state) => state.setZoomLevel);

  const handleZoomIn = () => setZoomLevel(zoomLevel + 0.1);
  const handleZoomOut = () => setZoomLevel(zoomLevel - 0.1);

  return (
    <div className="bg-gray-100 p-2 mb-4 flex justify-between items-center sticky top-0 z-10 shadow">
      <div>
        {/* Placeholder para añadir productos disponibles */}
        <span className="text-sm mr-4 italic text-gray-500">
          Productos disponibles (próximamente)
        </span>
      </div>
      <div>
        <button
          onClick={addRow}
          className="bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm mr-2"
        >
          Añadir Fila
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.2} // Limite inferior de zoom
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded text-sm mr-1 disabled:opacity-50"
        >
          -
        </button>
        <span className="text-sm font-bold mx-1">
          Zoom {(zoomLevel * 100).toFixed(0)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 2.0} // Limite superior de zoom
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded text-sm ml-1 disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
