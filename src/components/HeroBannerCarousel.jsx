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
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-gray-800 bg-slate-950 text-white select-none transition-all min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] xl:min-h-[620px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container with Cross-fade & Ken Burns Zoom */}
      {activeBanners.map((banner, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={banner.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image Stage with Intelligent Multi-stop Gradient */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                className={`w-full h-full object-cover object-center sm:object-right transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                }}
              />

              {/* Intelligent Multi-Stop Directional Gradient:
                  - 0% to 35%: Deep obsidian dark (92% -> 80%) so text and buttons are 100% legible even over pure white images
                  - 35% to 65%: Smooth organic transition into transparency
                  - 65% to 100%: 100% transparent so hardware photos, fans, RGB, and products are clear and uncompromised
              */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 via-35% to-transparent sm:via-slate-950/75 sm:via-40% sm:to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Container: Clean floating text without artificial box borders */}
            <div
              className={`relative z-10 p-6 sm:p-10 lg:p-14 max-w-xl lg:max-w-2xl flex flex-col justify-center min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] xl:min-h-[620px] transition-all duration-700 ease-out ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {/* Campaign Tag Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
                    banner.tagColor || "bg-[#FFDE17] text-slate-950"
                  }`}
                >
                  {banner.tag || "OFERTA DESTACADA"}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-gray-200 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-gray-700/60 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Stock físico en Compuplaza Int 211
                </span>
              </div>

              {/* Title with crisp contrast drop-shadow */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-4">
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm lg:text-base text-gray-100 line-clamp-3 leading-relaxed max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] mb-8 font-medium">
                {banner.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleActionClick(banner)}
                  className="px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all flex items-center gap-2.5 shadow-xl shadow-black/50 active:scale-95 cursor-pointer"
                >
                  <span>{banner.ctaText || "Ver Detalles"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenPCBuilder}
                  className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-black/60 hover:bg-black/85 backdrop-blur-md border border-gray-600/80 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-black/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cotizar en PC Builder</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-gray-700/60 transition-all cursor-pointer active:scale-90"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-gray-700/60 transition-all cursor-pointer active:scale-90"
            aria-label="Banner siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-5 right-5 sm:right-8 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-gray-700/60">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? "w-7 bg-[#FFDE17]" : "w-2 bg-gray-500 hover:bg-gray-300"
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
