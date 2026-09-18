import React from "react";
import { Sparkles, Truck, ShieldCheck, Cpu, MapPin, CreditCard } from "./Icons";

export default function MarqueeTicker({ storeInfo = {} }) {
  const addressText = storeInfo?.address
    ? `${storeInfo.address}${storeInfo?.schedule ? ` • ${storeInfo.schedule}` : ""}`
    : (storeInfo?.schedule ? `Atención en tienda • ${storeInfo.schedule}` : "Atención presencial y asesoría técnica garantizada");

  const deliveryText = storeInfo?.deliveryNote || (storeInfo?.city ? `Delivery express en ${storeInfo.city} y envíos a provincias` : "Delivery express local y envíos a provincias");

  const items = [
    { text: addressText, icon: "pin" },
    { text: deliveryText, icon: "truck" },
    { text: "Garantía local directa de 1 a 3 años con boleta o factura", icon: "shield" },
    { text: "Ensambles con Windows 11 activado y pruebas de estrés térmico gratis", icon: "cpu" },
    { text: "Aceptamos Yape, Plin, transferencias directas y pago por reserva del 10%", icon: "wallet" }
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "pin":
        return <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#FFDE17]" />;
      case "wallet":
        return <CreditCard className="w-3.5 h-3.5 flex-shrink-0 text-[#FFDE17]" />;
      case "truck":
        return <Truck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />;
      case "shield":
        return <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />;
      case "cpu":
        return <Cpu className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-[#FFDE17]" />;
    }
  };

  return (
    <div
      className="py-2.5 overflow-hidden select-none border-y transition-colors bg-[#0D1119] border-gray-800/80 text-gray-300"
      style={{ backgroundColor: "#0d1119" }}
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <div className="flex items-center shrink-0 gap-8 pr-8 text-xs font-semibold">
          {items.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
              {renderIcon(item.icon)}
              <span>{item.text}</span>
              <span className="text-slate-300 dark:text-gray-700 ml-4">•</span>
            </span>
          ))}
        </div>
        <div className="flex items-center shrink-0 gap-8 pr-8 text-xs font-semibold" aria-hidden="true">
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
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
