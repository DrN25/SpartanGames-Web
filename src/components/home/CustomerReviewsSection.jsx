import React, { useState, useRef, useEffect } from "react";
import { Star, ShieldCheck, MapPin, CheckCircle, ChevronLeft, ChevronRight, X } from "../common/Icons";
import { customerReviews } from "../../data/storeData";

export default function CustomerReviewsSection({ isDarkMode, storeInfo }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const reviews = customerReviews || [];

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.firstElementChild;
    const scrollAmount = card ? card.offsetWidth + 16 : 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Auto-scroll loop with pause on hover
  useEffect(() => {
    if (isPaused || reviews.length === 0) return;
    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const card = scrollRef.current.firstElementChild;
      const scrollAmount = card ? card.offsetWidth + 16 : 360;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                Nuestros Clientes lo Confirman
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                4.9 ★ (120+ entregas)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Fotos y testimonios reales de recojo en <span className="font-semibold text-slate-800 dark:text-gray-200">Compuplaza Int 211</span> y envíos al Sur.
            </p>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleScroll("left")}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-xs"
            }`}
            aria-label="Reseñas anteriores"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleScroll("right")}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-xs"
            }`}
            aria-label="Reseñas siguientes"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compact Horizontal Auto-scrolling Ribbon */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-none no-scrollbar select-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`group flex-shrink-0 w-full sm:w-[calc(100%-0.5rem)] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] rounded-2xl border p-4 flex gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 hover:border-emerald-500/40"
                : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-emerald-500/5"
            }`}
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Left: Client photo thumbnail (clickable to enlarge) */}
            <div
              onClick={() => setSelectedPhoto(review)}
              className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-[#FFDE17] flex-shrink-0 cursor-pointer relative group/thumb shadow-xs"
              title="Clic para ampliar foto de entrega"
            >
              <img
                src={review.image}
                alt={review.name}
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/spartan_games_logo_base_solo.png";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold">
                Ampliar
              </div>
            </div>

            {/* Right: Review details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white truncate">
                    {review.name}
                  </h3>
                  <div className="flex items-center text-amber-400 flex-shrink-0">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-gray-400 truncate font-medium mb-1.5 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{review.city}</span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed italic line-clamp-2 mb-2">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-1.5 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-gray-400 font-semibold truncate">
                  {review.purchase}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0 ml-1">
                  ✓ Verificado
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox for Full Photo Preview */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden mb-3 bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.name || "Foto de entrega"}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            <div className="px-2 pb-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-black text-white uppercase">
                  {selectedPhoto.name}
                </h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {selectedPhoto.badge || "Compra Verificada"}
                </span>
              </div>
              <p className="text-xs text-gray-300 italic mb-2">
                "{selectedPhoto.comment}"
              </p>
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFDE17]" />
                <span>{storeInfo?.address || "Calle Octavio Muñoz Najar 223 Int 211 Compuplaza"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
