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
  const phoneFormatted = storeInfo?.phones?.[0] || storeInfo?.whatsappMain || "";
  const whatsappNum = (storeInfo?.whatsappMain || storeInfo?.phones?.[0] || "").replace(/[^0-9]/g, "");
  const displayAddress = storeInfo?.address || (storeInfo?.city ? `Tienda Física • ${storeInfo.city}` : (storeInfo?.name || "Tienda Oficial"));

  return (
    <div
      className={`py-2 text-xs font-semibold border-b transition-colors ${
        isDarkMode
          ? "bg-[#07090D] border-gray-800 text-gray-400"
          : "bg-slate-900 border-slate-800 text-slate-300"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
        {/* Left: Location (first, always visible) & Delivery notice */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 truncate">
          <button
            onClick={onOpenLocation}
            className="flex min-w-0 truncate items-center gap-1.5 hover:text-amber-400 transition-colors group cursor-pointer text-left"
            title={`Ver ubicación (${displayAddress})`}
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-400/80 group-hover:text-amber-400" />
            <span className="truncate underline decoration-dotted decoration-slate-600 group-hover:decoration-amber-400">
              {displayAddress}
            </span>
          </button>
          <span className="hidden sm:inline text-gray-500 flex-shrink-0">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-amber-400 font-bold text-[11px] sm:text-xs flex-shrink-0">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{storeInfo?.city ? `Delivery ${storeInfo.city} & Envíos` : "Envíos a Domicilio"}</span>
          </div>
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

          {whatsappNum && (
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" colored={true} />
              <span className="font-mono">{phoneFormatted || whatsappNum}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
