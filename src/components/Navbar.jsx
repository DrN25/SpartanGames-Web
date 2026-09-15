import React, { useState } from 'react';
import { Menu, Search, ShoppingCart, X, ChevronDown, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/storeData';

export default function Navbar({ onToggleDrawer, isDrawerOpen, onOpenCart, cartCount, cartTotal, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Categories Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            <img 
              src="/assets/images/spartan_games_logo_base.png" 
              alt="Spartan Games Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full bg-black p-0.5 border border-spartan-gold/40 group-hover:border-spartan-gold transition-all"
            />
            <div className="flex flex-col">
              <span className="font-display font-black tracking-wider text-base sm:text-lg text-white leading-tight flex items-center gap-1">
                SPART<span className="text-spartan-gold">Λ</span>N <span className="text-spartan-gold font-bold">GΛMES</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">Arequipa Hardware</span>
            </div>
          </a>

          {/* Megamenu Trigger Button (Falabella style) */}
          <button
            onClick={onToggleDrawer}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDrawerOpen 
                ? 'bg-spartan-gold text-black shadow-lg shadow-spartan-gold/20' 
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-spartan-gold/50'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>CATEGORÍAS</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search Bar with Gaming Aesthetic */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar laptops gamer, DDR5, monitores 255Hz, RTX 4070..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12121a] border border-white/10 rounded-lg py-2 pl-9 pr-24 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-spartan-gold/80 focus:ring-1 focus:ring-spartan-gold/50 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-spartan-gold hover:bg-spartan-goldHover text-black text-xs font-bold px-3 py-1 rounded transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Mobile Menu & Cart Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Categories Toggle */}
          <button
            onClick={onToggleDrawer}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            aria-label="Abrir categorías"
          >
            <Menu className="w-5 h-5 text-spartan-gold" />
          </button>

          {/* Cart Button with Counter Badge */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-spartan-card hover:bg-spartan-cardHover border border-white/10 hover:border-spartan-gold/40 px-3.5 py-2 rounded-lg transition-all text-white group cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-spartan-gold group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-spartan-red text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 leading-none">Mi Carrito</span>
              <span className="text-xs font-bold text-spartan-gold">
                S/. {cartTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Search Bar Row */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12121a] border border-white/10 rounded-lg py-1.5 pl-8 pr-16 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-spartan-gold"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <button
            type="submit"
            className="absolute right-1 top-1 bg-spartan-gold text-black text-[11px] font-bold px-2 py-0.5 rounded"
          >
            Ir
          </button>
        </form>
      </div>
    </header>
  );
}
