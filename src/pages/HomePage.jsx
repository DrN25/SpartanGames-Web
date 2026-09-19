import React, { useState, useRef, useEffect } from "react";
import HeroBannerCarousel from "../components/home/HeroBannerCarousel";
import CategorySlider from "../components/home/CategorySlider";
import CustomerReviewsSection from "../components/home/CustomerReviewsSection";
import {
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Flame,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  MessageCircle
} from "../components/common/Icons";

export default function HomePage({
  products = [],
  categories = [],
  banners = [],
  reviews = [],
  isDarkMode = false,
  storeInfo = {},
  onNavigate,
  onSelectProduct,
  onSelectCategory,
  onAddToCart,
  onOpenPCBuilder,
  onOpenLocation,
  onOpenFaq,
  onOpenMegaMenu,
  onSearchChange
}) {
  // Promo carousel scroll state & autoplay
  const promoScrollRef = useRef(null);
  const [isPromoPaused, setIsPromoPaused] = useState(false);

  const handlePromoScroll = (direction) => {
    if (!promoScrollRef.current) return;
    const card = promoScrollRef.current.firstElementChild;
    const scrollAmount = card ? card.offsetWidth + 16 : 320;
    promoScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      if (!promoScrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = promoScrollRef.current;
      const card = promoScrollRef.current.firstElementChild;
      const scrollAmount = card ? card.offsetWidth + 16 : 320;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        promoScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        promoScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isPromoPaused]);

  return (
    <main className="space-y-12 pb-16">
      {/* Hero Grid Section: Ultrawide optimized layout */}
      <section className="pt-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1720px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_290px] 2xl:grid-cols-[1fr_310px] gap-5 items-stretch">
          {/* Main Hero Banner: Expanded wide promotional carousel */}
          <div className="flex flex-col min-w-0">
            <HeroBannerCarousel
              banners={banners}
              storeInfo={storeInfo}
              isDarkMode={isDarkMode}
              onNavigate={onNavigate}
              onSelectCategory={onSelectCategory}
              onSelectProduct={(target) => {
                const found = products.find(
                  (p) =>
                    p.id === target ||
                    String(p.id) === String(target) ||
                    (p.sku && p.sku.toLowerCase() === String(target).toLowerCase()) ||
                    (p.name && p.name.toLowerCase().includes(String(target).toLowerCase()))
                );
                if (found) {
                  onSelectProduct(found);
                } else if (onSearchChange && onNavigate) {
                  onSearchChange(String(target));
                  onNavigate("catalog");
                }
              }}
              onSearchChange={onSearchChange}
              onOpenPCBuilder={onOpenPCBuilder}
            />
          </div>

          {/* Right Retail Highlights: 3 balanced service cards */}
          <div className="hidden xl:flex flex-col gap-3.5 w-[290px] 2xl:w-[310px] shrink-0">
            {/* Highlight Card 1: PC Configurator Promo */}
            <div
              className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Servicio Spartan
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white leading-tight mb-2">
                  Configurador de PC
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Compatibilidad 100% probada</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Cotización instantánea en Soles</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenPCBuilder}
                className="mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Armar Mi PC</span>
              </button>
            </div>

            {/* Highlight Card 2: Delivery & Shipping */}
            <div
              className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Despacho Rápido
                  </span>
                  <Truck className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white leading-tight mb-2">
                  Delivery & Envíos
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Mismo día en Arequipa</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>A provincias por Shalom / Olva</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  const phone = (storeInfo?.whatsappMain || storeInfo?.phones?.[0] || "").replace(/[^0-9]/g, "");
                  const text = encodeURIComponent(`Hola ${storeInfo?.name || "Tienda"}, deseo consultar por delivery y envíos.`);
                  if (phone) window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
                }}
                className="mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>Consultar Envíos</span>
              </button>
            </div>

            {/* Highlight Card 3: Tienda Física */}
            <div
              className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Tienda Física
                  </span>
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white leading-tight mb-2 truncate">
                  {storeInfo?.address || "Atención Presencial"}
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                  <li className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{storeInfo?.city || storeInfo?.name || "Local Comercial"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Retiro con 10% y garantía</span>
                  </li>
                </ul>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenLocation}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-all text-center flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-white" />
                  <span>Ubicación</span>
                </button>
                <button
                  onClick={onOpenFaq}
                  className="py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 transition-all text-center active:scale-95 cursor-pointer"
                >
                  Horarios
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Gamer: Interactive Visual Slider with Real Hardware Images */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <CategorySlider
          categories={categories}
          isDarkMode={isDarkMode}
          onSelectCategory={onSelectCategory}
          onOpenMegaMenu={onOpenMegaMenu}
        />
      </section>

      {/* Ofertas Relámpago y Promociones: Interactive Auto-scrolling Ribbon */}
      {products.some((p) => p.isPromo || (p.oldPrice && p.oldPrice > p.price)) && (
        <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30">
                <Flame className="w-4 h-4 text-red-500" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                  Precios Especiales de Temporada
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white mt-0.5">
                  Ofertas Relámpago en Arequipa
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(null);
                  if (onNavigate) onNavigate("catalog");
                }}
                className="hidden sm:inline-flex text-xs font-bold text-red-600 dark:text-red-400 hover:underline items-center gap-1 mr-2"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handlePromoScroll("left")}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-xs"
                }`}
                aria-label="Ofertas anteriores"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePromoScroll("right")}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-xs"
                }`}
                aria-label="Siguientes ofertas"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={promoScrollRef}
            onMouseEnter={() => setIsPromoPaused(true)}
            onMouseLeave={() => setIsPromoPaused(false)}
            onTouchStart={() => setIsPromoPaused(true)}
            onTouchEnd={() => setIsPromoPaused(false)}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products
              .filter((p) => p.isPromo || (p.oldPrice && p.oldPrice > p.price))
              .map((product) => {
                const discountPct = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className={`min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 snap-start rounded-2xl border p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:shadow-md ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-red-500/50"
                        : "bg-white border-slate-200 hover:border-red-400"
                    }`}
                  >
                    <div>
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 mb-3 border border-slate-200/50 dark:border-gray-800 flex items-center justify-center p-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {discountPct > 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
                            -{discountPct}%
                          </span>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                        {product.brand}
                      </span>
                      <h3 className="font-bold text-sm leading-snug line-clamp-2 mt-0.5 group-hover:text-red-500 transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-red-600 dark:text-red-400">
                            S/. {product.price.toFixed(2)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[11px] line-through text-slate-400">
                              S/. {product.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500">Garantía local Arequipa</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToCart) onAddToCart(product);
                        }}
                        className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        aria-label={`Comprar ${product.name}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Catálogo Destacado con Grilla Retail Balanceada */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b pb-4 dark:border-gray-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFDE17] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-amber-400">
                Inventario Físico en Vivo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Componentes & Laptops Destacadas
            </h2>
          </div>

          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory(null);
              if (onNavigate) onNavigate("catalog");
            }}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-[#1A2232] dark:hover:bg-[#FFDE17] dark:hover:text-slate-950 transition-all flex items-center gap-2 border border-slate-800 dark:border-gray-700 shadow-xs cursor-pointer"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product) => {
            const hasPromo = product.isPromo || (product.oldPrice && product.oldPrice > product.price);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group shadow-xs hover:shadow-xl ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800 hover:border-amber-500/50 hover:shadow-black/50"
                    : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-slate-200/80"
                }`}
              >
                <div className="p-4">
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 dark:bg-black/40 mb-3 border border-slate-200/50 dark:border-gray-800 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {hasPromo && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
                        OFERTA
                      </span>
                    )}

                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Brand & Category */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                      {product.brand}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">
                      SKU: {product.sku || product.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm leading-snug line-clamp-2 text-slate-900 dark:text-gray-100 group-hover:text-amber-500 transition-colors mb-2">
                    {product.name}
                  </h3>

                  {/* Quick Specs Chips */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(product.specs || []).slice(0, 2).map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Price + Clean Retail Action Buttons */}
                <div
                  className={`p-4 pt-2 border-t ${
                    isDarkMode ? "border-gray-800/60" : "border-slate-100"
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-[#FF334B]">
                      S/. {product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs line-through text-slate-400">
                        S/. {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(product);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 ${
                      isDarkMode
                        ? "bg-[#18202F] text-slate-100 hover:bg-[#FFDE17] hover:text-slate-950 border border-gray-700"
                        : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 border border-slate-900"
                    }`}
                    aria-label={`Añadir ${product.name} al carrito`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Añadir al Carrito</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PC Builder Teaser Banner */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div
          className={`rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs ${
            isDarkMode
              ? "bg-gradient-to-r from-amber-500/10 to-red-500/10 border-amber-500/30"
              : "bg-gradient-to-r from-amber-100/60 via-white to-amber-50 border-slate-200"
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-[#FFDE17]">
              Herramienta de Cotización Gratuita
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-0.5 text-slate-950 dark:text-white">
              ¿Quieres armar tu PC pieza por pieza?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Prueba nuestro configurador paso a paso con cálculo de presupuesto en Soles en
              tiempo real y exportación directa a WhatsApp con armado gratis en {storeInfo?.city || storeInfo?.name || "tienda física"}.
            </p>
          </div>

          <button
            onClick={onOpenPCBuilder}
            className="py-3 px-6 rounded-xl bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-[#FFDE17] dark:text-slate-950 dark:hover:bg-yellow-400 font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 flex-shrink-0 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Abrir Configurador de PC</span>
          </button>
        </div>
      </section>

      {/* Sección de Confianza & Clientes Felices */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <CustomerReviewsSection isDarkMode={isDarkMode} storeInfo={storeInfo} reviews={reviews} />
      </section>
    </main>
  );
}
