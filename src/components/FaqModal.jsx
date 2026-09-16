import React, { useState, useEffect } from "react";
import { X, HelpCircle, Search } from "./Icons";
import { WhatsAppIcon } from "./Icons";
import { faqData, storeInfo as defaultStoreInfo } from "../data/storeData";
import { useModalTransition } from "../hooks/useModalTransition";

export default function FaqModal({ isOpen, onClose, isDarkMode, storeInfo: propStoreInfo }) {
  const storeInfo = propStoreInfo || defaultStoreInfo;
  const [searchTerm, setSearchTerm] = useState("");
  const { shouldRender, isClosing } = useModalTransition(isOpen, 220);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  // Safely normalize grouped structure ({ category, items: [{ q, a }] }) or flat structure ({ q, a })
  const normalizedGroups = faqData.map((group, gIdx) => {
    if (group.items && Array.isArray(group.items)) {
      return {
        id: `group-${gIdx}`,
        category: group.category || null,
        items: group.items
      };
    }
    return {
      id: `group-${gIdx}`,
      category: null,
      items: [group]
    };
  });

  const term = searchTerm.toLowerCase().trim();
  const filteredGroups = normalizedGroups
    .map((group) => {
      const items = group.items.filter((item) => {
        if (!term) return true;
        const q = (item.q || item.question || "").toLowerCase();
        const a = (item.a || item.answer || "").toLowerCase();
        return q.includes(term) || a.includes(term);
      });
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  const totalQuestions = filteredGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md ${
        isClosing ? "animate-spartan-fade-out" : "animate-spartan-fade-in"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preguntas Frecuentes y Políticas Spartan Games"
    >
      <div
        className={`relative w-full max-w-3xl border-0 rounded-3xl shadow-2xl shadow-black/90 flex flex-col max-h-[88vh] overflow-hidden ${
          isClosing ? "animate-spartan-modal-exit" : "animate-spartan-modal"
        } ${
          isDarkMode
            ? "bg-[#0B0E14] text-white"
            : "bg-slate-50 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-800 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/60 p-1 flex items-center justify-center shadow-inner flex-shrink-0">
              <img
                src="/assets/images/spartan_games_logo_base_solo.png"
                alt="Spartan"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-wider text-[#FFDE17]">
                  Preguntas Frecuentes
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Políticas Spartan
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Atención y soporte directo en Calle Octavio Muñoz Najar 223 Int 211 Compuplaza, Arequipa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter Bar */}
        <div
          className={`p-3 sm:px-6 border-b flex items-center gap-2.5 ${
            isDarkMode ? "bg-[#0E121A] border-gray-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por 'yape', 'delivery', 'garantía', 'boleta'..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs font-medium border transition-colors outline-none ${
                isDarkMode
                  ? "bg-black/50 border-gray-800 text-white placeholder-slate-500 focus:border-amber-400"
                  : "bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-amber-500"
              }`}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-amber-600 dark:text-[#FFDE17] font-bold px-2 py-1 hover:underline cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {totalQuestions === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No encontramos respuestas para "{searchTerm}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prueba con otros términos o escríbenos directamente por WhatsApp.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-colors"
              >
                Ver todas las preguntas
              </button>
            </div>
          ) : (
            filteredGroups.map((group, gIdx) => (
              <div key={group.id || gIdx} className="space-y-3">
                {group.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-[#FFDE17]">
                      {group.category}
                    </span>
                    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-gray-800" />
                  </div>
                )}

                <div className="space-y-2.5">
                  {group.items.map((item, itemIdx) => {
                    const q = item.q || item.question;
                    const a = item.a || item.answer;
                    return (
                      <div
                        key={itemIdx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDarkMode
                            ? "bg-[#111724] border-gray-800 text-white"
                            : "bg-white border-slate-200 text-slate-900 shadow-xs"
                        }`}
                      >
                        <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 dark:text-white flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-[#FFDE17] font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            Q
                          </span>
                          <span className="leading-snug">{q}</span>
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-7.5">
                          {a}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Contacto Directo WhatsApp Footer */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDarkMode
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div>
              <div className="font-black text-xs uppercase text-emerald-900 dark:text-emerald-400">
                ¿Tienes una consulta específica sobre tu proforma o stock?
              </div>
              <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-0.5">
                Escríbenos directamente por WhatsApp y te asesoramos al instante en tienda.
              </div>
            </div>
            <a
              href={`https://wa.me/${storeInfo.whatsappMain || "51912930004"}?text=Hola%20Spartan%20Games,%20tengo%20una%20consulta%20técnica.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl font-bold uppercase text-[11px] bg-[#25D366] hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" colored={false} />
              <span>Chatear</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
