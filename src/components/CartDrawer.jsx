import React from "react";
import { X, ShoppingCart, ArrowRight, ShieldCheck, Plus, Minus } from "./Icons";
import { WhatsAppIcon, YapeIcon, PlinIcon, CulqiIcon, VisaIcon } from "./Icons";
import { storeInfo as defaultStoreInfo } from "../data/storeData";
import { useModalTransition } from "../hooks/useModalTransition";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  isDarkMode,
  storeInfo = defaultStoreInfo
}) {
  const { shouldRender, isClosing } = useModalTransition(isOpen, 240);
  if (!shouldRender) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const reservaMonto = (subtotal * 0.1).toFixed(2);

  // Deep-link orden WhatsApp
  const itemsText = cartItems
    .map((item) => `• ${item.quantity}x ${item.name} - S/. ${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  const whatsappPhone = storeInfo?.whatsappMain || "51912930004";
  const whatsappMessage = `Hola Spartan Games Arequipa, deseo procesar el siguiente pedido desde su tienda virtual:\n\n${itemsText}\n\n*TOTAL:* S/. ${subtotal.toFixed(2)}\n*Opción Reserva 10%:* S/. ${reservaMonto}\n\nPor favor confirmar disponibilidad en Calle Octavio Muñoz Najar 223 Int 211 Compuplaza y datos para Yape/Transferencia.`;
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${
          isClosing ? "animate-spartan-fade-out" : "animate-spartan-fade-in"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col z-10 border-l ${
          isClosing ? "animate-spartan-drawer-exit-right" : "animate-spartan-drawer-right"
        } ${
          isDarkMode
            ? "bg-[#0E121A] border-gray-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFDE17] text-slate-950 font-black">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-wide">
                Tu Carrito Gamer
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? "componente" : "componentes"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
            }`}
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#FFDE17] flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-wide">Tu carrito está vacío</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xs">
                Explora el catálogo de procesadores, tarjetas gráficas o laptops y ármate con el mejor hardware en Arequipa.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-colors shadow-sm"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex gap-3 transition-colors ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div
                  className={`w-18 h-18 rounded-xl p-2 flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? "bg-black/40" : "bg-slate-50"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-14 max-w-14 object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-[#FFDE17]">
                        {item.brand}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[11px] text-rose-600 hover:underline font-bold"
                      >
                        Quitar
                      </button>
                    </div>
                    <h4 className="text-xs font-bold line-clamp-1 text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs font-black text-[#FF334B]">
                      S/. {(item.price * item.quantity).toFixed(2)}
                    </div>

                    <div
                      className={`flex items-center border rounded-lg p-0.5 ${
                        isDarkMode ? "border-gray-700 bg-black/40" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[#FFDE17] transition-colors"
                        aria-label="Disminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[#FFDE17] transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Section */}
        {cartItems.length > 0 && (
          <div
            className={`p-5 border-t space-y-4 ${
              isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
            }`}
          >
            {/* Trust badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Garantía física en tienda
              </span>
              <span>Calle Octavio Muñoz Najar 223 Int 211 Compuplaza</span>
            </div>

            {/* Totales */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-gray-800 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-gray-400">
                <span>Subtotal componentes</span>
                <span className="font-mono">S/. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Ensamble y Testeo</span>
                <span className="font-bold uppercase tracking-wider text-[10px] bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  GRATIS
                </span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white">
                <span>Total a Pagar</span>
                <span className="text-[#FF334B] font-mono">S/. {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Opciones de Pago Rápidas */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
                isDarkMode
                  ? "bg-black/40 border-gray-800 text-gray-300"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <YapeIcon className="w-5 h-5" />
                <PlinIcon className="w-5 h-5" />
                <CulqiIcon className="w-5 h-5" />
                <VisaIcon className="w-5 h-5" />
                <span className="font-bold ml-1">Reserva 10%:</span>
              </div>
              <span className="font-black text-amber-800 dark:text-[#FFDE17] font-mono">
                S/. {reservaMonto}
              </span>
            </div>

            {/* Primary Action Button: WhatsApp Order */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-700/20 active:scale-[0.99]"
            >
              <WhatsAppIcon className="w-4 h-4" colored={false} />
              <span>Coordinar Pedido por WhatsApp</span>
            </a>

            <div className="text-[10px] text-center text-slate-500 dark:text-gray-400 leading-tight">
              Al hacer clic te redirigiremos a WhatsApp oficial de Spartan Games para confirmar stock y datos de entrega en Arequipa.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
