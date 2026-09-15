import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, ShoppingCart, Share2, Maximize2, Minus, Plus, Tag, ShieldCheck, Truck, Cpu, AlertTriangle } from 'lucide-react';
import { FacebookIcon, TwitterIcon } from './SocialIcons';
import { MAIN_PRODUCT, STORE_INFO } from '../data/storeData';

export default function ProductDetail({ onAddToCart }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const product = MAIN_PRODUCT;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  // WhatsApp Deep-link message formatted dynamically
  const whatsappMsg = encodeURIComponent(
    `Hola Spartan Games, me interesa consultar la disponibilidad del producto: ${product.name} (Precio: S/. ${product.price.toFixed(2)}). ¿Tienen stock en tienda física de Compuplaza Arequipa para entrega o delivery?`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=51${STORE_INFO.phones[0]}&text=${whatsappMsg}`;

  const handleAddCartClick = () => {
    // Interceptor modal mimicking reference UX discovery
    setShowStockModal(true);
  };

  const confirmAddToCart = () => {
    setShowStockModal(false);
    onAddToCart(product, quantity);
  };

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
        <a href="#" className="hover:text-spartan-gold transition-colors">Inicio</a>
        <span>/</span>
        <a href="#" className="hover:text-spartan-gold transition-colors">{product.category}</a>
        <span>/</span>
        <span className="text-white truncate font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnail Strip */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImg(index)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/60 border-2 transition-all p-1.5 cursor-pointer shrink-0 ${
                  selectedImg === index 
                    ? 'border-spartan-gold shadow-md shadow-spartan-gold/20' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Showcase Image */}
          <div className="flex-1 relative bg-black/80 rounded-2xl border border-white/10 p-6 flex items-center justify-center min-h-[360px] sm:min-h-[460px] group overflow-hidden">
            <img 
              src={product.images[selectedImg]} 
              alt={product.name}
              className="max-h-[380px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Discount Badge on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-spartan-red text-white text-xs font-black px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                <Tag className="w-3 h-3" /> -{product.discount}%
              </span>
              {product.isPromo && (
                <span className="bg-spartan-gold text-black text-[11px] font-black px-2 py-0.5 rounded-md">
                  EN PROMOCIÓN
                </span>
              )}
            </div>

            {/* Lightbox Zoom Trigger */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-spartan-gold hover:text-black text-white border border-white/15 transition-colors cursor-pointer"
              title="Ampliar imagen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Product Info & Commerce Actions */}
        <div className="lg:col-span-5 flex flex-col">
          
          {/* Brand and Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="text-spartan-gold font-semibold uppercase tracking-wider">{product.brand}</span>
            <span className="font-mono">ID: #{product.id}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-display font-black text-white leading-tight mb-3">
            {product.name}
          </h1>

          {/* Technical Specs Pills (Inspiradas en los anuncios Spartan) */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.specs.map((spec, i) => (
              <span 
                key={i} 
                className="bg-spartan-card border border-white/10 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-md"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-xl bg-[#101017] border border-white/10 mb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-spartan-red">
                S/. {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                S/. {product.originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                Ahorras S/. {(product.originalPrice - product.price).toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Precios incluyen IGV. Comprobante electrónico (Boleta o Factura).</p>
          </div>

          {/* Stock Scarcity Alert */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Disponibilidad:</span>
            <span className="text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              ¡Solo quedan {product.stock} unidades en tienda!
            </span>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-white/15 rounded-xl bg-spartan-card px-2 py-1">
              <button 
                onClick={handleDecrease}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-white text-sm">
                {quantity}
              </span>
              <button 
                onClick={handleIncrease}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddCartClick}
              className="flex-1 py-3 px-6 rounded-xl bg-spartan-gold hover:bg-spartan-goldHover text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-spartan-gold/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              AGREGAR AL CARRITO
            </button>
          </div>

          {/* Direct WhatsApp Consultation Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 rounded-xl bg-spartan-green hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all mb-6"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            CONSULTAR DISPONIBILIDAD POR WHATSAPP
          </a>

          {/* Store Guarantee and Delivery Badges */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs text-slate-300 mb-5">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-spartan-gold shrink-0" />
              <span>Delivery en Arequipa y Envíos a Provincias</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantía escrita de 1 año con tienda física</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Compartir:</span>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500 hover:text-white transition-colors"
            >
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}`} 
              target="_blank" 
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Interceptor Stock Alert Modal (Reverse Engineering Discovery) */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#12121a] border border-white/15 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-spartan-gold/20 text-spartan-gold flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Consultar Disponibilidad</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              El stock en tienda física de Arequipa tiene alta rotación diaria. Te recomendamos confirmar stock por WhatsApp antes de pagar. ¿Deseas agregar el producto al carrito de todas formas?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 py-2.5 px-4 rounded-xl bg-spartan-gold hover:bg-spartan-goldHover text-black text-xs font-black cursor-pointer"
              >
                Sí, agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img 
            src={product.images[selectedImg]} 
            alt={product.name} 
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </section>
  );
}


