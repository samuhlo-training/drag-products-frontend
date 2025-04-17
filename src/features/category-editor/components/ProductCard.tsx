import React from "react";
import { Product, RowId } from "../types"; // Ajusta ruta si es necesario
import { useCategoryStore } from "../../../store/categoryStore";

interface ProductCardProps {
  product: Product;
  rowId: RowId;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, rowId }) => {
  const deleteProduct = useCategoryStore((state) => state.deleteProduct);

  // Manejador para eliminar el producto
  const handleDeleteProduct = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita activar D&D u otros eventos del contenedor
    // Confirmacion necesaria ??
    // if (window.confirm(`¿Eliminar ${product.name}?`)) {
    deleteProduct(product.id, rowId);
    // }
  };
  return (
    <div className="p-1 flex flex-col items-center justify-start basis-[120px] min-w-[120px] max-w-[200px] flex-1 hover:scale-105 hover:rounded-sm hover:shadow-md cursor-pointer transition-transform relative group">
      <img
        src={product.imageUrl || "/src/assets/placeholder.jpg"} // Fallback a placeholder
        alt={product.name}
        className="w-full h-auto object-cover mb-2" // Ajusta tamaño según necesites
        onError={(e) => (e.currentTarget.src = "/src/assets/placeholder.jpg")} // Fallback si la imagen falla
      />
      <p className="text-[11px] font-medium uppercase truncate w-full text-left">
        {product.name}
      </p>
      <p className="text-[11px] text-gray-600 w-full text-left">
        {product.price} EUR
      </p>
      {/* Más adelante aquí irá la lógica de D&D (atributos draggable, etc.) */}
      {/* Botón de eliminar */}
      <button
        className="absolute top-[-8px] right-[-8px] m-1 bg-red-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDeleteProduct}
        aria-label={`Eliminar ${product.name}`}
        title={`Eliminar ${product.name}`}
      >
        &times;
      </button>
    </div>
  );
};

export default ProductCard;
