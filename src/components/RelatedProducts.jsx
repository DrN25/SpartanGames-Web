import React from "react";
import { ShoppingCart, Tag, Eye, ChevronRight } from "./Icons";
import { productsCatalog } from "../data/storeData";

export default function RelatedProducts({ onAddToCart, onSelectProduct, isDarkMode, onNavigate }) {
  const items = productsCatalog.slice(0, 4);

  return (
    <section
      className={`py-12 px-4 max-w-7xl mx-auto border-t transition-colors ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#FFDE17] tracking-widest uppercase">
            Equipamiento Recomendado
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase mt-1">
            Productos Más Vendidos en Arequipa
          </h2>
        </div>
        <button
          onClick={() => onNavigate("catalog")}
          className="text-xs font-bold text-[#FFDE17] hover:underline flex items-center gap-1"
        >
          <span>Ver catálogo completo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const discount = item.oldPrice
            ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
            : 0;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between group ${
                isDarkMode
                  ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17]/60"
                  : "bg-white border-gray-200 hover:border-amber-400 shadow-sm"
              }`}
            >
              <div>
                <div
                  className={`relative rounded-xl p-4 flex items-center justify-center min-h-[160px] overflow-hidden mb-3 ${
                    isDarkMode ? "bg-black/40" : "bg-gray-50"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-[120px] object-contain group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/80 text-[#FFDE17] border border-[#FFDE17]/30">
                      {item.brand}
                    </span>
                    {discount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF334B] text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  {item.category}
                </div>
                <h3
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="font-bold text-xs line-clamp-2 hover:text-[#FFDE17] cursor-pointer transition-colors"
                >
                  {item.name}
                </h3>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-700/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-[#FF334B]">
                    S/. {item.price.toFixed(2)}
                  </div>
                  {item.oldPrice && (
                    <div className="text-[11px] line-through text-gray-500">
                      S/. {item.oldPrice.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className={`p-2 rounded-xl border text-xs ${
                      isDarkMode ? "border-gray-700 hover:text-[#FFDE17]" : "border-gray-300 hover:text-black"
                    }`}
                    title="Ver detalle"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onAddToCart && onAddToCart(item)}
                    className="p-2 rounded-xl bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
