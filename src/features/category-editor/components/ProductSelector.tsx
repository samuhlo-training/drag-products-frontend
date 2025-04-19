import React, { useState, useMemo } from "react";
import { Product } from "../types";

interface ProductSelectorProps {
  availableProducts: Product[];
  usedProducts: Product[];
  onProductSelect: (product: Product) => void;
  onClose: () => void;
  dropUp?: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  availableProducts,
  usedProducts,
  onProductSelect,
  onClose,
  dropUp = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar por baseId
  const filteredAvailableProducts = useMemo(() => {
    if (!usedProducts) return availableProducts;
    return availableProducts.filter(
      (product) => !usedProducts.some((p) => p.baseId === product.id)
    );
  }, [availableProducts, usedProducts]);

  // Filtrar por busqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return filteredAvailableProducts;
    }
    return filteredAvailableProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredAvailableProducts, searchTerm]);

  const handleSelect = (product: Product) => {
    onProductSelect(product); // callback a store
    onClose();
  };

  return (
    <div
      className={`absolute z-20 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto
        ${dropUp ? "" : "top-1 mt-1"}`}
    >
      {/* Input Búsqueda */}
      <div className="p-2 sticky top-0 bg-white border-b border-dashed">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1  text-sm"
        />
      </div>

      {/* Lista Productos Filtrados */}
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
            >
              <img
                src={product.imageUrl || "/src/assets/placeholder.jpg"}
                alt=""
                className="w-8 h-10 object-cover flex-shrink-0"
              />
              <span className="flex-grow">
                {product.name} ({product.price})
              </span>
            </li>
          ))
        ) : (
          <li className="px-3 py-2 text-sm text-gray-500 italic">
            No se encontraron productos.
          </li>
        )}
      </ul>

      <div className="p-2 border-t border-dashed sticky bottom-0 bg-gray-50">
        <button
          onClick={onClose}
          className="w-full text-center px-2 py-1 text-xs text-gray-600 hover:text-red-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProductSelector;
