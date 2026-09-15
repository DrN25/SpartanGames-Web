import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import MegaMenuDrawer from './components/MegaMenuDrawer';
import MarqueeTicker from './components/MarqueeTicker';
import ProductDetail from './components/ProductDetail';
import RelatedProducts from './components/RelatedProducts';
import CartDrawer from './components/CartDrawer';
import PCBuilderModal from './components/PCBuilderModal';
import FaqModal from './components/FaqModal';
import ChatIABubble from './components/ChatIABubble';
import Footer from './components/Footer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPCBuilderOpen, setIsPCBuilderOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  
  // Cart state management
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });

    // Show quick alert toast
    setToastMessage(`¡${product.name} agregado al carrito!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-spartan-canvas text-slate-100 flex flex-col selection:bg-spartan-gold selection:text-black">
      
      {/* 1. Topbar */}
      <Topbar 
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* 2. Sticky Navbar */}
      <Navbar 
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
      />

      {/* 3. Marquee Announcement Ticker */}
      <MarqueeTicker />

      {/* 4. Megamenu Drawer (Falabella Style) */}
      <MegaMenuDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={(catId) => {
          console.log('Selected Category:', catId);
          setIsDrawerOpen(false);
        }}
      />

      {/* 5. Main Hero Product Ficha */}
      <main className="flex-1">
        <ProductDetail 
          onAddToCart={handleAddToCart}
        />

        {/* 6. Related Products Section */}
        <RelatedProducts 
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Slide-over Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />

      {/* 9. Interactive PC Builder Wizard */}
      <PCBuilderModal 
        isOpen={isPCBuilderOpen}
        onClose={() => setIsPCBuilderOpen(false)}
      />

      {/* 10. Help & FAQs Modal */}
      <FaqModal 
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

      {/* 11. Virtual AI Chat Assistant & Floating Actions */}
      <ChatIABubble />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-spartan-gold text-black px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
