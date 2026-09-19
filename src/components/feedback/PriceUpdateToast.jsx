import React, { useState, useEffect } from "react";
import { Sparkles, X, RefreshCw } from "../common/Icons";

/**
 * Floating glassmorphic notification banner for live catalog price updates.
 * Inspired by modern dark glass cockpit designs (e.g., pixai.art).
 */
export default function PriceUpdateToast({
  isOpen,
  onApply,
  onDismiss,
  changedCount = 0,
  isDarkMode = true,
  storeInfo = {}
}) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  if (!visible) return null;

  const storeDisplay = storeInfo?.name ? `${storeInfo.name}${storeInfo.city ? ` ${storeInfo.city}` : ""}` : "tienda";

  return (
    <div
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100vw-2rem)] animate-spartan-modal"
      role="status"
      aria-live="polite"
    >
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${
          isDarkMode
            ? "bg-[#0E131F]/90 border-amber-500/40 text-white shadow-black/80"
            : "bg-white/95 border-amber-400/60 text-slate-900 shadow-slate-300"
        }`}
      >
        {/* Left: Icon & Message */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-[#FFDE17]">
                Precios Actualizados
              </span>
              {changedCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono border border-amber-500/30">
                  {changedCount} {changedCount === 1 ? "cambio" : "cambios"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-gray-300 truncate">
              Nuevos precios o stock en {storeDisplay}.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              if (onApply) onApply();
              setVisible(false);
            }}
            className="py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
            <span className="whitespace-nowrap">Actualizar</span>
          </button>

          <button
            onClick={() => {
              if (onDismiss) onDismiss();
              setVisible(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Descartar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
