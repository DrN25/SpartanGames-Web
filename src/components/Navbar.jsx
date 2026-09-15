import React, { useState } from "react";
import { Search, ShoppingCart, Layers, Sun, Moon, Sparkles, X } from "./Icons";

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
          ? "bg-[#0B0E14]/95 border-gray-800/80 text-white"
          : "bg-white/95 border-gray-200 text-gray-900 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand + MegaMenu Trigger */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFDE17] via-amber-400 to-amber-600 p-0.5 shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/assets/images/spartan_games_logo_base.png"
                alt="Spartan Games Logo"
                className="w-full h-full object-cover rounded-[14px] bg-black"
              />
            </div>
            <div>
              <div className="font-black text-xl tracking-wider uppercase leading-none text-[#FFDE17] group-hover:text-yellow-400 transition-colors">
                SPARTAN
              </div>
              <div className={`text-[11px] font-black uppercase tracking-widest leading-none mt-0.5 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                GAMES AQP
              </div>
            </div>
          </button>

          {/* MegaMenu Drawer Trigger */}
          <button
            onClick={onOpenMegaMenu}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDE17] text-black hover:bg-yellow-400 active:scale-95 transition-all shadow-md shadow-yellow-500/10"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>Categorías</span>
          </button>
        </div>

        {/* Center: Live Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-lg hidden md:flex items-center relative"
        >
          <input
            type="text"
            placeholder="Buscar componentes, laptops, tarjetas de video..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={`w-full py-2.5 pl-11 pr-10 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#FFDE17] ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 text-white placeholder-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />

          {localSearch ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors"
            >
              Buscar
            </button>
          )}
        </form>

        {/* Right: Nav Links + Theme Toggle + Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => onNavigate("home")}
              className={`transition-colors hover:text-[#FFDE17] ${
                currentView === "home" ? "text-[#FFDE17] font-black" : isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className={`transition-colors hover:text-[#FFDE17] ${
                currentView === "catalog" ? "text-[#FFDE17] font-black" : isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Tienda
            </button>
            <button
              onClick={onOpenPCBuilder}
              className="text-[#FFDE17] hover:text-yellow-400 transition-colors flex items-center gap-1 font-black"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arma tu PC</span>
            </button>
          </nav>

          {/* Theme Toggle Icon in Header */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-colors ${
              isDarkMode
                ? "border-gray-800 bg-[#111620] text-amber-300 hover:border-amber-400/50"
                : "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 shadow-sm"
            }`}
            title={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro"}
            aria-label="Cambiar tema claro u oscuro"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#FFDE17]" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className={`relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] text-white"
                : "bg-gray-50 border-gray-300 hover:border-black text-gray-900 shadow-sm"
            }`}
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="w-5 h-5 text-[#FFDE17]" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#FF334B] text-white text-[11px] font-black flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
