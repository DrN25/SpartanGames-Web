import React, { useState, useEffect, useMemo } from "react";
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
import {
  fetchLiveCatalog,
  getCachedCatalog,
  getCachedCategories,
  getCachedConfig,
  countCategories
} from "./services/catalogService";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Cpu,
  ShoppingCart,
  Eye,
  Layers,
  Laptop,
  Tv,
  Headphones,
  Gamepad2,
  Database,
  HardDrive,
  Wrench,
  Flame,
  MapPin
} from "./components/Icons";

export default function App() {
  // Live Products, Categories, and Store Settings synced with Google Sheets tabs
  const [products, setProducts] = useState(() => getCachedCatalog());
  const [categories, setCategories] = useState(() => countCategories(getCachedCategories(), getCachedCatalog()));
  const [storeInfo, setStoreInfo] = useState(() => getCachedConfig());
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

  // Distinct icon per category
  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Laptop":
        return <Laptop className="w-5 h-5" />;
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      case "Gamepad2":
        return <Gamepad2 className="w-5 h-5" />;
      case "HardDrive":
        return <HardDrive className="w-5 h-5" />;
      case "Tv":
        return <Tv className="w-5 h-5" />;
      case "Database":
        return <Database className="w-5 h-5" />;
      case "Headphones":
        return <Headphones className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

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
      />

      {/* 3. Marquee Ticker */}
      <MarqueeTicker />

      {/* 4. Main Views Router */}
      <div className="flex-1">
        {/* VIEW: HOME */}
        {view === "home" && (
          <main className="space-y-12 pb-16">
            {/* Hero Grid Section: Ultrawide optimized layout */}
            <section className="pt-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1720px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                {/* Main Hero Banner: 8 cols on large screens */}
                <div
                  className={`relative rounded-3xl overflow-hidden border p-8 sm:p-12 lg:p-14 shadow-sm xl:col-span-8 flex flex-col justify-between ${
                    isDarkMode
                      ? "bg-gradient-to-r from-black via-[#111620] to-black border-gray-800"
                      : "bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-slate-200"
                  }`}
                >
                  {/* Artwork Background */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
                    <img
                      src="/assets/images/spartan_games_banner.jpg"
                      alt="Spartan Games Arequipa"
                      className="w-full h-full object-cover object-right"
                    />
                  </div>

                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-[#FFDE17] text-slate-950 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      Hardware Gamer Oficial en Arequipa
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-4 text-slate-950 dark:text-white">
                      COMPONENTES Y PCs GAMER CON GARANTÍA LOCAL
                    </h1>

                    <p
                      className={`text-sm sm:text-base leading-relaxed mb-8 ${
                        isDarkMode ? "text-gray-300" : "text-slate-600"
                      }`}
                    >
                      Tarjetas de video RTX, procesadores AMD Ryzen/Intel, laptops gamer y ensambles
                      a medida con Windows 11 activado. Atención directa en C.C. Compuplaza Tienda 204 y
                      delivery express en Arequipa.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => handleNavigate("catalog")}
                        className="py-3 px-6 rounded-xl font-bold uppercase text-xs tracking-wider bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <span>Ver Catálogo Completo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsPCBuilderOpen(true)}
                        className={`py-3 px-5 rounded-xl font-semibold uppercase text-xs tracking-wider border transition-colors flex items-center gap-2 ${
                          isDarkMode
                            ? "border-gray-700 hover:border-white text-white bg-[#111620]"
                            : "border-slate-300 hover:border-slate-900 text-slate-900 bg-white shadow-xs"
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                        <span>Arma tu PC a Medida</span>
                      </button>
                    </div>
                  </div>

                  {/* Trust Footer inside Hero */}
                  <div className="relative z-10 pt-8 mt-8 border-t border-slate-200/80 dark:border-gray-800/80 grid grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <Truck className="w-4 h-4 text-amber-600 dark:text-[#FFDE17] flex-shrink-0" />
                      <span>Delivery Express Arequipa</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#FFDE17] flex-shrink-0" />
                      <span>Garantía Física de 1 a 3 Años</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <Cpu className="w-4 h-4 text-amber-600 dark:text-[#FFDE17] flex-shrink-0" />
                      <span>Ensamble & Pruebas en Tienda</span>
                    </div>
                  </div>
                </div>

                {/* Right Retail Highlights (visible on large screens to eliminate blank side spaces) */}
                <div className="hidden xl:flex xl:col-span-4 flex-col gap-5">
                  {/* Highlight Card 1: PC Configurator Promo */}
                  <div
                    className={`rounded-3xl p-6 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-[#FFDE17]">
                          Servicio Spartan
                        </span>
                        <Flame className="w-4 h-4 text-red-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase text-slate-950 dark:text-white leading-tight mb-2">
                        Configurador Interactivo de PC Gamer
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                        Elige placa, procesador, RAM y tarjeta gráfica con compatibilidad garantizada y cotización instantánea en Soles.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPCBuilderOpen(true)}
                      className="mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-[#18202F] dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-[#FFDE17] dark:hover:text-slate-950 transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Comenzar Configuración</span>
                    </button>
                  </div>

                  {/* Highlight Card 2: Tienda Física Compuplaza */}
                  <div
                    className={`rounded-3xl p-6 border flex-1 flex flex-col justify-between shadow-xs transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-400">
                          Tienda Física
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase text-slate-950 dark:text-white leading-tight mb-1">
                        C.C. Compuplaza Tienda 204
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                        Retira tu compra, asesórate con técnicos expertos y paga con 10% de reserva o tarjeta de crédito en tienda.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsLocationOpen(true)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 transition-all text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Ver Ubicación</span>
                      </button>
                      <button
                        onClick={() => setIsFaqOpen(true)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-300 dark:border-gray-700 hover:border-slate-900 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all text-center cursor-pointer"
                      >
                        Horarios & FAQ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Departamentos / Categorías: Clean Hardware Retail Tiles */}
            <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-[#FFDE17]">
                    Exploración Rápida
                  </span>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white mt-0.5">
                    Departamentos de Hardware
                  </h2>
                </div>
                <button
                  onClick={() => setIsMegaMenuOpen(true)}
                  className="text-xs text-amber-800 dark:text-[#FFDE17] hover:underline font-bold"
                >
                  Ver todas las categorías →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-8 gap-3 sm:gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all group ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] hover:-translate-y-0.5"
                        : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-sm hover:-translate-y-0.5"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 group-hover:scale-105 transition-transform ${
                        isDarkMode
                          ? "bg-black/40 text-[#FFDE17]"
                          : "bg-slate-100 text-slate-900 group-hover:bg-amber-100 group-hover:text-amber-900"
                      }`}
                    >
                      {renderCategoryIcon(cat.icon)}
                    </div>
                    <div className="font-bold text-xs leading-tight truncate text-slate-950 dark:text-white">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 font-medium">
                      {cat.count} unid.
                    </div>
                  </button>
                ))}
              </div>
            </section>

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
                      className={`group rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                        isDarkMode
                          ? "bg-[#111620] border-gray-800 hover:border-gray-700"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
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

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleSelectProduct(product)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1 ${
                              isDarkMode
                                ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                                : "border-slate-200 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Ficha</span>
                          </button>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                              isDarkMode
                                ? "bg-[#18202F] text-slate-100 hover:bg-[#FFDE17] hover:text-slate-950 border border-gray-700"
                                : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 border border-slate-900"
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>+ Carrito</span>
                          </button>
                        </div>
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

