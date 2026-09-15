import React from 'react';
import { Monitor, HelpCircle, User, Truck, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

export default function Topbar({ onOpenPCBuilder, onOpenFaq }) {
  return (
    <div className="bg-[#09090d] border-b border-white/5 text-xs text-slate-400 py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Side: Delivery and Perks Notice */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 text-spartan-gold font-medium">
            <Truck className="w-3.5 h-3.5 text-spartan-gold" />
            ¡Delivery en Arequipa & envíos a todo el Perú!
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Garantía oficial de 1 año
          </span>
        </div>

        {/* Right Side: Quick Action Links */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenPCBuilder}
            className="flex items-center gap-1.5 text-slate-300 hover:text-spartan-gold transition-colors font-medium cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-spartan-gold" />
            Arma tu PC
          </button>
          
          <button 
            onClick={onOpenFaq}
            className="flex items-center gap-1 text-slate-300 hover:text-spartan-gold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Info / Ayuda (FAQs)
          </button>

          <a 
            href="#login" 
            className="flex items-center gap-1 text-slate-300 hover:text-spartan-gold transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
