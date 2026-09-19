import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
// Layout Components
import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MegaMenuDrawer from "./components/layout/MegaMenuDrawer";

// Modals
import CartDrawer from "./components/modals/CartDrawer";
import PCBuilderModal from "./components/modals/PCBuilderModal";
import FaqModal from "./components/modals/FaqModal";
import LocationModal from "./components/modals/LocationModal";

// Feedback Components
import ChatIABubble from "./components/feedback/ChatIABubble";
import PriceUpdateToast from "./components/feedback/PriceUpdateToast";

// Common Components
import MarqueeTicker from "./components/common/MarqueeTicker";

// Pages
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";

// Services
import {
  fetchLiveCatalog,
  getCachedCatalog,
  getCachedCategories,
  getCachedConfig,
  getCachedBanners,
  getCachedReviews,
  getCachedFaqs,
  countCategories,
  detectPriceChanges,
  slugify
} from "./services/catalogService";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Live Products, Categories, and Store Settings synced with Google Sheets tabs
  const [products, setProducts] = useState(() => getCachedCatalog());
  const [categories, setCategories] = useState(() => countCategories(getCachedCategories(), getCachedCatalog()));
  const [storeInfo, setStoreInfo] = useState(() => getCachedConfig());
  const [banners, setBanners] = useState(() => getCachedBanners());
  const [reviews, setReviews] = useState(() => getCachedReviews());
  const [faqs, setFaqs] = useState(() => getCachedFaqs());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");

  useEffect(() => {
    if (storeInfo?.name) {
      const citySuffix = storeInfo.city ? ` en ${storeInfo.city}` : "";
      document.title = `${storeInfo.name.toUpperCase()} | Tienda Oficial${citySuffix}`;
    }
  }, [storeInfo?.name, storeInfo?.city]);

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
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (e) {
      console.warn("Live sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // State for live price/inventory update toast notification
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const handleApplyPendingUpdate = () => {
    if (!pendingUpdate?.freshData) return;
    const { freshData } = pendingUpdate;
    if (freshData.products && freshData.products.length > 0) {
      setProducts(freshData.products);
      setSelectedProduct((prev) => {
        if (!prev) return freshData.products[0];
        const match = freshData.products.find((p) => p.id === prev.id);
        return match || freshData.products[0];
      });
    }
    if (freshData.categories && freshData.categories.length > 0) {
      setCategories(freshData.categories);
    }
    if (freshData.storeInfo) {
      setStoreInfo(freshData.storeInfo);
    }
    if (freshData.banners && freshData.banners.length > 0) {
      setBanners(freshData.banners);
    }
    if (freshData.reviews && freshData.reviews.length > 0) {
      setReviews(freshData.reviews);
    }
    if (freshData.faqs && freshData.faqs.length > 0) {
      setFaqs(freshData.faqs);
    }
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setPendingUpdate(null);
  };

  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    // Initial fetch on mount (run ONLY once)
    handleSyncCatalog(false);

    // Check periodically for price updates without blocking the customer
    const interval = setInterval(async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const fresh = await fetchLiveCatalog(true);
        if (fresh?.products?.length > 0 && productsRef.current?.length > 0) {
          const diffs = detectPriceChanges(productsRef.current, fresh.products);
          if (diffs.length > 0) {
            setPendingUpdate({ freshData: fresh, changes: diffs });
          }
        }
      } catch (err) {
        // Silent error
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
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

  const currentView = location.pathname.startsWith("/catalog")
    ? "catalog"
    : location.pathname.startsWith("/product")
    ? "product"
    : "home";

  // Navigation handlers
  const handleNavigate = (target) => {
    if (target === "home" || target === "/") {
      navigate("/");
    } else if (target === "catalog") {
      navigate("/catalog");
    } else if (typeof target === "string" && target.startsWith("/")) {
      navigate(target);
    } else {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    const slug = product.slug || slugify(product.name || "");
    const targetUrl = slug ? `/product/${product.id}-${slug}` : `/product/${product.id}`;
    navigate(targetUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      navigate(`/catalog?category=${encodeURIComponent(catId)}`);
    } else {
      navigate("/catalog");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-200 ${
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
        currentView={currentView}
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
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                categories={categories}
                banners={banners}
                reviews={reviews}
                isDarkMode={isDarkMode}
                storeInfo={storeInfo}
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
                onSelectCategory={handleSelectCategory}
                onAddToCart={handleAddToCart}
                onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
                onOpenLocation={() => setIsLocationOpen(true)}
                onOpenFaq={() => setIsFaqOpen(true)}
                onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
                onSearchChange={setSearchQuery}
              />
            }
          />

          <Route
            path="/catalog"
            element={
              <CatalogPage
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
            }
          />

          <Route
            path="/product/:idOrSlug"
            element={
              <div className="py-6">
                <ProductDetailPage
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
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Drawers & Modals */}
      <MegaMenuDrawer
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        categories={categories}
        isDarkMode={isDarkMode}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
        storeInfo={storeInfo}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isDarkMode={isDarkMode}
        storeInfo={storeInfo}
        onSelectProduct={handleSelectProduct}
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
        faqs={faqs}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        isDarkMode={isDarkMode}
        storeInfo={storeInfo}
      />

      {/* Floating Live Price / Inventory Update Toast */}
      <PriceUpdateToast
        isOpen={Boolean(pendingUpdate)}
        changedCount={pendingUpdate?.changes?.length || 0}
        onApply={handleApplyPendingUpdate}
        onDismiss={() => setPendingUpdate(null)}
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
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
        onAddBatchToCart={handleAddBatchToCart}
        onNavigate={handleNavigate}
        isAnyModalOpen={isCartOpen || isLocationOpen || isPCBuilderOpen || isFaqOpen || isMegaMenuOpen}
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
