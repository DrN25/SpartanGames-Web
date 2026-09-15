import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const reservaMonto = subtotal * 0.10;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Cart Panel */}
      <div className="relative w-full max-w-md bg-[#0d0d14] text-white shadow-2xl flex flex-col z-10 border-l border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#08080c]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-spartan-gold" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-white">
              Tu Carrito ({cartItems.length})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-spartan-gold" />
              <p className="text-sm font-semibold">Tu carrito está vacío</p>
              <p className="text-xs mt-1">Explora nuestro catálogo gamer y añade componentes.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-spartan-card border border-white/5"
              >
                <img 
                  src={item.images ? item.images[0] : item.image} 
                  alt={item.name} 
                  className="w-14 h-14 object-contain bg-black/50 rounded-lg p-1"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <div className="text-xs text-spartan-red font-black mt-0.5">
                    S/. {item.price.toFixed(2)}
                  </div>
                  
                  {/* Quantity control */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-xs flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-xs flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-500 hover:text-spartan-red transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#09090f] space-y-4">
            
            {/* Subtotal */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-mono font-bold">S/. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery (Arequipa)</span>
                <span className="text-emerald-400 font-medium">A coordinar</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-white/10">
                <span className="text-white">Total a Pagar</span>
                <span className="text-spartan-gold font-mono">S/. {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Pago por Reserva (10%) Box */}
            <div className="p-3 rounded-xl bg-spartan-card border border-spartan-gold/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-spartan-gold mb-1">
                <QrCode className="w-4 h-4" />
                <span>Modalidad: Pago por Reserva (10%)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Separa tu pedido ahora con solo <strong className="text-white">S/. {reservaMonto.toFixed(2)}</strong> vía Yape o Plin y paga el saldo restante al recibir tu equipo.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <a
                href={`https://api.whatsapp.com/send?phone=51${STORE_INFO.phones[0]}&text=${encodeURIComponent(
                  `Hola Spartan Games, deseo procesar el pedido de mi carrito por S/. ${subtotal.toFixed(2)}:\n` +
                  cartItems.map(i => `• ${i.quantity}x ${i.name} (S/. ${i.price.toFixed(2)})`).join('\n') +
                  `\n¿Podemos coordinar la entrega o reserva del 10%?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-spartan-green hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all text-center"
              >
                FINALIZAR PEDIDO POR WHATSAPP
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Compra 100% segura con tienda física en Arequipa
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
