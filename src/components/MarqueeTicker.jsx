import React from "react";
import { Sparkles, Truck, ShieldCheck, Cpu, MapPin, CreditCard } from "./Icons";

export default function MarqueeTicker() {
  const items = [
    { text: "Calle Octavio Muñoz Najar 223 Int 211 Compuplaza • Lunes a Sábado 11:00 am - 8:00 pm", icon: "pin" },
    { text: "Delivery express en Arequipa Metropolitana y envíos asegurados a provincias", icon: "truck" },
    { text: "Garantía local directa de 1 a 3 años con boleta o factura", icon: "shield" },
    { text: "Ensambles con Windows 11 activado y pruebas de estrés térmico gratis", icon: "cpu" },
    { text: "Aceptamos Yape, Plin, transferencias directas y pago por reserva del 10%", icon: "wallet" }
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "pin":
        return <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-[#FFDE17]" />;
      case "wallet":
        return <CreditCard className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-[#FFDE17]" />;
      case "truck":
        return <Truck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />;
      case "shield":
        return <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />;
      case "cpu":
        return <Cpu className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-[#FFDE17]" />;
    }
  };

  return (
    <div className="py-2.5 overflow-hidden select-none border-y transition-colors bg-amber-50 dark:bg-[#0E121A] border-amber-200/70 dark:border-gray-800 text-slate-900 dark:text-gray-200">
      <div className="flex w-[200%] animate-marquee">
        <div className="flex items-center justify-around w-1/2 shrink-0 gap-10 text-xs font-semibold">
          {items.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 shrink-0">
              {renderIcon(item.icon)}
              <span>{item.text}</span>
              <span className="text-slate-300 dark:text-gray-700 ml-4">•</span>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-around w-1/2 shrink-0 gap-10 text-xs font-semibold">
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center gap-2 shrink-0">
              {renderIcon(item.icon)}
              <span>{item.text}</span>
              <span className="text-slate-300 dark:text-gray-700 ml-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
