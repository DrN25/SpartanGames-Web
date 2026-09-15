import React from 'react';
import { ShoppingCart, Tag, Eye } from 'lucide-react';
import { RELATED_PRODUCTS } from '../data/storeData';

export default function RelatedProducts({ onAddToCart }) {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-spartan-gold tracking-widest uppercase">Equipamiento Recomendado</span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-1">
            PRODUCTOS RELACIONADOS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RELATED_PRODUCTS.map((item) => (
          <div 
            key={item.id}
            className="bg-spartan-card hover:bg-spartan-cardHover border border-white/10 hover:border-spartan-gold/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group p-4"
          >
            {/* Image Container with Badges */}
            <div className="relative bg-black/60 rounded-xl p-4 flex items-center justify-center min-h-[180px] overflow-hidden mb-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {item.discount > 0 && (
                  <span className="bg-spartan-red text-white text-[10px] font-black px-2 py-0.5 rounded">
                    -{item.discount}%
                  </span>
                )}
                {item.isPromo && (
                  <span className="bg-spartan-gold text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                    PROMO
                  </span>
                )}
              </div>
            </div>

            {/* Category & ID */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-spartan-gold font-semibold uppercase">{item.category}</span>
              <span className="font-mono">Stock: {item.stock} un.</span>
            </div>

            {/* Product Title */}
            <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug mb-2 group-hover:text-spartan-gold transition-colors">
              {item.name}
            </h3>

            {/* Specs Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {item.specs.slice(0, 2).map((s, idx) => (
                <span key={idx} className="bg-white/5 text-slate-400 text-[9px] px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>

            {/* Price & Action Button */}
            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-spartan-red">
                  S/. {item.price.toFixed(2)}
                </div>
                {item.originalPrice > item.price && (
                  <div className="text-[10px] text-slate-500 line-through">
                    S/. {item.originalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              <button
                onClick={() => onAddToCart(item, 1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-spartan-gold hover:text-black text-white transition-colors cursor-pointer"
                title="Agregar al carro"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
