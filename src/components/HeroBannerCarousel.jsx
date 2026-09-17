import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from "./Icons";

export default function HeroBannerCarousel({
  banners = [],
  _isDarkMode,
  onNavigate,
  onSelectCategory,
  onSelectProduct,
  onSearchChange,
  onOpenPCBuilder
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef(null);

  const activeBanners = banners && banners.length > 0 ? banners.filter((b) => b.active !== false) : [];

  const handleNext = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const handlePrev = useCallback(() => {
    if (activeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, activeBanners.length, handleNext]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handleActionClick = (banner) => {
    if (!banner) return;
    const type = banner.actionType || "category";
    const target = banner.actionTarget || "";

    switch (type) {
      case "product":
        if (target && onSelectProduct) {
          onSelectProduct(target);
        } else {
          onNavigate("catalog");
        }
        break;
      case "category":
        if (target && onSelectCategory) onSelectCategory(target);
        onNavigate("catalog");
        break;
      case "search":
        if (target && onSearchChange) onSearchChange(target);
        onNavigate("catalog");
        break;
      case "pcbuilder":
        if (onOpenPCBuilder) onOpenPCBuilder();
        break;
      case "whatsapp": {
        const phone = "51912930004";
        const text = encodeURIComponent(`Hola Spartan Games, deseo consultar sobre la promoción: ${banner.title}`);
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
        break;
      }
      default:
        onNavigate("catalog");
        break;
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-gray-800 bg-slate-950 text-white select-none transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ minHeight: "360px" }}
    >
      {/* Background Image Stage with Parallax-like Glow & Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100 hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
          }}
        />
        {/* Multilayer gradient for crystal clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent sm:to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl flex flex-col justify-center min-h-[360px] sm:min-h-[420px]">
        {/* Campaign Tag Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
              current.tagColor || "bg-[#FFDE17] text-slate-950"
            }`}
          >
            {current.tag || "OFERTA DESTACADA"}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-gray-300 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-gray-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Stock físico en Compuplaza Int 211
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md mb-3">
          {current.title}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm lg:text-base text-gray-200 line-clamp-3 leading-relaxed max-w-xl drop-shadow mb-6">
          {current.subtitle}
        </p>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleActionClick(current)}
            className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all flex items-center gap-2.5 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <span>{current.ctaText || "Ver Detalles"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPCBuilder}
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-black/50 hover:bg-black/80 backdrop-blur-md border border-gray-700 text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cotizar en PC Builder</span>
          </button>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-gray-700/60 transition-all cursor-pointer active:scale-90"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-gray-700/60 transition-all cursor-pointer active:scale-90"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700/60">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "w-6 bg-[#FFDE17]" : "w-2 bg-gray-500 hover:bg-gray-300"
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
