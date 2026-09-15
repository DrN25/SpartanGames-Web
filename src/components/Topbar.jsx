import React from "react";
import { Truck, HelpCircle, MapPin } from "./Icons";
import { WhatsAppIcon } from "./Icons";

export default function Topbar({ onOpenFaq, isDarkMode }) {
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
          <span className="truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 hidden sm:inline" />
            <span>C.C. Compuplaza Tienda 204 • Cercado, Arequipa</span>
          </span>
        </div>

        {/* Right: FAQs and WhatsApp */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button
            onClick={onOpenFaq}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Preguntas Frecuentes & Pagos</span>
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
