import React, { useState } from "react";
import { X, ChevronRight, Sparkles, Layers } from "../common/Icons";
import { useModalTransition } from "../../hooks/useModalTransition";

export default function MegaMenuDrawer({
  isOpen,
  onClose,
  categories = [],
  isDarkMode,
  onSelectCategory,
  onNavigate
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [expandedCatId, setExpandedCatId] = useState(() => categories[0]?.id || null);
  const { shouldRender, isClosing } = useModalTransition(isOpen, 240);

  if (!shouldRender) return null;

  const currentCategory = categories[activeCategoryIndex] || categories[0] || { name: "Hardware", subCategories: [], count: 0 };

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    onClose();
  };

  const handleSubCategoryClick = (catId, subCat) => {
    onSelectCategory(catId);
    if (subCat && onNavigate) {
      onNavigate(`/catalog?category=${encodeURIComponent(catId)}&q=${encodeURIComponent(subCat)}`);
    }
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FFDE17] text-slate-950 flex items-center justify-center font-black shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-950 dark:text-white truncate">
                Categorias y Hardware
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                Explora el catálogo en Compuplaza Arequipa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ml-2 cursor-pointer ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vista Móvil (< sm): Acordeón fluido de ancho completo sin texto recortado */}
        <div className="sm:hidden flex-1 overflow-y-auto p-3 space-y-2">
          {categories.map((cat) => {
            const isExpanded = expandedCatId === cat.id;
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isExpanded
                    ? isDarkMode
                      ? "border-amber-500/40 bg-[#111620]"
                      : "border-amber-400 bg-amber-50/20"
                    : isDarkMode
                    ? "border-gray-800 bg-[#0E121A]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                  className={`w-full flex items-center justify-between p-3.5 text-left transition-colors cursor-pointer ${
                    isExpanded
                      ? "bg-[#FFDE17] text-slate-950 font-black shadow-xs"
                      : isDarkMode
                      ? "text-gray-200 hover:bg-gray-800/60"
                      : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-black text-xs tracking-wide">
                    {cat.name}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExpanded
                          ? "bg-black/10 text-slate-950"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat.count || 0}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-90 text-slate-950" : "opacity-40"
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 space-y-2.5 border-t border-slate-200 dark:border-gray-800 bg-slate-50/80 dark:bg-[#0A0D13]">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-amber-100/70 dark:bg-amber-500/10 text-amber-900 dark:text-[#FFDE17] text-xs font-black transition-colors hover:bg-amber-200/70 dark:hover:bg-amber-500/20"
                    >
                      <span>Ver todo en {cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="grid grid-cols-1 gap-1.5">
                        {cat.subCategories.map((sub, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSubCategoryClick(cat.id, sub)}
                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between group active:scale-[0.99] ${
                              isDarkMode
                                ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] text-gray-200"
                                : "bg-white border-slate-200 hover:border-amber-400 text-slate-800 shadow-xs"
                            }`}
                          >
                            <span className="truncate pr-2">{sub}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Banner móvil full-width adaptado */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-3 mt-4 ${
              isDarkMode
                ? "bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/30 text-white"
                : "bg-amber-50 border-amber-200 text-slate-900"
            }`}
          >
            <div>
              <div className="text-[11px] font-black uppercase text-amber-800 dark:text-[#FFDE17] tracking-wider">
                Garantía y Confianza Spartan
              </div>
              <div className="text-xs font-bold mt-1 text-slate-800 dark:text-gray-200 leading-relaxed">
                Envíos express en Arequipa y garantía directa de tienda física
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigate("catalog");
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FFDE17] text-slate-950 font-black uppercase text-[11px] tracking-wider hover:bg-yellow-400 transition-colors shadow-xs text-center cursor-pointer active:scale-95"
            >
              Ir al Catálogo Completo
            </button>
          </div>
        </div>

        {/* Vista Desktop (>= sm): 2-Panel clásico con ancho suficiente */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          {/* Panel Izquierdo: Categorías */}
          <div
            className={`w-1/3 border-r overflow-y-auto ${
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
                    onClick={() => {
                      if (activeCategoryIndex !== idx) {
                        setActiveCategoryIndex(idx);
                      } else {
                        handleCategoryClick(cat.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#FFDE17] text-slate-950 shadow-sm font-black"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800/60"
                        : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-950"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] opacity-70">({cat.count || 0})</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? "translate-x-1 text-slate-950" : "opacity-40"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Derecho: Subcategorías */}
          <div className="w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-6 border-slate-200 dark:border-gray-700/40">
                <h3 className="text-lg font-black uppercase text-slate-950 dark:text-[#FFDE17] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#FFDE17]" />
                  {currentCategory.name}
                </h3>
                <button
                  onClick={() => handleCategoryClick(currentCategory.id)}
                  className="text-xs font-bold hover:underline text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                >
                  Ver todos ({currentCategory.count || 0}) →
                </button>
              </div>

              {/* Grid de Subcategorías */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {currentCategory.subCategories?.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubCategoryClick(currentCategory.id, sub)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all group cursor-pointer ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] hover:bg-gray-800/40"
                        : "bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 dark:text-gray-200 group-hover:text-amber-800 dark:group-hover:text-[#FFDE17] transition-colors truncate pr-2">
                        {sub}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Info Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
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
                className="py-2.5 px-4 rounded-xl bg-[#FFDE17] text-slate-950 font-black uppercase text-[10px] tracking-wider hover:bg-yellow-400 transition-colors whitespace-nowrap shadow-sm flex-shrink-0 cursor-pointer active:scale-95"
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
