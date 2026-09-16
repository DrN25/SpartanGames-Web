import React from "react";
import { X, HelpCircle } from "./Icons";
import { WhatsAppIcon } from "./Icons";
import { faqData, storeInfo as defaultStoreInfo } from "../data/storeData";

export default function FaqModal({ isOpen, onClose, isDarkMode, storeInfo: propStoreInfo }) {
  const storeInfo = propStoreInfo || defaultStoreInfo;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-spartan-fade-in">
      <div
        className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-spartan-modal ${
          isDarkMode
            ? "bg-[#0E121A] border-gray-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFDE17] text-slate-950 flex items-center justify-center font-black shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wide text-slate-950 dark:text-white">
                Preguntas Frecuentes & Políticas Spartan
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                Atención oficial en C.C. Compuplaza Tienda 204, Arequipa
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
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-colors ${
                isDarkMode
                  ? "bg-[#111620] border-gray-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <h3 className="font-black text-xs uppercase tracking-wide mb-1.5 text-slate-950 dark:text-white flex items-center gap-2">
                <span className="text-amber-800 dark:text-[#FFDE17] font-mono">0{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-gray-400 pl-6">
                {faq.a}
              </p>
            </div>
          ))}

          {/* Contacto Directo */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDarkMode ? "bg-emerald-950/20 border-emerald-500/30" : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div>
              <div className="font-black text-xs uppercase text-emerald-900 dark:text-emerald-400">
                ¿Tienes una consulta específica sobre tu proforma?
              </div>
              <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-0.5">
                Escríbenos directamente por WhatsApp y te asesoramos al instante.
              </div>
            </div>
            <a
              href={`https://wa.me/${storeInfo.whatsappMain}?text=Hola%20Spartan%20Games,%20tengo%20una%20consulta%20técnica.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl font-bold uppercase text-[11px] bg-[#25D366] text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chatear</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
