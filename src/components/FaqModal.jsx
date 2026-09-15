import React from 'react';
import { X, HelpCircle, CreditCard, ShieldCheck, Wrench, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

export default function FaqModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e0e16] border border-white/15 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#08080c]">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-spartan-gold" />
            <h2 className="text-base font-bold text-white tracking-wide">
              PREGUNTAS FRECUENTES & POLÍTICAS SPARTAN
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQs Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* Compras y Pagos */}
          <div>
            <h3 className="text-sm font-bold text-spartan-gold flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-spartan-gold" />
              Compras, Pagos y Pago por Reserva (10%)
            </h3>
            <p className="mb-2">
              Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias y billeteras digitales como <strong>Yape</strong> y <strong>Plin</strong>.
            </p>
            <div className="p-3 rounded-xl bg-spartan-card border border-white/10">
              <strong className="text-white block mb-1">¿Cómo funciona el Pago por Reserva (10%)?</strong>
              Puedes congelar el stock de tu laptop o componentes abonando solo el 10% del total mediante Yape o Plin. Envías la captura al WhatsApp oficial y coordinas la entrega o el retiro en tienda física liquidando el 90% restante. Aplica para compras de S/. 10.00 hasta S/. 3,000.00.
            </div>
          </div>

          {/* Entregas y Delivery */}
          <div>
            <h3 className="text-sm font-bold text-spartan-gold flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-spartan-gold" />
              Delivery en Arequipa y Envíos Nacionales
            </h3>
            <p>
              A diferencia de otras tiendas, <strong>Spartan Games SÍ cuenta con servicio de DELIVERY directo en todo Arequipa</strong> y envíos asegurados a nivel nacional (Shalom, Olva Courier, Marvisur). También puedes recoger en nuestro local comercial ubicado en el C.C. Compuplaza (Arequipa).
            </p>
          </div>

          {/* Garantía y Software */}
          <div>
            <h3 className="text-sm font-bold text-spartan-gold flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-spartan-gold" />
              Garantía y Equipos Listos para Jugar
            </h3>
            <p>
              Todos nuestros productos cuentan con garantía de <strong>hasta 1 año</strong> con comprobante oficial (Boleta o Factura). Todas las computadoras ensambladas y laptops se entregan configuradas con Sistema Operativo original, drivers actualizados y programas básicos listos para encender y jugar.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0a0a0f] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-lg bg-spartan-gold hover:bg-spartan-goldHover text-black text-xs font-bold cursor-pointer"
          >
            Entendido, Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
