import React from "react";
import { Product, RowId } from "../types";
import { useCategoryStore } from "../../../store/categoryStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProductCardProps {
  product: Product;
  rowId: RowId;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, rowId }) => {
  const deleteProduct = useCategoryStore((state) => state.deleteProduct);
  const zoomLevel = useCategoryStore((state) => state.zoomLevel);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    data: {
      type: 'product',
      productId: product.id,
      rowId: rowId,
      // Datos para DragOverlay
      productName: product.name,
      productPrice: product.price,
      productImageUrl: product.imageUrl,
      baseId: product.baseId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
    opacity: isDragging ? 0.7 : 1,
    cursor: zoomLevel < 0.5 ? "grab" : "default",
  };

  const handleDeleteProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProduct(product.id, rowId);
  };

  // --- DRAG LISTENERS SEGUN ZOOM ---
  const dragListeners = zoomLevel < 0.5 ? { ...attributes, ...listeners } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-1 flex flex-col items-center justify-start basis-[120px] min-w-[120px] max-w-[200px] flex-1
        relative group
        ${
          isDragging
            ? ""
            : "hover:scale-105 hover:rounded-sm hover:shadow-md cursor-pointer transition-transform"
        }
      `}
      {...dragListeners}
    >
      {/* DRAG HANDLER*/}
      {zoomLevel >= 0.5 && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute left-[6px] top-[5px] m-1 bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-400 active:bg-gray-500 cursor-grab opacity-70 hover:opacity-100 z-0"
          tabIndex={0}
          title="Mover producto"
          aria-label="Mover producto"
          style={{ touchAction: "none" }}
        >
          <span className="text-[16px] line-height-[1] mb-[1px]">☰</span>
        </button>
      )}
      <img
        src={product.imageUrl || "/src/assets/placeholder.jpg"}
        alt={product.name}
        className="w-full h-auto object-cover mb-2"
        onError={(e) => (e.currentTarget.src = "/src/assets/placeholder.jpg")}
      />
      <p className="text-[11px] font-medium uppercase truncate w-full text-left">
        {product.name}
      </p>
      <p className="text-[11px] text-gray-600 w-full text-left">
        {typeof product.price === 'number' ? product.price : product.price} EUR
      </p>
      {/* Botón de eliminar */}
      {zoomLevel >= 0.5 && (
        <button
          type="button"
          className="absolute top-[5px] right-[6px] m-1 bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          onClick={handleDeleteProduct}
          aria-label={`Eliminar ${product.name}`}
          title={`Eliminar ${product.name}`}
          tabIndex={0}
        >
          X
        </button>
      )}
    </div>
  );
};

export default ProductCard;
