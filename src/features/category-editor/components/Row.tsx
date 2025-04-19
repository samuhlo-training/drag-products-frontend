import React, { useState, useRef, useEffect } from "react";
import { EditorRow, Product, TemplateAlignment } from "../types";
import ProductCard from "./ProductCard";
import ProductSelector from "./ProductSelector";
import { useCategoryStore } from "../../../store/categoryStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface RowProps {
  row: EditorRow;
}

const Row: React.FC<RowProps> = ({ row }) => {
  // 1. Drag & drop de la fila completa
  const {
    attributes: rowAttributes,
    listeners: rowListeners,
    setNodeRef: setRowNodeRef,
    transform: rowTransform,
    transition: rowTransition,
    isDragging: isRowDragging,
  } = useSortable({ id: row.id });

  const rowStyle = {
    transform: CSS.Transform.toString(rowTransform),
    transition: rowTransition,
    zIndex: isRowDragging ? 50 : undefined,
    opacity: isRowDragging ? 0.7 : 1,
    cursor: "default",
  };

  // Estado local para controlar la visibilidad del selector de productos
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);

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

  const deleteRow = useCategoryStore((state) => state.deleteRow);
  const setRowTemplate = useCategoryStore((state) => state.setRowTemplate);
  const addProductToRow = useCategoryStore((state) => state.addProductToRow);
  const availableProducts = useCategoryStore(
    (state) => state.availableProducts
  );
  const allRows = useCategoryStore((state) => state.rows);
  const moveProductInRow = useCategoryStore((state) => state.moveProductInRow);

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

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const newTemplate = value === "" ? null : (value as TemplateAlignment);
    setRowTemplate(row.id, newTemplate);
  };

  const handleDeleteRow = () => {
    deleteRow(row.id);
  };

  const handleProductSelected = (productBase: Product) => {
    addProductToRow(productBase, row.id);
    setIsSelectorOpen(false);
  };

  const isRowFull = row.products.length >= 3;

  // Handler de drag & drop para productos de la fila
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = row.products.findIndex((p) => p.id === active.id);
    const newIndex = row.products.findIndex((p) => p.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      moveProductInRow(row.id, oldIndex, newIndex);
    }
  }

  return (
    <div
      ref={setRowNodeRef}
      style={rowStyle}
      className={`border border-dashed border-gray-400 p-4 mb-2 bg-white relative min-h-[150px]`}
    >
      {/* DRAG HANDLE DE LA FILA */}
      <div className="absolute top-1 left-2 text-xs text-gray-500 z-10 flex items-center gap-2">
        <button
          type="button"
          {...rowAttributes}
          {...rowListeners}
          className=" m-1 bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-base hover:bg-gray-400 active:bg-gray-500 cursor-grab opacity-80 hover:opacity-100 z-30"
          tabIndex={0}
          title="Mover fila"
          aria-label="Mover fila"
          style={{ touchAction: "none" }}
        >
          <span className="text-[22px] line-height-[1] mb-[3px]">☰</span>
        </button>
        <span>
          ID: {row.id.substring(0, 6)} - Plantilla: {row.template || "Ninguna"}
        </span>
        <span> | </span>
        <select
          className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
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
          className="hover:scale-110 transition-transform cursor-pointer text-lg"
          onClick={handleDeleteRow}
          title="Eliminar Fila"
          aria-label={`Eliminar fila ${row.id.substring(0, 6)}`}
        >
          🗑️
        </button>
      </div>
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
        {isSelectorOpen && (
          <ProductSelector
            availableProducts={availableProducts}
            usedProducts={allRows.flatMap((r) => r.products)}
            onProductSelect={handleProductSelected}
            onClose={() => setIsSelectorOpen(false)}
          />
        )}
      </div>
      {/* DndContext y SortableContext para productos */}
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={row.products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={`flex ${getAlignmentClass()} flex-wrap gap-4 mt-3 pt-2 min-h-[120px]`}
          >
            {row.products.length > 0 ? (
              row.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rowId={row.id}
                />
              ))
            ) : (
              <div className="text-gray-400 w-full text-center flex flex-col items-center justify-center mb-5">
                Fila vacía
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Row;
