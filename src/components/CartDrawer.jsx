import React from "react";
import { X, ShoppingCart, ArrowRight, ShieldCheck, Plus, Minus } from "./Icons";
import { WhatsAppIcon, YapeIcon, PlinIcon } from "./Icons";
import { storeInfo } from "../data/storeData";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  isDarkMode
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const reservaMonto = (subtotal * 0.1).toFixed(2);

  // Deep-link orden WhatsApp
  const itemsText = cartItems
    .map((item) => `• ${item.quantity}x ${item.name} - S/. ${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const whatsappMessage = `Hola Spartan Games Arequipa, deseo procesar el siguiente pedido desde su tienda virtual:\n\n${itemsText}\n\n*TOTAL:* S/. ${subtotal.toFixed(2)}\n*Opción Reserva 10%:* S/. ${reservaMonto}\n\nPor favor confirmar disponibilidad en Compuplaza Tienda 204 y datos para Yape/Transferencia.`;
  const whatsappUrl = `https://wa.me/${storeInfo.whatsappMain}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Cart Slide-Over */}
      <div
        className={`relative z-10 w-full max-w-md h-full shadow-2xl flex flex-col border-l ${
          isDarkMode
            ? "bg-[#0B0E14] border-gray-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFDE17] text-slate-950 flex items-center justify-center font-black shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Mi Carrito de Compras
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? "artículo" : "artículos"} seleccionados
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-[#FFDE17] flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-bold text-base mb-1 text-slate-900 dark:text-white">Tu carrito está vacío</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs mx-auto">
                Explora el catálogo de Spartan Games y añade componentes o laptops gamer a tu carrito.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                  isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {/* Image */}
                <div
                  className={`w-16 h-16 rounded-xl p-1.5 flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? "bg-black/40" : "bg-slate-50 border border-slate-100"
                  }`}
                >
                  <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">{item.name}</h4>
                  <div className="text-xs font-black text-[#FF334B] mt-0.5">
                    S/. {item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`flex items-center border rounded-lg p-0.5 ${
                        isDarkMode ? "border-gray-700 bg-black/40" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className={`p-1 transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`p-1 transition-colors disabled:opacity-30 ${
                          isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Total Line */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    S/. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Totals & WhatsApp Checkout */}
        {cartItems.length > 0 && (
          <div
            className={`p-4 sm:p-5 border-t space-y-4 ${
              isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
            }`}
          >
            {/* 10% Reservation Highlight Box */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isDarkMode
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-[#FFDE17]" />
                <div>
                  <div className="font-black uppercase text-[10px] text-amber-950 dark:text-[#FFDE17]">
                    Opción Pago por Reserva (10%)
                  </div>
                  <div className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
                    Asegura tu stock y paga el saldo en tienda
                  </div>
                </div>
              </div>
              <div className="text-right font-mono font-black text-sm text-amber-900 dark:text-[#FFDE17]">
                S/. {reservaMonto}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                Total General (I.G.V. Incl.)
              </span>
              <span className="text-2xl font-black text-[#FF334B]">
                S/. {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-600 dark:text-gray-400">
              <span>Aceptamos:</span>
              <YapeIcon />
              <PlinIcon />
              <span className="font-bold text-slate-700 dark:text-gray-300">Visa / Mastercard (Culqi)</span>
            </div>

            {/* WhatsApp Checkout Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-black uppercase text-xs tracking-wider bg-[#25D366] text-slate-950 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
            >
              <WhatsAppIcon className="w-5 h-5" colored={false} />
              <span>Finalizar Pedido por WhatsApp</span>
            </a>

            <p className="text-[10px] text-center text-slate-500 dark:text-gray-400">
              Coordinación directa con asesores en Compuplaza Arequipa. Boleta/Factura física o electrónica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
