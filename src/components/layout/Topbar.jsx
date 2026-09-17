import React from "react";
import { Truck, HelpCircle, MapPin, RefreshCw, WhatsAppIcon } from "../common/Icons";
import { storeInfo as defaultStoreInfo } from "../../data/storeData";

export default function Topbar({
  onOpenFaq,
  onOpenLocation,
  isDarkMode,
  isSyncing,
  onSync,
  lastSyncTime,
  storeInfo = defaultStoreInfo
}) {
  const phoneFormatted = storeInfo?.phones?.[0] || "912 930 004";
  const whatsappNum = storeInfo?.whatsappMain || "51912930004";
  const displayAddress = storeInfo?.address || "Calle Octavio Muñoz Najar 223 Int 211 Compuplaza • Arequipa";

  return (
    <div
      className={`py-2 text-xs font-semibold border-b transition-colors ${
        isDarkMode
          ? "bg-[#07090D] border-gray-800 text-gray-400"
          : "bg-slate-900 border-slate-800 text-slate-300"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
        {/* Left: Location & Delivery notice */}
        <div className="flex items-center gap-3 truncate">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] sm:text-xs">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Delivery Arequipa Express</span>
          </div>
          <span className="hidden md:inline text-gray-500">•</span>
          <button
            onClick={onOpenLocation}
            className="hidden md:flex truncate items-center gap-1.5 hover:text-amber-400 transition-colors group cursor-pointer text-left"
            title={`Ver ubicación en Google Maps (${displayAddress})`}
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-400/80 group-hover:text-amber-400" />
            <span className="underline decoration-dotted decoration-slate-600 group-hover:decoration-amber-400">
              {displayAddress}
            </span>
          </button>
        </div>

        {/* Right: Sync status, FAQs, and WhatsApp */}
        <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 hover:text-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
            title={lastSyncTime ? `Última sincronización: ${lastSyncTime}` : "Sincronizar cambios en vivo desde Sheets"}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-amber-400" : ""}`} />
            <span className="hidden md:inline">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
          </button>

          <button
            onClick={onOpenFaq}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden xl:inline">Preguntas Frecuentes</span>
          </button>

          <a
            href={`https://wa.me/${whatsappNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" colored={true} />
            <span className="font-mono">{phoneFormatted}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
