import React, { useState } from 'react';
import { X, ChevronRight, ArrowLeft, Laptop, Cpu, Monitor, Headphones, Shield, Check } from 'lucide-react';
import { CATEGORIES } from '../data/storeData';

const iconMap = {
  Laptop: Laptop,
  Cpu: Cpu,
  Monitor: Monitor,
  Headphones: Headphones,
};

export default function MegaMenuDrawer({ isOpen, onClose, onSelectCategory }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [mobileSubcategoryView, setMobileSubcategoryView] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Drawer Container (Falabella Multi-Panel Style in Dark Mode) */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-[#0d0d14] text-white shadow-2xl flex flex-col z-10 border-r border-white/10">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#08080c]">
          <div className="flex items-center gap-2">
            <span className="text-spartan-gold font-display font-black text-sm sm:text-base tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spartan-gold animate-ping" />
              CATEGORÍAS DE HARDWARE
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: 2 Columns for Desktop, Slide for Mobile */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Column 1: Parent Categories */}
          <div className={`w-full md:w-5/12 border-r border-white/10 overflow-y-auto bg-[#0a0a0f] ${mobileSubcategoryView ? 'hidden md:block' : 'block'}`}>
            <ul className="py-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = iconMap[cat.icon] || Cpu;
                const isSelected = activeCategory?.id === cat.id;

                return (
                  <li key={cat.id}>
                    <button
                      onMouseEnter={() => setActiveCategory(cat)}
                      onClick={() => {
                        setActiveCategory(cat);
                        setMobileSubcategoryView(true);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-spartan-gold text-black font-bold' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-spartan-gold'}`} />
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-400'}`}>
                          {cat.count}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-slate-500'}`} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* View All Store Button */}
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-spartan-card hover:bg-spartan-cardHover border border-spartan-gold/30 text-spartan-gold text-xs font-bold text-center transition-all cursor-pointer"
              >
                Ver Todo el Catálogo (Tienda Completa)
              </button>
            </div>
          </div>

          {/* Column 2: Subcategories List */}
          <div className={`w-full md:w-7/12 overflow-y-auto p-5 bg-[#0e0e16] ${mobileSubcategoryView ? 'block' : 'hidden md:block'}`}>
            {/* Mobile Back Button */}
            <div className="md:hidden pb-3 mb-3 border-b border-white/10">
              <button
                onClick={() => setMobileSubcategoryView(false)}
                className="flex items-center gap-2 text-spartan-gold text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Categorías
              </button>
            </div>

            {/* Active Category Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-spartan-gold">{activeCategory?.name}</span>
              </h3>
              <button 
                onClick={() => {
                  onSelectCategory(activeCategory?.id);
                  onClose();
                }}
                className="text-xs text-spartan-gold hover:underline cursor-pointer"
              >
                Ver todos &rsaquo;
              </button>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeCategory?.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    onSelectCategory(sub.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-spartan-gold/10 border border-white/5 hover:border-spartan-gold/30 text-left transition-all group cursor-pointer"
                >
                  <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-spartan-gold font-mono">
                    ({sub.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Promotional Card inside Drawer */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-spartan-card to-black border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-spartan-red tracking-wider uppercase">Promoción Spartan</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Envíos Gratis en Arequipa</h4>
                <p className="text-[11px] text-slate-400 mt-1">Por compras mayores a S/. 500 en componentes seleccionados.</p>
              </div>
              <Shield className="w-8 h-8 text-spartan-gold shrink-0 opacity-80" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
