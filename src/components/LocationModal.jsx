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
  Phone,
  Plus,
  Minus,
  RotateCcw,
  ArrowRight
} from "./Icons";
import { WhatsAppIcon } from "./Icons";

export default function LocationModal({
  isOpen,
  onClose,
  isDarkMode,
  storeInfo = {}
}) {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(19);

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
  const mapsEmbedUrl = `https://maps.google.com/maps?q=Spartan+Games+Compuplaza+Arequipa&hl=es&z=${zoomLevel}&output=embed`;
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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(21, prev + 1));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(13, prev - 1));
  };

  const handleResetZoom = (level = 19) => {
    setZoomLevel(level);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ubicación de Tienda Física Spartan Games"
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isDarkMode
            ? "bg-[#090D14] border-gray-800 text-white"
            : "bg-slate-50 border-slate-300 text-slate-900"
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
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
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
          {/* Left Column: Interactive Google Maps Iframe + Direct Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[350px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 relative bg-slate-900 shadow-inner group">
            {/* Top Left: Store Location Pill */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-white border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#FFDE17]" />
                <span>Compuplaza Tienda 204</span>
              </div>
            </div>

            {/* Top Right: Direct Zoom Controls (No Control Key Needed!) */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-xl backdrop-blur-md">
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-[#FFDE17] text-slate-200 hover:text-slate-950 flex items-center justify-center transition-all font-bold cursor-pointer"
                title="Acercar mapa (+)"
                aria-label="Acercar mapa"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-[#FFDE17] text-slate-200 hover:text-slate-950 flex items-center justify-center transition-all font-bold cursor-pointer"
                title="Alejar mapa (-)"
                aria-label="Alejar mapa"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
              <button
                onClick={() => handleResetZoom(19)}
                className="px-2 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Restablecer zoom a Spartan Games"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Google Maps Iframe */}
            <iframe
              src={mapsEmbedUrl}
              key={mapsEmbedUrl}
              title="Mapa de ubicación Spartan Games en Compuplaza Arequipa"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "340px", flex: 1 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Bottom Bar: Presets & Helpful Guide */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              {/* Zoom Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
                  Vistas:
                </span>
                <button
                  onClick={() => handleResetZoom(20)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    zoomLevel >= 20
                      ? "bg-[#FFDE17] text-slate-950 shadow-xs"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  }`}
                >
                  🔍 Tienda 204
                </button>
                <button
                  onClick={() => handleResetZoom(18)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    zoomLevel === 18 || zoomLevel === 19
                      ? "bg-[#FFDE17] text-slate-950 shadow-xs"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  }`}
                >
                  🏬 Compuplaza
                </button>
                <button
                  onClick={() => handleResetZoom(15)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    zoomLevel <= 16
                      ? "bg-[#FFDE17] text-slate-950 shadow-xs"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  }`}
                >
                  🏙️ Cercado AQP
                </button>
              </div>

              {/* Quick tip badge */}
              <div className="text-[10px] text-amber-400/90 font-medium ml-auto flex items-center gap-1">
                <span>💡 Doble clic para zoom rápido</span>
              </div>
            </div>
          </div>

          {/* Right Column: Store Details & Unified Action Hub (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="space-y-3.5">
              {/* Address Card with Copy Button */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode
                    ? "bg-[#111724] border-gray-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-[#FFDE17]">
                    <MapPin className="w-4 h-4" />
                    <span>Ubicación Exacta</span>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                      copied
                        ? "bg-emerald-500 text-white shadow-xs scale-105"
                        : isDarkMode
                        ? "bg-black/60 text-slate-300 hover:text-white border border-gray-700 hover:border-gray-500"
                        : "bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-200"
                    }`}
                    title="Copiar dirección al portapapeles"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
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

                <p className="text-sm font-black leading-snug text-slate-950 dark:text-white">
                  {fullAddress}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-gray-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="text-base leading-none">🧭</span>
                  <span>
                    <strong className="text-slate-900 dark:text-slate-200 font-bold">
                      Referencia:
                    </strong>{" "}
                    Subir al segundo piso por las escaleras mecánicas, hacia el pasillo central de tecnología.
                  </span>
                </div>
              </div>

              {/* Schedule Card */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  isDarkMode
                    ? "bg-[#111724] border-gray-800"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 dark:text-[#FFDE17] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Horario de Atención
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {storeInfo?.schedule || "Lunes a Sábado: 9:30 AM - 8:30 PM"}
                  </p>
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-[#111724]/80 border-gray-800"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <Wrench className="w-4 h-4 text-[#FFDE17] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    Armado de PC gratis
                  </span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-[#111724]/80 border-gray-800"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    Garantía local física
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION HUB: High-Contrast Navigation & WhatsApp Cards */}
            <div className="space-y-2.5 pt-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                Llegar a la Tienda & Contacto:
              </div>

              {/* Google Maps & Waze Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {/* Google Maps Card */}
                <a
                  href={mapsShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2.5 sm:p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 flex items-center gap-2 sm:gap-2.5 shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all cursor-pointer min-w-0"
                  title="Abrir ubicación en la aplicación de Google Maps"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black uppercase tracking-tight leading-none whitespace-nowrap">
                      Google Maps
                    </div>
                    <div className="text-[10px] text-blue-100 truncate mt-1">
                      Ruta en App
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform hidden sm:inline" />
                </a>

                {/* Waze Card */}
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-2.5 sm:p-3 rounded-2xl border flex items-center gap-2 sm:gap-2.5 shadow-md hover:-translate-y-0.5 transition-all cursor-pointer min-w-0 ${
                    isDarkMode
                      ? "bg-slate-900 hover:bg-slate-850 text-white border-slate-700"
                      : "bg-slate-900 hover:bg-slate-800 text-white border-slate-900"
                  }`}
                  title="Navegar con tráfico en tiempo real en Waze"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#33CCFF]/25 text-[#33CCFF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-4 h-4 text-[#33CCFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black uppercase tracking-tight leading-none whitespace-nowrap text-white">
                      Waze
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-1">
                      Ruta con tráfico
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform hidden sm:inline" />
                </a>
              </div>

              {/* WhatsApp Hero Card: Vibrant, Eye-Catching & High-Converting */}
              <a
                href={`https://wa.me/${phoneMain}?text=Hola%20Spartan%20Games%20Arequipa,%20estoy%20yendo%20a%20su%20tienda%20en%20Compuplaza%20Tienda%20204.`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all border border-emerald-400/40 cursor-pointer"
                title="Avisar llegada o consultar por WhatsApp Oficial"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="w-5 h-5 text-white" colored={false} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 leading-tight">
                      <span>WhatsApp Oficial</span>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping flex-shrink-0" />
                    </div>
                    <div className="text-[11px] text-emerald-100 font-medium truncate mt-0.5">
                      Avisar llegada o consultar stock en tienda
                    </div>
                  </div>
                </div>

                <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white text-emerald-950 font-black text-xs group-hover:bg-emerald-50 transition-colors flex items-center gap-1 flex-shrink-0 shadow-xs ml-2">
                  <span>Chatear</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
