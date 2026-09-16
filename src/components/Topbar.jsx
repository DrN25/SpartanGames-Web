import React from "react";
import { Truck, HelpCircle, MapPin, FileSpreadsheet, RefreshCw, ExternalLink } from "./Icons";
import { WhatsAppIcon } from "./Icons";
import { GOOGLE_SHEET_EDIT_URL } from "../services/catalogService";

export default function Topbar({ onOpenFaq, onOpenLocation, isDarkMode, isSyncing, onSync, lastSyncTime }) {
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
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Delivery Arequipa Express</span>
          </div>
          <span className="hidden md:inline text-gray-500">•</span>
          <button
            onClick={onOpenLocation}
            className="truncate flex items-center gap-1.5 hover:text-amber-400 transition-colors group cursor-pointer text-left"
            title="Ver ubicación en Google Maps (C.C. Compuplaza Tienda 204)"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-400/80 group-hover:text-amber-400 hidden sm:inline" />
            <span className="underline decoration-dotted decoration-slate-600 group-hover:decoration-amber-400">
              C.C. Compuplaza Tienda 204 • Cercado, Arequipa
            </span>
          </button>
        </div>

        {/* Right: Google Sheets live status, FAQs, and WhatsApp */}
        <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
          {/* Live Google Sheets Admin pill */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 rounded-lg text-[11px]">
            <a
              href={GOOGLE_SHEET_EDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              title="Abrir hoja de cálculo de Google Sheets para editar productos, precios y stock"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Gestionar en Sheets</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <span className="text-slate-600">|</span>

            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
              title={lastSyncTime ? `Última sincronización: ${lastSyncTime}` : "Sincronizar cambios en vivo desde Sheets"}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden md:inline">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </button>
          </div>

          <button
            onClick={onOpenFaq}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden xl:inline">Preguntas Frecuentes</span>
          </button>

          <a
            href="https://wa.me/51912930004"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" colored={true} />
            <span className="font-mono">912 930 004</span>
          </a>
        </div>
      </div>
    </div>
  );
}
