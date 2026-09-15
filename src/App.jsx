import React, { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import MarqueeTicker from "./components/MarqueeTicker";
import CatalogView from "./components/CatalogView";
import ProductDetail from "./components/ProductDetail";
import MegaMenuDrawer from "./components/MegaMenuDrawer";
import CartDrawer from "./components/CartDrawer";
import PCBuilderModal from "./components/PCBuilderModal";
import FaqModal from "./components/FaqModal";
import ChatIABubble from "./components/ChatIABubble";
import Footer from "./components/Footer";
import { productsCatalog, categoriesTree, storeInfo } from "./data/storeData";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Cpu, ShoppingCart, Eye, Layers } from "./components/Icons";

export default function App() {
  // Navigation View State: 'home' | 'catalog' | 'product'
  const [view, setView] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(productsCatalog[0]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme State: Dark mode (default) vs Light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("spartan_theme");
    return saved !== null ? saved === "dark" : true;
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

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-[#07090D] text-gray-100" : "bg-[#F8F9FA] text-gray-900"
      }`}
    >
      {/* 1. Topbar */}
      <Topbar
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
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
            {/* Hero eSports Banner Spartan Games */}
            <section className="relative overflow-hidden pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div
                className={`relative rounded-3xl overflow-hidden border p-8 sm:p-12 lg:p-16 shadow-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-r from-black via-[#111620] to-black border-gray-800"
                    : "bg-gradient-to-r from-amber-100 via-white to-amber-50 border-amber-200"
                }`}
              >
                {/* Background Banner Artwork */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
                  <img
                    src="/assets/images/spartan_games_banner.jpg"
                    alt="Spartan Games Banner Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 bg-[#FFDE17] text-black">
                    <Sparkles className="w-3.5 h-3.5" />
                    Hardware eSports Arequipa
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-4">
                    POTENCIA SIN LÍMITES PARA TUS BATALLAS
                  </h1>

                  <p
                    className={`text-sm sm:text-base leading-relaxed mb-8 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Componentes de última generación, laptops de alto rendimiento y PCs gamer armadas
                    con test de estrés térmico y Windows 11 activado. Visítanos en C.C. Compuplaza
                    Tienda 204 o pide con delivery express en Arequipa.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleNavigate("catalog")}
                      className="py-3.5 px-8 rounded-2xl font-black uppercase text-xs tracking-wider bg-[#FFDE17] text-black hover:bg-yellow-400 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-yellow-500/20"
                    >
                      <span>Explorar Catálogo Completo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPCBuilderOpen(true)}
                      className={`py-3.5 px-6 rounded-2xl font-bold uppercase text-xs tracking-wider border transition-colors flex items-center gap-2 ${
                        isDarkMode
                          ? "border-gray-700 hover:border-white text-white bg-black/40"
                          : "border-gray-300 hover:border-black text-black bg-white"
                      }`}
                    >
                      <span>⚡ Configurar PC Gamer</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Categories Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FFDE17]" />
                  Departamentos Principales
                </h2>
                <button
                  onClick={() => setIsMegaMenuOpen(true)}
                  className="text-xs text-[#FFDE17] hover:underline font-bold"
                >
                  Ver todas las categorías →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {categoriesTree.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-center transition-all group ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17] hover:-translate-y-1"
                        : "bg-white border-gray-200 hover:border-amber-400 hover:-translate-y-1 shadow-sm"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/40 text-[#FFDE17] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-[11px] leading-tight truncate">{cat.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{cat.count} unid.</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Hero Product Highlight: Corsair Vengeance DDR5 */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FFDE17] tracking-widest">
                    Producto Destacado de la Semana
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    Ficha Técnica en Vivo
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("catalog")}
                  className="text-xs font-bold text-gray-400 hover:text-white"
                >
                  Ver más ofertas →
                </button>
              </div>

              <ProductDetail
                product={productsCatalog[0]}
                allProducts={productsCatalog}
                isDarkMode={isDarkMode}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                onSelectCategory={handleSelectCategory}
                onNavigate={handleNavigate}
              />
            </section>
          </main>
        )}

        {/* VIEW: CATALOG */}
        {view === "catalog" && (
          <CatalogView
            products={productsCatalog}
            categories={categoriesTree}
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

        {/* VIEW: PRODUCT DETAIL */}
        {view === "product" && (
          <div className="py-4">
            <ProductDetail
              product={selectedProduct}
              allProducts={productsCatalog}
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
        categories={categoriesTree}
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
      />

      <PCBuilderModal
        isOpen={isPCBuilderOpen}
        onClose={() => setIsPCBuilderOpen(false)}
        isDarkMode={isDarkMode}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Floating AI Assistant Chat */}
      <ChatIABubble isDarkMode={isDarkMode} />

      {/* 5. Footer */}
      <Footer isDarkMode={isDarkMode} onNavigate={handleNavigate} />
    </div>
  );
}
