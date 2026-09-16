import React, { useState, useEffect } from "react";
import {
  MapPin,
  X,
  ExternalLink,
  Copy,
  Check,
  Navigation,
  Clock,
  ShieldCheck,
  Wrench,
  Phone
} from "./Icons";
import { WhatsAppIcon } from "./Icons";

export default function LocationModal({
  isOpen,
  onClose,
  isDarkMode,
  storeInfo = {}
}) {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  const mapsShortUrl = "https://maps.app.goo.gl/gVknznGWkkmZHsgL9";
  const mapsEmbedUrl =
    "https://maps.google.com/maps?q=Spartan+Games+Compuplaza+Arequipa&hl=es&z=19&output=embed";
  const wazeUrl = "https://waze.com/ul?ll=-16.4013312,-71.529535&navigate=yes";
  const fullAddress =
    storeInfo?.address ||
    "Centro Comercial Compuplaza, Tienda 204 - Cercado, Arequipa, Perú";
  const phoneMain = storeInfo?.whatsappMain || "51912930004";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Error al copiar dirección:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-spartan-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ubicación de Tienda Física Spartan Games"
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-spartan-modal ${
          isDarkMode
            ? "bg-[#0B0E14] border-gray-800 text-white"
            : "bg-white border-slate-300 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/60 p-1 flex items-center justify-center shadow-inner flex-shrink-0">
              <img
                src="/assets/images/spartan_games_logo_base_solo.png"
                alt="Spartan Helmet"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-[#FFDE17]">
                  SPARTAN GAMES
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tienda Física Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                C.C. Compuplaza Tienda 204 • Cercado, Arequipa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal de ubicación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Interactive Google Maps Iframe (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 relative bg-slate-100 dark:bg-black/50 shadow-inner group">
            {/* Top Floating Badge */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-white border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#FFDE17]" />
                <span>Compuplaza Tienda 204</span>
              </div>
            </div>

            {/* Google Maps Iframe */}
            <iframe
              src={mapsEmbedUrl}
              title="Mapa de ubicación Spartan Games en Compuplaza Arequipa"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "340px", flex: 1 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Bottom Quick Action Bar over Map */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Arequipa • C.C. Compuplaza (2do Nivel)
              </span>
              <a
                href={mapsShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs ml-auto"
              >
                <span>Ver en App de Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Store Details & Fast Navigation (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Address Box */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode
                    ? "bg-[#121722] border-gray-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-600 dark:text-[#FFDE17]">
                    <MapPin className="w-4 h-4" />
                    <span>Dirección del Local</span>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : isDarkMode
                        ? "bg-black/60 text-slate-300 hover:text-white border border-gray-700"
                        : "bg-white text-slate-700 hover:text-slate-950 border border-slate-300 shadow-xs"
                    }`}
                    title="Copiar dirección al portapapeles"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm font-bold leading-snug text-slate-900 dark:text-white">
                  {fullAddress}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-gray-800/80 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    🧭 Referencia:
                  </span>{" "}
                  Al subir al segundo piso por las escaleras mecánicas, hacia el pasillo principal.
                </div>
              </div>

              {/* Schedule & Hours */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isDarkMode
                    ? "bg-[#121722] border-gray-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-[#FFDE17] flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    Horario de Atención
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {storeInfo?.schedule || "Lunes a Sábado: 9:30 AM - 8:30 PM"}
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-gray-400 block mt-0.5">
                    (Domingos cerrado por mantenimiento)
                  </span>
                </div>
              </div>

              {/* Store Services Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-[#121722]/70 border-gray-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-[#FFDE17] flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    Armado de PC gratis
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-[#121722]/70 border-gray-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    Garantía local física
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Navigation Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-2">
                {/* Open in Google Maps */}
                <a
                  href={mapsShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Google Maps</span>
                </a>

                {/* Open in Waze */}
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-[#33CCFF] hover:bg-[#28b8e6] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>Abrir en Waze</span>
                </a>
              </div>

              {/* Contact by WhatsApp */}
              <a
                href={`https://wa.me/${phoneMain}?text=Hola%20Spartan%20Games%20Arequipa,%20estoy%20yendo%20a%20su%20tienda%20en%20Compuplaza%20Tienda%20204.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" colored={false} />
                <span>Avisar llegada por WhatsApp Oficial</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
