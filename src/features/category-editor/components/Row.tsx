import React, { useState, useRef, useEffect } from "react";
// Asegúrate que todas las importaciones de tipos son correctas
import { EditorRow, Product, TemplateAlignment } from "../types";
import ProductCard from "./ProductCard";
import ProductSelector from "./ProductSelector"; //
import { useCategoryStore } from "../../../store/categoryStore"; // Ajusta la ruta si es necesario

interface RowProps {
  row: EditorRow;
}

const Row: React.FC<RowProps> = ({ row }) => {
  // Estado local para controlar la visibilidad del selector de productos
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  // Ref-> ProductSelector
  const selectorRef = useRef<HTMLDivElement | null>(null);

  // Effect para cerrar el selector si se hace click fuera
  useEffect(() => {
    if (!isSelectorOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectorOpen]);

  // Acciones y estado del store Zustand
  const deleteRow = useCategoryStore((state) => state.deleteRow);
  const setRowTemplate = useCategoryStore((state) => state.setRowTemplate);
  const addProductToRow = useCategoryStore((state) => state.addProductToRow);
  const availableProducts = useCategoryStore(
    (state) => state.availableProducts
  );
  // -----------------------------------------------------------------

  // Función para determinar la alineación de la fila (sin cambios)
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

  // Manejador para cambiar plantilla (sin cambios)
  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const newTemplate = value === "" ? null : (value as TemplateAlignment);
    setRowTemplate(row.id, newTemplate);
  };

  // Manejador para eliminar fila (sin cambios)
  const handleDeleteRow = () => {
    deleteRow(row.id);
  };

  // ---- NUEVO: Manejador para cuando se selecciona un producto ----
  const handleProductSelected = (productBase: Product) => {
    addProductToRow(productBase, row.id); // Llama a la acción del store
    setIsSelectorOpen(false); // Cierra el selector
  };

  // Comprobar si la fila está llena
  const isRowFull = row.products.length >= 3;

  return (
    // Relative para posicionar elementos absolutos hijos
    <div className="border border-dashed border-gray-400 p-4 mb-4 bg-gray-50 relative min-h-[150px]">
      <div className="absolute top-1 left-2 text-xs text-gray-500 z-10 flex items-center gap-2">
        {" "}
        <span>
          ID: {row.id.substring(0, 6)} - Plantilla: {row.template || "Ninguna"}
        </span>
        <span> | </span>
        <select
          className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white" // Estilos ajustados
          value={row.template || ""}
          onChange={handleTemplateChange}
          aria-label="Seleccionar plantilla de alineación"
        >
          <option value="">Sin plantilla</option>
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
        <button
          className="hover:scale-110 transition-transform cursor-pointer text-lg" // Ajustado tamaño/clase
          onClick={handleDeleteRow}
          title="Eliminar Fila"
          aria-label={`Eliminar fila ${row.id.substring(0, 6)}`}
        >
          🗑️
        </button>
      </div>

      {/* CONTENEDOR SELECTOR PRODUCTO */}
      <div className="flex items-center justify-end" ref={selectorRef}>
        <button
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          disabled={isRowFull}
          className="bg-green-400 hover:bg-green-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
          title={
            isRowFull
              ? "La fila está llena (máx. 3 productos)"
              : "Añadir producto"
          }
          aria-label="Añadir producto"
        >
          +
        </button>
        {/* Renderizado Condicional del Selector */}
        {isSelectorOpen && (
          <ProductSelector
            availableProducts={availableProducts}
            onProductSelect={handleProductSelected}
            onClose={() => setIsSelectorOpen(false)}
          />
        )}
      </div>

      {/* CONTENEDOR PRODUCTOS */}
      <div
        className={`flex ${getAlignmentClass()} flex-wrap gap-4 mt-8 pt-2 min-h-[120px]`}
      >
        {row.products.length > 0 ? (
          row.products.map((product) => (
            <ProductCard key={product.id} product={product} rowId={row.id} />
          ))
        ) : (
          <div className="text-gray-400 w-full text-center flex flex-col items-center justify-center mb-10">
            Fila vacía
          </div>
        )}
      </div>
    </div>
  );
};

export default Row;
