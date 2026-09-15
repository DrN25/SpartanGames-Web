import React from "react";
import { Truck, HelpCircle, Sun, Moon, Phone } from "./Icons";
import { WhatsAppIcon } from "./Icons";

export default function Topbar({
  onOpenPCBuilder,
  onOpenFaq,
  onNavigate,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <div
      className={`py-1.5 px-4 text-xs font-semibold border-b transition-colors ${
        isDarkMode
          ? "bg-[#07090D] border-gray-800/80 text-gray-400"
          : "bg-gray-100 border-gray-200 text-gray-600"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Delivery notice */}
        <div className="flex items-center gap-2 truncate">
          <Truck className="w-3.5 h-3.5 text-[#FFDE17] flex-shrink-0" />
          <span className="truncate">
            <strong className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
              Envíos express en Arequipa:
            </strong>{" "}
            Compuplaza Tienda 204 • Atención L-S 9:30 AM - 8:30 PM
          </span>
        </div>

        {/* Right: Fast nav links + Theme Toggle + WhatsApp */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-[#FFDE17] transition-colors hidden md:inline"
          >
            Inicio
          </button>
          <button
            onClick={() => onNavigate("catalog")}
            className="hover:text-[#FFDE17] transition-colors hidden md:inline font-bold"
          >
            Catálogo
          </button>
          <button
            onClick={onOpenPCBuilder}
            className="text-[#FFDE17] hover:underline transition-colors hidden sm:inline font-bold"
          >
            ⚡ Arma tu PC
          </button>
          <button
            onClick={onOpenFaq}
            className="hover:text-[#FFDE17] transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Pagos & Delivery</span>
          </button>

          {/* Theme Toggle Sun / Moon */}
          <button
            onClick={onToggleTheme}
            className={`p-1 rounded-lg border transition-colors flex items-center gap-1 text-[11px] font-bold ${
              isDarkMode
                ? "border-gray-700 bg-gray-800/80 text-amber-300 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
            }`}
            title={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro Gamer"}
            aria-label="Cambiar tema"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FFDE17]" />
                <span className="hidden lg:inline text-gray-300">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden lg:inline text-gray-700">Oscuro</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Phone */}
          <a
            href="https://wa.me/51912930004"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:underline font-bold"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" colored={true} />
            <span className="hidden sm:inline font-mono">912 930 004</span>
          </a>
        </div>
      </div>
    </div>
  );
}
