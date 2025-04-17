import React from "react";
import { Product } from "../types"; // Ajusta ruta si es necesario

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="p-1 flex flex-col items-center justify-start max-w-lg hover:scale-105 hover:rounded-sm hover:shadow-md cursor-pointer transition-transform relative group">
      <img
        src={product.imageUrl || "/src/assets/placeholder.jpg"} // Fallback a placeholder
        alt={product.name}
        className="w-48 h-auto object-cover mb-2" // Ajusta tamaño según necesites
        onError={(e) => (e.currentTarget.src = "/src/assets/placeholder.jpg")} // Fallback si la imagen falla
      />
      <p className="text-[11px] font-medium uppercase truncate w-full text-left">
        {product.name}
      </p>
      <p className="text-[11px] text-gray-600 w-full text-left">
        {product.price} EUR
      </p>
      {/* Más adelante aquí irá la lógica de D&D (atributos draggable, etc.) */}
      {/* Botón de eliminar (se añadirá lógica después) */}
      <button
        className="absolute top-[-8px] right-[-8px] mt-1 mr-1 bg-red-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => console.log("Eliminar producto:", product.id)} // Placeholder
        aria-label={`Eliminar ${product.name}`}
      >
        X
      </button>
    </div>
  );
};

export default ProductCard;
