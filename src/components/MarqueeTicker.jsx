import React from 'react';
import { Sparkles, Flame, ShieldAlert } from 'lucide-react';

export default function MarqueeTicker() {
  const items = [
    { text: "⚡ ¡Gran Estreno Spartan Games! Explora la nueva web gamer de Arequipa", highlight: true },
    { text: "🚚 Contamos con servicio de DELIVERY a domicilio y envíos garantizados", highlight: false },
    { text: "🔥 Ofertas en Memorias RAM DDR5 y Monitores ROG 255Hz hasta hoy 11:59 p.m.", highlight: true },
    { text: "🛠️ Todos los equipos se entregan ensamblados con Sistema Operativo y Programas listos", highlight: false },
    { text: "💳 Aceptamos Visa, Mastercard, American Express, Yape y Plin", highlight: false },
  ];

  return (
    <div className="bg-spartan-surface border-y border-white/5 py-2 overflow-hidden select-none">
      <div className="flex w-[200%] animate-marquee">
        <div className="flex items-center justify-around w-1/2 shrink-0 gap-8 text-xs text-slate-300">
          {items.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 shrink-0">
              {item.highlight ? (
                <span className="text-spartan-gold font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-spartan-red" />
                  {item.text}
                </span>
              ) : (
                <span className="text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-spartan-gold" />
                  {item.text}
                </span>
              )}
              <span className="text-white/20">/</span>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-around w-1/2 shrink-0 gap-8 text-xs text-slate-300">
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center gap-2 shrink-0">
              {item.highlight ? (
                <span className="text-spartan-gold font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-spartan-red" />
                  {item.text}
                </span>
              ) : (
                <span className="text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-spartan-gold" />
                  {item.text}
                </span>
              )}
              <span className="text-white/20">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
