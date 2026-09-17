import React, { useState } from "react";
import { Search, ShoppingCart, Layers, Sun, Moon, Sparkles, X, ChevronDown } from "../common/Icons";

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
  onToggleTheme,
  storeInfo
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch);
    onNavigate("catalog");
    setIsMobileSearchOpen(false);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl border-b border-gray-800/80 text-white shadow-2xl shadow-black/50 transition-all"
      style={{ backgroundColor: "#0b0e14" }}
    >
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-8">
        {/* Left: Brand Lockup + Categories Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-6">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 sm:gap-3.5 group text-left flex-shrink-0 cursor-pointer"
          >
            {/* Logo Badge: Premium Squircle with Yellow Brand Field & Subtle Gold Rim */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden bg-[#FFDE17] p-1 shadow-lg shadow-amber-500/20 ring-2 ring-[#FFDE17]/70 group-hover:scale-105 group-hover:ring-[#FFDE17] group-hover:shadow-amber-500/40 transition-all flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/images/spartan_games_logo_base_solo.png"
                alt="Spartan Games Logo"
                className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/spartan_games_logo_base_solo.png";
                }}
              />
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-white uppercase">
                  SPARTAN
                </span>
                <span className="font-black text-lg sm:text-2xl tracking-tight text-[#FFDE17] uppercase">
                  GAMES
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-gray-400 leading-none">
                  HARDWARE AREQUIPA
                </span>
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#FFDE17] shadow-xs shadow-amber-400" />
              </div>
            </div>
          </button>

          {/* Departments Button: Sleek Retail Dark Glass Style */}
          <button
            onClick={onOpenMegaMenu}
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md bg-[#151C28] hover:bg-[#1E283A] border border-gray-700/80 text-white group cursor-pointer active:scale-95"
            aria-label="Abrir catálogo por categorías"
          >
            <Layers className="w-4 h-4 text-[#FFDE17] stroke-[2.5] group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline tracking-wide font-black">Categorias</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5 hidden sm:inline" />
          </button>
        </div>

        {/* Center: Live Search Bar with dark cockpit styling */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl hidden md:flex items-center relative"
        >
          <input
            type="text"
            placeholder="Buscar tarjetas RTX, procesadores Ryzen/Intel, laptops, monitores..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full py-2.5 pl-11 pr-24 rounded-xl text-xs font-medium border border-gray-700/80 bg-[#121824] text-white placeholder-gray-400 focus:border-[#FFDE17] focus:ring-2 focus:ring-[#FFDE17]/20 transition-all outline-none shadow-inner"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />

          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-22 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Buscar
          </button>
        </form>

        {/* Right: Nav Links + PC Builder Tool + Theme Toggle + Retail Cart */}
        <div className="flex items-center gap-3 lg:gap-4">
          <nav className="hidden lg:flex items-center gap-2.5 text-xs font-semibold tracking-wide">
            <button
              onClick={() => onNavigate("home")}
              className={`px-3 py-2 rounded-xl transition-all font-bold uppercase tracking-wider cursor-pointer ${
                currentView === "home"
                  ? "text-[#FFDE17] bg-[#FFDE17]/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className={`px-3 py-2 rounded-xl transition-all font-bold uppercase tracking-wider cursor-pointer ${
                currentView === "catalog"
                  ? "text-[#FFDE17] bg-[#FFDE17]/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={onOpenPCBuilder}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-[#FFDE17]/50 bg-[#FFDE17]/10 text-[#FFDE17] hover:bg-[#FFDE17]/20 transition-all shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFDE17]" />
              <span>Arma tu PC</span>
            </button>
          </nav>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-xl border border-gray-800 bg-[#121824] text-gray-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            title="Buscar productos"
            aria-label="Abrir barra de búsqueda"
          >
            <Search className="w-4 h-4 text-[#FFDE17]" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-gray-800 bg-[#121824] hover:bg-[#1A2232] text-amber-300 hover:border-gray-700 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro Gamer"}
            aria-label="Cambiar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#FFDE17]" /> : <Moon className="w-4 h-4 text-gray-300" />}
          </button>

          {/* Cart Trigger: Professional Retail E-Commerce Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:px-4 sm:py-2.5 rounded-xl border border-gray-800 bg-[#121824] hover:bg-[#1A2232] text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md cursor-pointer group"
            aria-label={`Ver carrito de compras con ${cartCount} artículos`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#FFDE17] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold tracking-wide">Carrito</span>
            {cartCount > 0 && (
              <span className="hidden sm:inline text-[10px] font-mono font-bold text-amber-400">({cartCount})</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-gray-800 px-4 py-3 bg-[#0A0D14]">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Buscar tarjetas, procesadores, laptops..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full py-2 pl-9 pr-8 rounded-xl text-xs font-medium border border-gray-700/80 bg-[#121824] text-white placeholder-gray-400 focus:border-[#FFDE17] focus:ring-2 focus:ring-[#FFDE17]/20 transition-all outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              Buscar
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
