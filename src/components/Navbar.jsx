import React, { useState } from "react";
import { Search, ShoppingCart, Layers, Sun, Moon, Sparkles, X, ChevronDown } from "./Icons";

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenMegaMenu,
  onOpenPCBuilder,
  onNavigate,
  currentView,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
    onNavigate("catalog");
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDarkMode
          ? "bg-[#0B0E14]/95 border-gray-800 text-white"
          : "bg-white/95 border-slate-200 text-slate-900 shadow-xs"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Left: Brand + Real Retail Departments Trigger */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group text-left flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFDE17] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/assets/images/spartan_games_logo_base.png"
                alt="Spartan Games Logo"
                className="w-full h-full object-cover rounded-[10px] bg-black"
              />
            </div>
            <div>
              <div
                className={`font-black text-xl tracking-wider uppercase leading-none ${
                  isDarkMode ? "text-[#FFDE17]" : "text-slate-950"
                }`}
              >
                SPARTAN
              </div>
              <div
                className={`text-[10px] font-black uppercase tracking-widest leading-none mt-0.5 ${
                  isDarkMode ? "text-gray-400" : "text-amber-800"
                }`}
              >
                GAMES AREQUIPA
              </div>
            </div>
          </button>

          {/* Departments Button: Sleek Retail Style (NOT generic AI yellow pill) */}
          <button
            onClick={onOpenMegaMenu}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isDarkMode
                ? "bg-[#161D2A] hover:bg-[#1E2738] border border-gray-700/80 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
            aria-label="Abrir catálogo por categorías"
          >
            <Layers className="w-4 h-4 text-[#FFDE17] stroke-[2.5]" />
            <span className="hidden sm:inline tracking-wide font-semibold">Categorias</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5 hidden sm:inline" />
          </button>
        </div>

        {/* Center: Live Search Bar with retail affordance */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl hidden md:flex items-center relative"
        >
          <input
            type="text"
            placeholder="Buscar tarjetas RTX, procesadores Ryzen/Intel, laptops, monitores..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={`w-full py-2.5 pl-10 pr-24 rounded-xl text-xs font-medium border transition-all outline-none ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 text-white placeholder-gray-500 focus:border-[#FFDE17] focus:ring-1 focus:ring-[#FFDE17]/20"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300"
            }`}
          />
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />

          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-colors shadow-xs"
          >
            Buscar
          </button>
        </form>

        {/* Right: Nav Links + PC Builder Tool + Theme Toggle + Retail Cart */}
        <div className="flex items-center gap-3 lg:gap-4">
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold tracking-wide">
            <button
              onClick={() => onNavigate("home")}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === "home"
                  ? isDarkMode ? "text-[#FFDE17] font-bold" : "text-amber-800 font-bold bg-amber-50"
                  : isDarkMode ? "text-gray-300 hover:text-white" : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                currentView === "catalog"
                  ? isDarkMode ? "text-[#FFDE17] font-bold" : "text-amber-800 font-bold bg-amber-50"
                  : isDarkMode ? "text-gray-300 hover:text-white" : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={onOpenPCBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-[#FFDE17] hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#FFDE17]" />
              <span>Arma tu PC</span>
            </button>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
              isDarkMode
                ? "border-gray-800 bg-[#111620] text-amber-300 hover:border-gray-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs"
            }`}
            title={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro Gamer"}
            aria-label="Cambiar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#FFDE17]" /> : <Moon className="w-4 h-4 text-slate-900" />}
          </button>

          {/* Cart Trigger: Professional Retail E-Commerce Button */}
          <button
            onClick={onOpenCart}
            className={`relative px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all shadow-xs ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 hover:border-gray-700 text-white"
                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
            }`}
            aria-label={`Ver carrito de compras con ${cartCount} artículos`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className={`w-4 h-4 ${isDarkMode ? "text-[#FFDE17]" : "text-slate-800"}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF334B] text-white text-[10px] font-black font-mono flex items-center justify-center ring-2 ring-white dark:ring-[#111620]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Carrito</span>
            {cartCount > 0 && (
              <span className="hidden md:inline text-[11px] font-mono font-bold text-amber-800 dark:text-[#FFDE17]">
                ({cartCount})
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
