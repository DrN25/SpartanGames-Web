import React, { useState, useEffect, useRef } from "react";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import MarqueeTicker from "./components/MarqueeTicker";
import CatalogView from "./components/CatalogView";
import ProductDetail from "./components/ProductDetail";
import MegaMenuDrawer from "./components/MegaMenuDrawer";
import CartDrawer from "./components/CartDrawer";
import PCBuilderModal from "./components/PCBuilderModal";
import FaqModal from "./components/FaqModal";
import LocationModal from "./components/LocationModal";
import ChatIABubble from "./components/ChatIABubble";
import Footer from "./components/Footer";
import HeroBannerCarousel from "./components/HeroBannerCarousel";
import CategorySlider from "./components/CategorySlider";
import CustomerReviewsSection from "./components/CustomerReviewsSection";
import {
  fetchLiveCatalog,
  getCachedCatalog,
  getCachedCategories,
  getCachedConfig,
  getCachedBanners,
  countCategories
} from "./services/catalogService";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Flame,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  MessageCircle
} from "./components/Icons";

export default function App() {
  // Live Products, Categories, and Store Settings synced with Google Sheets tabs
  const [products, setProducts] = useState(() => getCachedCatalog());
  const [categories, setCategories] = useState(() => countCategories(getCachedCategories(), getCachedCatalog()));
  const [storeInfo, setStoreInfo] = useState(() => getCachedConfig());
  const [banners, setBanners] = useState(() => getCachedBanners());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");

  // Navigation View State: 'home' | 'catalog' | 'product'
  const [view, setView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const cached = getCachedCatalog();
    return cached && cached.length > 0 ? cached[0] : null;
  });

  useEffect(() => {
    if (!selectedProduct && products && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSyncCatalog = async (force = false) => {
    setIsSyncing(true);
    try {
      const data = await fetchLiveCatalog(force);
      if (data) {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          setSelectedProduct((prev) => {
            if (!prev) return data.products[0];
            const match = data.products.find((p) => p.id === prev.id);
            return match || data.products[0];
          });
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (data.storeInfo) {
          setStoreInfo(data.storeInfo);
        }
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (e) {
      console.warn("Live sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    handleSyncCatalog(false);
  }, []);

  // Theme State: Light Mode is PRIMARY by default
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("spartan_theme");
    return saved !== null ? saved === "dark" : false;
  });

  // Cart State with LocalStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("spartan_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPCBuilderOpen, setIsPCBuilderOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Sync theme with HTML root class
  useEffect(() => {
    localStorage.setItem("spartan_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Sync cart with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("spartan_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Cart handlers
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleAddBatchToCart = (productsToAdd = []) => {
    if (!productsToAdd || productsToAdd.length === 0) return;
    setCart((prev) => {
      let updated = [...prev];
      productsToAdd.forEach((product) => {
        const existingIndex = updated.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1
          };
        } else {
          updated.push({ ...product, quantity: 1 });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation handlers
  const handleNavigate = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setView("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setView("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    if (isPromoPaused || view !== "home") return;
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
  }, [isPromoPaused, view]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? "bg-[#07090D] text-gray-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* 1. Topbar */}
      <Topbar
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        isDarkMode={isDarkMode}
        isSyncing={isSyncing}
        onSync={() => handleSyncCatalog(true)}
        lastSyncTime={lastSyncTime}
        storeInfo={storeInfo}
      />

      {/* 2. Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onNavigate={handleNavigate}
        currentView={view}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        storeInfo={storeInfo}
      />

      {/* 3. Marquee Ticker */}
      <MarqueeTicker storeInfo={storeInfo} />

      {/* 4. Main Views Router */}
      <div className="flex-1">
        {/* VIEW: HOME */}
        {view === "home" && (
          <main className="space-y-12 pb-16">
            {/* Hero Grid Section: Ultrawide optimized layout */}
            <section className="pt-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1720px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_290px] 2xl:grid-cols-[1fr_310px] gap-5 items-stretch">
                {/* Main Hero Banner: Expanded wide promotional carousel */}
                <div className="flex flex-col min-w-0">
                  <HeroBannerCarousel
                    banners={banners}
                    isDarkMode={isDarkMode}
                    onNavigate={handleNavigate}
                    onSelectCategory={handleSelectCategory}
                    onSelectProduct={(target) => {
                      const found = products.find(
                        (p) =>
                          p.id === target ||
                          String(p.id) === String(target) ||
                          (p.sku && p.sku.toLowerCase() === String(target).toLowerCase()) ||
                          (p.name && p.name.toLowerCase().includes(String(target).toLowerCase()))
                      );
                      if (found) {
                        handleSelectProduct(found);
                      } else {
                        setSearchQuery(String(target));
                        handleNavigate("catalog");
                      }
                    }}
                    onSearchChange={setSearchQuery}
                    onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
                  />
                </div>

                {/* Right Retail Highlights: 3 balanced service cards (No blank voids) */}
                {/* Right Retail Highlights: 3 balanced service cards (Harmonized Color Themes) */}
                <div className="hidden xl:flex flex-col gap-3.5 w-[290px] 2xl:w-[310px] shrink-0">
                  {/* Highlight Card 1: PC Configurator Promo (Unified Amber/Gold Theme) */}
                  <div
                    className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800"
                        : "bg-white border-slate-200"
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
                        Configurador PC Gamer
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
                      onClick={() => setIsPCBuilderOpen(true)}
                      className="mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Armar Mi PC Gamer</span>
                    </button>
                  </div>

                  {/* Highlight Card 2: Delivery & Shipping (Unified Emerald Theme) */}
                  <div
                    className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800"
                        : "bg-white border-slate-200"
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
                        const phone = "51912930004";
                        const text = encodeURIComponent("Hola Spartan Games, deseo consultar por delivery y envíos.");
                        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
                      }}
                      className="mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                      <span>Consultar Envíos</span>
                    </button>
                  </div>

                  {/* Highlight Card 3: Tienda Física Compuplaza (Unified Blue Theme) */}
                  <div
                    className={`rounded-2xl p-4 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Tienda Física
                        </span>
                        <MapPin className="w-4 h-4 text-blue-500" />
                      </div>
                      <h3 className="text-sm font-black uppercase text-slate-950 dark:text-white leading-tight mb-2">
                        Calle Octavio Muñoz Najar 223
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                        <li className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="line-clamp-1">Int 211 C.C. Compuplaza</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Retiro con 10% y garantía</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsLocationOpen(true)}
                        className="py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-all text-center flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-white" />
                        <span>Ubicación</span>
                      </button>
                      <button
                        onClick={() => setIsFaqOpen(true)}
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
                onSelectCategory={handleSelectCategory}
                onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
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
                        setSelectedCategory(null);
                        handleNavigate("catalog");
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
                      aria-label="Ofertas siguientes"
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
                  className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-none no-scrollbar select-none"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {products
                    .filter((p) => p.isPromo || (p.oldPrice && p.oldPrice > p.price))
                    .map((product) => {
                      const discount = product.oldPrice
                        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                        : 0;
                      const savings = product.oldPrice ? (product.oldPrice - product.price).toFixed(2) : 0;

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className={`group flex-shrink-0 w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)] rounded-3xl border p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                            isDarkMode
                              ? "bg-gradient-to-b from-[#161D2A] to-[#111620] border-red-500/30 hover:border-red-500/60"
                              : "bg-white border-red-200 hover:border-red-400 hover:shadow-red-500/5"
                          }`}
                          style={{ scrollSnapAlign: "start" }}
                        >
                          <div>
                            {/* Top badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#FF334B] text-white shadow-xs">
                                Ahorra S/. {savings} ({discount}% OFF)
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Stock: {product.stock} unid.
                              </span>
                            </div>

                            {/* Image */}
                            <div className={`relative aspect-square rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-3 ${
                              isDarkMode ? "bg-black/40" : "bg-slate-50"
                            }`}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-gray-400 mb-1">
                              {product.category} • {product.brand}
                            </div>
                            <h3 className="font-black text-sm text-slate-950 dark:text-white line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                              {product.name}
                            </h3>
                          </div>

                          {/* Price and Cart */}
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80">
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-xl font-black text-[#FF334B]">
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
                                handleAddToCart(product);
                              }}
                              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-[#FF334B] hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Aprovechar Oferta</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* Productos Destacados: Ultrawide Grid (up to 5 and 6 columns on large monitors) */}
            <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-[#FFDE17]">
                    Stock Físico en Arequipa
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white mt-0.5">
                    Equipamiento Destacado en Tienda
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("catalog")}
                  className="text-xs font-bold text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5"
                >
                  <span>Ir al Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
                {(products.filter((p) => p.featured).length > 0
                  ? products.filter((p) => p.featured)
                  : products
                )
                  .slice(0, 12)
                  .map((product) => {
                  const discount = product.oldPrice
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`group rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                        isDarkMode
                          ? "bg-[#111620] border-gray-800 hover:border-amber-400/50 hover:shadow-lg hover:shadow-black/40"
                          : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-md"
                      }`}
                    >
                      <div>
                        {/* Image Stage */}
                        <div
                          className={`relative p-4 aspect-square flex items-center justify-center overflow-hidden ${
                            isDarkMode ? "bg-black/40" : "bg-slate-50/70"
                          }`}
                        >
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-950 text-[#FFDE17]">
                              {product.brand}
                            </span>
                            {discount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FF334B] text-white">
                                -{discount}%
                              </span>
                            )}
                          </div>

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                            }}
                          />

                          <div className="absolute bottom-2 left-3 right-3 text-[10px] font-bold">
                            {product.stock <= 4 ? (
                              <span className="text-red-700 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900 font-bold">
                                ¡Quedan {product.stock} unid.!
                              </span>
                            ) : (
                              <span className="text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900 font-bold">
                                En Stock ({product.stock} unid.)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-gray-400 mb-1">
                            {product.category}
                          </div>
                          <h3
                            onClick={() => handleSelectProduct(product)}
                            className="font-bold text-xs sm:text-sm line-clamp-2 text-slate-950 dark:text-white hover:text-amber-800 dark:hover:text-[#FFDE17] cursor-pointer transition-colors leading-snug"
                            title={product.name}
                          >
                            {product.name}
                          </h3>

                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {product.specs.slice(0, 2).map((spec, i) => (
                              <span
                                key={i}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                                  isDarkMode
                                    ? "bg-gray-800/80 text-gray-300"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
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
                            handleAddToCart(product);
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

            {/* PC Builder Teaser Banner: Wide Screen Retail Banner */}
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
                    ¿Quieres armar tu PC Gamer pieza por pieza?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                    Prueba nuestro configurador paso a paso con cálculo de presupuesto en Soles en
                    tiempo real y exportación directa a WhatsApp con armado gratis en Compuplaza.
                  </p>
                </div>

                <button
                  onClick={() => setIsPCBuilderOpen(true)}
                  className="py-3 px-6 rounded-xl bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-[#FFDE17] dark:text-slate-950 dark:hover:bg-yellow-400 font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 flex-shrink-0 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Abrir Configurador de PC</span>
                </button>
              </div>
            </section>

            {/* Sección de Confianza & Clientes Felices en Compuplaza */}
            <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
              <CustomerReviewsSection isDarkMode={isDarkMode} storeInfo={storeInfo} />
            </section>
          </main>
        )}

        {/* VIEW: CATALOG (Independent view with filters) */}
        {view === "catalog" && (
          <CatalogView
            products={products}
            categories={categories}
            isDarkMode={isDarkMode}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            storeInfo={storeInfo}
          />
        )}

        {/* VIEW: PRODUCT DETAIL (100% INDEPENDENT VIEW) */}
        {view === "product" && (
          <div className="py-6">
            <ProductDetail
              product={selectedProduct}
              allProducts={products}
              isDarkMode={isDarkMode}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onSelectCategory={handleSelectCategory}
              onNavigate={handleNavigate}
              storeInfo={storeInfo}
            />
          </div>
        )}
      </div>

      {/* Drawers & Modals */}
      <MegaMenuDrawer
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        categories={categories}
        isDarkMode={isDarkMode}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isDarkMode={isDarkMode}
        storeInfo={storeInfo}
      />

      <PCBuilderModal
        isOpen={isPCBuilderOpen}
        onClose={() => setIsPCBuilderOpen(false)}
        isDarkMode={isDarkMode}
        products={products}
        storeInfo={storeInfo}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        isDarkMode={isDarkMode}
        storeInfo={storeInfo}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        isDarkMode={isDarkMode}
        storeInfo={storeInfo}
      />

      {/* Floating AI Assistant Chat powered by OpenRouter GPT-5.6 Luna with live catalog */}
      <ChatIABubble
        isDarkMode={isDarkMode}
        products={products}
        categories={categories}
        storeInfo={storeInfo}
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
        onAddBatchToCart={handleAddBatchToCart}
        onNavigate={handleNavigate}
      />

      {/* 5. Footer */}
      <Footer
        isDarkMode={isDarkMode}
        onNavigate={handleNavigate}
        onOpenLocation={() => setIsLocationOpen(true)}
        storeInfo={storeInfo}
      />
    </div>
  );
}

