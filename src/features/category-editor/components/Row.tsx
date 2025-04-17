import React from "react";
import { EditorRow } from "../types";
import ProductCard from "./ProductCard";

interface RowProps {
  row: EditorRow;
}

const Row: React.FC<RowProps> = ({ row }) => {
  // Función para determinar la alineación de la fila
  const getAlignmentClass = () => {
    switch (row.template) {
      case "left":
        return "justify-start";
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  return (
    <div className="border border-dashed border-gray-400 p-4 mb-4 bg-gray-50 relative min-h-[150px]">
      {" "}
      {/* Añadido min-h para filas vacías */}
      {/* Info de la fila y controles (placeholder) */}
      <div className="absolute top-1 left-2 text-xs text-gray-500">
        ID: {row.id.substring(0, 6)} | Plantilla: {row.template || "Ninguna"}
        {/* Aquí irán botones para cambiar plantilla y eliminar fila */}
        <button
          className="ml-2 text-red-400 hover:text-red-700"
          onClick={() => console.log("Eliminar fila:", row.id)}
        >
          🗑️
        </button>
        <select
          className="ml-2 text-xs"
          value={row.template || ""}
          onChange={(e) =>
            console.log("Cambiar plantilla:", row.id, e.target.value)
          } // Placeholder
        >
          <option value="">Sin plantilla</option>
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>
      {/* Contenedor de productos con alineación */}
      <div className={`flex ${getAlignmentClass()} gap-4 mt-6`}>
        {" "}
        {/* Añadido mt-6 para dejar espacio a la info */}
        {row.products.length > 0 ? (
          row.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-gray-400 italic">
            Fila vacía (añade productos aquí)
          </div>
        )}
      </div>
      {/* Más adelante: Hacer esta fila arrastrable (D&D) y 'droppable' para productos */}
    </div>
  );
};

export default Row;
