import React, { useState } from "react";
import { X, ChevronRight, Sparkles, Layers } from "./Icons";
import { useModalTransition } from "../hooks/useModalTransition";

export default function MegaMenuDrawer({
  isOpen,
  onClose,
  categories,
  isDarkMode,
  onSelectCategory,
  onNavigate
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const { shouldRender, isClosing } = useModalTransition(isOpen, 240);

  if (!shouldRender) return null;

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
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${
          isClosing ? "animate-spartan-fade-out" : "animate-spartan-fade-in"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`relative z-10 w-full max-w-4xl h-full shadow-2xl flex flex-col border-r ${
          isClosing ? "animate-spartan-drawer-exit-left" : "animate-spartan-drawer-left"
        } ${
          isDarkMode
            ? "bg-[#0B0E14] border-gray-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFDE17] text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Departamentos y Hardware
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                Selecciona una categoría para explorar el catálogo en Compuplaza Arequipa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Panel Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Panel Izquierdo: Categorías */}
          <div
            className={`w-2/5 sm:w-1/3 border-r overflow-y-auto ${
              isDarkMode ? "border-gray-800 bg-[#0E121A]" : "border-slate-200 bg-slate-50"
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
                        ? "bg-[#FFDE17] text-slate-950 shadow-sm font-black"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800/60"
                        : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-950"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        isActive ? "translate-x-1 text-slate-950" : "opacity-40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Derecho: Subcategorías */}
          <div className="w-3/5 sm:w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-6 border-slate-200 dark:border-gray-700/40">
                <h3 className="text-lg font-black uppercase text-slate-950 dark:text-[#FFDE17] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#FFDE17]" />
                  {currentCategory.name}
                </h3>
                <button
                  onClick={() => handleCategoryClick(currentCategory.id)}
                  className="text-xs font-bold hover:underline text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
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
                        : "bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 dark:text-gray-200 group-hover:text-amber-800 dark:group-hover:text-[#FFDE17] transition-colors">
                        {sub}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Info Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/30"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div>
                <div className="text-[11px] font-black uppercase text-amber-800 dark:text-[#FFDE17] tracking-wider">
                  Garantía y Confianza Spartan
                </div>
                <div className="text-xs font-bold mt-0.5 text-slate-900 dark:text-white">
                  Envíos express en Arequipa y garantía directa de tienda física
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate("catalog");
                  onClose();
                }}
                className="py-2 px-3.5 rounded-xl bg-[#FFDE17] text-slate-950 font-black uppercase text-[10px] tracking-wider hover:bg-yellow-400 transition-colors whitespace-nowrap shadow-sm"
              >
                Ir al Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
