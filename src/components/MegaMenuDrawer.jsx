import React, { useState } from "react";
import { X, ChevronRight, Sparkles, Layers, ShieldCheck, Truck } from "./Icons";

export default function MegaMenuDrawer({
  isOpen,
  onClose,
  categories,
  isDarkMode,
  onSelectCategory,
  onNavigate
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  if (!isOpen) return null;

  const currentCategory = categories[activeCategoryIndex] || categories[0];

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    onNavigate("catalog");
    onClose();
  };

  const handleSubCategoryClick = (catId, subCat) => {
    onSelectCategory(catId);
    onNavigate("catalog");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container (Falabella style 2-panel) */}
      <div
        className={`relative z-10 w-full max-w-4xl h-full shadow-2xl flex flex-col transition-all duration-300 transform border-r ${
          isDarkMode
            ? "bg-[#0B0E14] border-gray-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFDE17] text-black flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider">
                Departamentos y Hardware
              </h2>
              <p className="text-[11px] text-gray-400">
                Selecciona una categoría para explorar el catálogo en Compuplaza Arequipa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-600 hover:text-black"
            }`}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Panel Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Panel Izquierdo: Categorías Principales */}
          <div
            className={`w-2/5 sm:w-1/3 border-r overflow-y-auto ${
              isDarkMode ? "border-gray-800 bg-[#0E121A]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="p-2 space-y-1">
              {categories.map((cat, idx) => {
                const isActive = activeCategoryIndex === idx;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#FFDE17] text-black shadow-md font-black"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800/60"
                        : "text-gray-700 hover:bg-gray-200/70"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        isActive ? "translate-x-1 text-black" : "opacity-40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Derecho: Subcategorías y Promociones */}
          <div className="w-3/5 sm:w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-6 border-gray-700/40">
                <h3 className="text-lg font-black uppercase text-[#FFDE17] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {currentCategory.name}
                </h3>
                <button
                  onClick={() => handleCategoryClick(currentCategory.id)}
                  className="text-xs font-bold hover:underline text-gray-400 hover:text-white"
                >
                  Ver todos ({currentCategory.count}) →
                </button>
              </div>

              {/* Grid de Subcategorías */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentCategory.subCategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubCategoryClick(currentCategory.id, sub)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all group ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] hover:bg-gray-800/40"
                        : "bg-gray-50 border-gray-200 hover:border-amber-400 hover:bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="group-hover:text-[#FFDE17] transition-colors">{sub}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Promo Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/30"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div>
                <div className="text-[11px] font-black uppercase text-[#FFDE17] tracking-wider">
                  Beneficio Spartan
                </div>
                <div className="text-xs font-bold mt-0.5">
                  Envíos express en Arequipa y garantía directa de tienda
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate("catalog");
                  onClose();
                }}
                className="py-2 px-3.5 rounded-xl bg-[#FFDE17] text-black font-black uppercase text-[10px] tracking-wider hover:bg-yellow-400 transition-colors whitespace-nowrap"
              >
                Ir a la Tienda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
