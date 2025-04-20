import React from "react";
import { useCategoryStore } from "../../store/categoryStore";

const alignmentMap: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const PreviewPage: React.FC = () => {
  const rows = useCategoryStore((state) => state.rows);

  return (
    <div className="min-h-screen bg-white">
      <main className="w-screen-fit mx-8 py-10 px-4 pt-16">
        {rows.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-12">
            No hay filas ni productos para mostrar.
          </p>
        ) : (
          rows.map((row) => (
            <section
              key={row.id}
              className={`mb-6 pb-8 ${
                alignmentMap[row.template || "left"]
              } flex flex-col `}
            >
              <div
                className={`flex gap-8 ${
                  alignmentMap[row.template || "left"]
                } flex-wrap`}
              >
                {row.products.length === 0 ? (
                  <div className="text-gray-300 italic py-8">Fila vacía</div>
                ) : (
                  row.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white overflow-hidden w-80 h-auto flex flex-col items-center "
                    >
                      <img
                        src={product.imageUrl || "/src/assets/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-[55vh] object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/src/assets/placeholder.jpg")
                        }
                      />
                      <div className="pt-2 w-full flex flex-col items-start">
                        <span className="text-[11px] font-medium uppercase truncate w-full text-left">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-gray-600 w-full text-left">
                          {product.price} EUR
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default PreviewPage;
