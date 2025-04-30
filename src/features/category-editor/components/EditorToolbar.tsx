import React from "react";
import { useCategoryStore } from "../../../store/categoryStore";

const EditorToolbar: React.FC = () => {
  const addRow = useCategoryStore((state) => state.addRow);
  const rows = useCategoryStore((state) => state.rows);
  const availableProducts = useCategoryStore(
    (state) => state.availableProducts
  );
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);
  const setZoomLevel = useCategoryStore((state) => state.setZoomLevel);
  const deleteRow = useCategoryStore((state) => state.deleteRow);
  const autoFillRows = useCategoryStore((state) => state.autoFillRows);

  // Filtro de productos disponibles
  const usedBaseIds = rows.flatMap((row) => row.products.map((p) => p.baseId));
  const trulyAvailableProducts = availableProducts.filter(
    (prod) => !usedBaseIds.includes(prod.id)
  );

  // Filas vacías
  const emptyRows = rows.filter((row) => row.products.length === 0);
  const hasEmptyRows = emptyRows.length > 0;

  // Borrar todas las filas vacías
  const handleDeleteEmptyRows = () => {
    if (emptyRows.length === 0) return;
    emptyRows.forEach((row) => deleteRow(row.id));
  };

  // Borrar local storage
  const handleClearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleZoomIn = () => setZoomLevel(zoomLevel + 0.1);
  const handleZoomOut = () => setZoomLevel(zoomLevel - 0.1);

  return (
    <div className="bg-neutral-50 p-2 mb-4 px-2 flex justify-between items-center sticky top-0 z-10 shadow">
      <div className="flex items-center">
        <button
          onClick={addRow}
          disabled={trulyAvailableProducts.length === 0}
          className={`bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm mr-2 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400`}
          title={
            trulyAvailableProducts.length === 0
              ? "No hay productos disponibles para agregar"
              : "Agregar fila"
          }
          aria-label={
            trulyAvailableProducts.length === 0
              ? "No hay productos disponibles para agregar"
              : "Agregar fila"
          }
        >
          Añadir Fila
        </button>
        <button
          onClick={autoFillRows}
          disabled={trulyAvailableProducts.length === 0}
          className="bg-amber-300 hover:bg-amber-400 text-white font-bold py-1 px-3 rounded text-sm mr-2 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          title="Autorellenar filas con productos disponibles"
          aria-label="Autorellenar filas"
        >
          Autorellenar
        </button>
        <button
          onClick={() =>
            window.open(window.location.origin + "/preview", "_blank")
          }
          className="bg-purple-400 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded text-sm mr-2 cursor-pointer transition-opacity"
          title="Abrir vista previa en una nueva ventana"
          aria-label="Vista previa"
        >
          Vista Previa
        </button>
        {trulyAvailableProducts.length === 0 && hasEmptyRows && (
          <button
            onClick={handleDeleteEmptyRows}
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm mr-2 cursor-pointer transition-opacity"
            title="Eliminar todas las filas vacías"
            aria-label="Eliminar todas las filas vacías"
          >
            Borrar filas vacías
          </button>
        )}
        <button
          onClick={handleClearLocalStorage}
          className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm mr-2 cursor-pointer transition-opacity"
          title="Deshacer cambios"
          aria-label="Deshacer cambios"
        >
          Deshacer cambios
        </button>
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.2}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded text-sm mr-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          title="Zoom out"
          aria-label="Zoom out"
        >
          -
        </button>
        <span className="text-sm font-bold ml-1 hidden [@media(min-width:610px)]:inline">
          Zoom
        </span>
        <span className="text-sm font-bold mx-1">
          {(zoomLevel * 100).toFixed(0)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 2.0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded text-sm ml-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
