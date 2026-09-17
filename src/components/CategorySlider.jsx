import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "./Icons";

export default function CategorySlider({
  categories = [],
  isDarkMode,
  onSelectCategory,
  onOpenMegaMenu
}) {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Auto-scroll loop with pause on hover / touch
  useEffect(() => {
    if (isPaused || !categories || categories.length === 0) return;
    const timer = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: 250, behavior: "smooth" });
      }
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, categories]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-[#FFDE17] mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>Exploración por Hardware</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            Categorías Gamer Destacadas
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMegaMenu}
            className="hidden sm:inline-flex text-xs font-bold text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-[#FFDE17] mr-2"
          >
            Ver todas →
          </button>

          <button
            onClick={() => handleScroll("left")}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
              isDarkMode
                ? "bg-[#111620] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-xs"
            }`}
            aria-label="Desplazar categorías a la izquierda"
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
            aria-label="Desplazar categorías a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Strip */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-none no-scrollbar select-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat) => {
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex-shrink-0 w-44 sm:w-52 md:w-56 rounded-2xl border p-3 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isDarkMode
                  ? "bg-[#111620] border-gray-800 hover:border-amber-400/60 hover:shadow-amber-500/5"
                  : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-amber-500/10"
              }`}
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image Container with Dynamic Hardware Image */}
              <div
                className={`relative w-full aspect-square rounded-xl overflow-hidden mb-3 p-2 flex items-center justify-center transition-colors ${
                  isDarkMode ? "bg-black/40" : "bg-slate-50"
                }`}
              >
                <img
                  src={cat.image || "/assets/images/spartan_games_banner.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                  }}
                />

                {/* Stock Count Pill */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-slate-950 text-[#FFDE17] shadow-sm">
                    {cat.count} unid.
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div>
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-950 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#FFDE17] transition-colors truncate">
                  {cat.name}
                </h3>

                {cat.subCategories && cat.subCategories.length > 0 && (
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
                    {cat.subCategories.slice(0, 2).join(" • ")}
                  </p>
                )}
              </div>

              {/* Bottom Action Hint */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-[#FFDE17]">
                <span>Explorar</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
