import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import {
  CheckCircle2,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Cpu,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Star,
  WhatsAppIcon
} from "../components/common/Icons";
import { useModalTransition } from "../hooks/useModalTransition";
import { useParams, useNavigate } from "react-router-dom";
import { slugify } from "../services/catalogService";

export default function ProductDetailPage({
  product: initialProduct,
  allProducts = [],
  isDarkMode,
  onAddToCart,
  onSelectProduct,
  onSelectCategory,
  onNavigate,
  storeInfo
}) {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  // ponytail: resolve product by ID, Slug, or ID-prefix (resilient to renaming in Google Sheets)
  const product = React.useMemo(() => {
    if (!idOrSlug) return initialProduct;
    if (!allProducts || allProducts.length === 0) return initialProduct;

    // 1. Direct ID match
    const byId = allProducts.find((p) => String(p.id) === idOrSlug);
    if (byId) return byId;

    // 2. Direct Slug match
    const bySlug = allProducts.find((p) => p.slug === idOrSlug);
    if (bySlug) return bySlug;

    // 3. ID prefix match (e.g. "115-corsair-vengeance-rgb" -> "115")
    const prefixId = idOrSlug.split("-")[0];
    const byPrefix = allProducts.find((p) => String(p.id) === prefixId);
    if (byPrefix) return byPrefix;

    return initialProduct || null;
  }, [idOrSlug, initialProduct, allProducts]);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showStockModal, setShowStockModal] = useState(false);
  const { shouldRender: shouldRenderStockModal, isClosing: isClosingStockModal } = useModalTransition(showStockModal, 220);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.image].filter(Boolean);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsLightboxOpen(false);
        if (e.key === "ArrowLeft" && images.length > 1) {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        }
        if (e.key === "ArrowRight" && images.length > 1) {
          setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isLightboxOpen, images.length]);

  if (!product) {
    return (
      <div className="max-w-[1720px] mx-auto px-4 py-16 text-center">
        <div className={`p-12 rounded-3xl border max-w-lg mx-auto ${
          isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
            !
          </div>
          <h2 className="text-xl font-black uppercase mb-2 text-slate-900 dark:text-white">
            Producto no encontrado
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
            El componente que buscas ya no está disponible o el enlace ha cambiado.
          </p>
          <button
            onClick={() => onNavigate ? onNavigate("catalog") : navigate("/catalog")}
            className="px-6 py-2.5 rounded-xl bg-[#FFDE17] text-slate-950 font-bold uppercase text-xs tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleAddToCartClick = () => {
    setShowStockModal(true);
  };

  const confirmAddToCart = () => {
    onAddToCart(product, quantity);
    setShowStockModal(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const savings = product.oldPrice ? (product.oldPrice - product.price).toFixed(2) : 0;

  const phoneMain = storeInfo?.whatsappMain || "51912930004";
  const whatsappMsg = `Hola Spartan Games Arequipa, deseo consultar stock del producto: *${product.name}* (SKU: ${product.sku}) por S/. ${product.price.toFixed(2)}`;
  const whatsappUrl = `https://wa.me/${phoneMain}?text=${encodeURIComponent(whatsappMsg)}`;

  const relatedProducts = allProducts
    ? allProducts
        .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
        .slice(0, 4)
    : [];

  const breadcrumbsList = [
    { label: "Catálogo", action: () => onNavigate("catalog") },
    {
      label: product.category,
      action: () => {
        onSelectCategory(product.categoryId);
        onNavigate("catalog");
      }
    },
    { label: product.name }
  ];

  return (
    <div
      className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1720px] mx-auto transition-colors ${
        isDarkMode ? "text-gray-100" : "text-slate-900"
      }`}
    >
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbsList} isDarkMode={isDarkMode} onNavigate={onNavigate} />
      </div>

      {/* Main Product Hero Layout */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 lg:p-10 mb-12 shadow-xs ${
          isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16">
          {/* Columna Izquierda: Galería */}
          <div className="lg:col-span-6 2xl:col-span-5 flex flex-col items-center">
            {/* Stage */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className={`group relative w-full aspect-square rounded-2xl p-6 sm:p-8 flex items-center justify-center border overflow-hidden cursor-zoom-in transition-all ${
                isDarkMode ? "bg-black/50 border-gray-800" : "bg-slate-50/70 border-slate-200"
              }`}
              title="Haz clic para ver en pantalla completa"
            >
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-950 text-[#FFDE17] shadow-xs">
                  {product.brand}
                </span>
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF334B] text-white shadow-xs">
                    -{discount}% DESCUENTO
                  </span>
                )}
              </div>

              {/* Botón Ampliar / Pantalla Completa (reemplaza ID técnico) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white dark:bg-black/70 dark:hover:bg-black text-xs font-bold flex items-center gap-1.5 border border-white/15 backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95"
                aria-label="Ver en pantalla completa"
                title="Ver en pantalla completa"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FFDE17]" />
                <span className="hidden sm:inline">Ampliar</span>
              </button>

              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                }}
              />

              {/* Scarcity Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    product.stock <= 4
                      ? isDarkMode
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                      : isDarkMode
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          product.stock <= 4 ? "bg-red-400" : "bg-emerald-400"
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          product.stock <= 4 ? "bg-red-500" : "bg-emerald-500"
                        }`}
                      ></span>
                    </span>
                    ¡Solo quedan {product.stock} unidades en Compuplaza Arequipa!
                  </span>
                  <span className="text-[10px] uppercase font-mono opacity-80">Stock Físico</span>
                </div>
              </div>
            </div>

            {/* Miniaturas dinámicas (solo si hay más de 1 imagen) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl p-2 border flex items-center justify-center flex-shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/20"
                        : isDarkMode
                        ? "border-gray-800 bg-black/20 hover:border-gray-600"
                        : "border-slate-200 bg-slate-50 hover:border-slate-400"
                    }`}
                    aria-label={`Vista miniatura ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="max-h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Comercial */}
          <div className="lg:col-span-6 2xl:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  onClick={() => {
                    onSelectCategory(product.categoryId);
                    onNavigate("catalog");
                  }}
                  className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 hover:text-amber-800 dark:hover:text-[#FFDE17] transition-colors"
                >
                  {product.category}
                </button>
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1 text-slate-900 dark:text-white">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400">({product.reviewsCount} opiniones)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400 font-mono mb-4">
                <span>
                  SKU: <strong className="text-slate-800 dark:text-gray-200">{product.sku}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {product.stock > 0 ? "Stock Inmediato en Arequipa" : "A Pedido"}
                </span>
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.specs?.map((spec, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium ${
                      isDarkMode
                        ? "bg-[#18202F] text-gray-200 border border-gray-700"
                        : "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <p
                className={`text-sm leading-relaxed mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}
              >
                {product.summary}
              </p>

              {/* Price Tag Box */}
              <div
                className={`p-4 rounded-2xl border mb-6 ${
                  isDarkMode
                    ? "bg-black/40 border-gray-800"
                    : "bg-gradient-to-r from-amber-50/70 to-slate-50 border-amber-200"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#FF334B]">
                    S/. {product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm sm:text-base line-through text-slate-400 dark:text-gray-500">
                      S/. {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Ahorras S/. {savings}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-1.5 flex items-center gap-2 flex-wrap">
                  <span>Precios incluyen I.G.V.</span>
                  <span>•</span>
                  <span>Boleta o Factura Electrónica</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    10% Pago por Reserva Disponible
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Retail Action Buttons */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center border rounded-xl p-1 ${
                      isDarkMode ? "bg-black/50 border-gray-700" : "bg-white border-slate-300"
                    }`}
                  >
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartClick}
                    className="flex-1 py-3.5 px-6 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white dark:bg-[#FFDE17] dark:text-slate-950 dark:hover:bg-yellow-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar al Carrito (S/. {(product.price * quantity).toFixed(2)})</span>
                  </button>
                </div>

                {addedAnimation && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Producto agregado a tu carrito!
                  </div>
                )}
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs tracking-wide border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4" colored={false} />
                <span>Consultar Disponibilidad en Tienda por WhatsApp</span>
              </a>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-gray-800 text-center">
              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-black/20">
                <Truck className="w-5 h-5 mx-auto text-amber-600 dark:text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">Delivery Arequipa</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400">Despacho express</div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-black/20">
                <ShieldCheck className="w-5 h-5 mx-auto text-amber-600 dark:text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">Garantía Directa</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400">1 a 3 años física</div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-black/20">
                <Cpu className="w-5 h-5 mx-auto text-amber-600 dark:text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">100% Sellado</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400">Nuevo de fábrica</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div
        className={`rounded-3xl border overflow-hidden mb-16 shadow-xs ${
          isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200"
        }`}
      >
        <div
          className={`flex border-b overflow-x-auto ${
            isDarkMode ? "border-gray-800 bg-black/40" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-6 font-bold uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "description"
                ? "border-amber-500 text-amber-950 bg-amber-50/80 font-black dark:border-[#FFDE17] dark:text-[#FFDE17] dark:bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-950"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Descripción del Producto</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`py-4 px-6 font-bold uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-amber-500 text-amber-950 bg-amber-50/80 font-black dark:border-[#FFDE17] dark:text-[#FFDE17] dark:bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-950"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Ficha Técnica Detallada</span>
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`py-4 px-6 font-bold uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "warranty"
                ? "border-amber-500 text-amber-950 bg-amber-50/80 font-black dark:border-[#FFDE17] dark:text-[#FFDE17] dark:bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-slate-600 hover:text-slate-950"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Garantía y Envíos en Arequipa</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === "description" && (
            <div className="space-y-4 text-sm leading-relaxed">
              <h3 className="text-base font-black uppercase text-slate-950 dark:text-[#FFDE17]">
                Arquitectura y Rendimiento
              </h3>
              <p className={isDarkMode ? "text-gray-300" : "text-slate-700"}>
                {product.description}
              </p>
              <div
                className={`p-4 rounded-xl border mt-4 ${
                  isDarkMode ? "bg-black/30 border-gray-800" : "bg-amber-50/50 border-amber-200"
                }`}
              >
                <h4 className="font-bold text-xs uppercase text-amber-800 dark:text-amber-400 mb-1">
                  Nota del Equipo Técnico Spartan Games:
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Si deseas ensamblar este componente en tu equipo actual o armar una PC desde cero,
                  nuestro equipo en Compuplaza realiza el testeo de compatibilidad y actualización de
                  BIOS sin costo adicional.
                </p>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <h3 className="text-base font-black uppercase mb-4 text-slate-950 dark:text-[#FFDE17]">
                Especificaciones de Hardware
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {product.detailedSpecs?.map((spec, i) => (
                      <tr
                        key={i}
                        className={`border-b border-slate-200 dark:border-gray-800/60 ${
                          i % 2 === 0
                            ? isDarkMode
                              ? "bg-black/20"
                              : "bg-slate-50/60"
                            : isDarkMode
                            ? "bg-transparent"
                            : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-slate-600 dark:text-gray-400 w-1/3 border-r border-slate-200 dark:border-gray-800/40">
                          {spec.label}
                        </td>
                        <td
                          className={`py-3 px-4 font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-slate-900"
                          }`}
                        >
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "warranty" && (
            <div className="space-y-4 text-sm">
              <h3 className="text-base font-black uppercase text-slate-950 dark:text-[#FFDE17]">
                Políticas de Entrega y Garantía Local
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-5 rounded-2xl border ${
                    isDarkMode ? "bg-black/30 border-gray-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h4 className="font-bold text-xs uppercase mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Truck className="w-4 h-4" />
                    Delivery en Arequipa y Despacho a Provincias
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-gray-400 space-y-1.5 list-disc pl-4">
                    <li>Entrega inmediata en Cercado, Yanahuara, Cayma, JLByR y Cerro Colorado.</li>
                    <li>
                      Equipos completos se entregan con Windows 11 y programas esenciales activados.
                    </li>
                    <li>
                      Envíos a Cusco, Puno, Tacna, Moquegua y Lima por Shalom y Olva Courier.
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-5 rounded-2xl border ${
                    isDarkMode ? "bg-black/30 border-gray-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h4 className="font-bold text-xs uppercase mb-2 flex items-center gap-2 text-amber-800 dark:text-[#FFDE17]">
                    <ShieldCheck className="w-4 h-4" />
                    Garantía y Soporte Postventa
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-gray-400 space-y-1.5 list-disc pl-4">
                    <li>
                      Garantía física directa de 12 a 36 meses con boleta o factura con RUC.
                    </li>
                    <li>
                      Soporte técnico y diagnóstico en tienda física {storeInfo?.address || "Calle Octavio Muñoz Najar 223 Int 211 Compuplaza"}.
                    </li>
                    <li>
                      Cambio inmediato ante fallas de fábrica durante los primeros 7 días.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                Productos Relacionados
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                Más opciones en {product.category} para complementar tu configuración
              </p>
            </div>
            <button
              onClick={() => {
                onSelectCategory(product.categoryId);
                onNavigate("catalog");
              }}
              className="text-xs font-bold text-amber-700 dark:text-[#FFDE17] hover:underline flex items-center gap-1"
            >
              <span>Ver todo en {product.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17]/60"
                    : "bg-white border-slate-200 hover:border-amber-400 shadow-xs"
                }`}
              >
                <div
                  className={`aspect-square rounded-xl p-3 mb-3 flex items-center justify-center ${
                    isDarkMode ? "bg-black/40" : "bg-slate-50"
                  }`}
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="max-h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                    }}
                  />
                </div>
                <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-gray-400">
                  {rel.brand}
                </div>
                <h3 className="font-bold text-xs line-clamp-2 text-slate-900 dark:text-white hover:text-amber-800 dark:hover:text-[#FFDE17] transition-colors mt-0.5">
                  {rel.name}
                </h3>
                <div className="text-sm font-black text-[#FF334B] mt-2">
                  S/. {rel.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Stock */}
      {shouldRenderStockModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ${
            isClosingStockModal ? "animate-spartan-fade-out" : "animate-spartan-fade-in"
          }`}
          onClick={() => setShowStockModal(false)}
        >
          <div
            className={`w-full max-w-md rounded-3xl border-0 p-6 shadow-2xl shadow-black/90 relative ${
              isClosingStockModal ? "animate-spartan-modal-exit" : "animate-spartan-modal"
            } ${
              isDarkMode
                ? "bg-[#111620] text-white"
                : "bg-white text-slate-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-[#FFDE17] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black uppercase text-center mb-2">
              Confirmación de Stock en Tienda
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 text-center leading-relaxed mb-6">
              Debido a la alta rotación de hardware en Compuplaza Arequipa, te sugerimos confirmar
              disponibilidad con nuestros asesores por WhatsApp o agregarlo al carrito para reservar
              tu unidad.
            </p>

            <div
              className={`p-3 rounded-xl border mb-6 flex items-center gap-3 ${
                isDarkMode ? "bg-black/50 border-gray-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{product.name}</div>
                <div className="text-xs text-[#FF334B] font-black">
                  S/. {(product.price * quantity).toFixed(2)} ({quantity}{" "}
                  {quantity === 1 ? "unidad" : "unidades"})
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={confirmAddToCart}
                className="w-full py-3 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-[#FFDE17] dark:text-slate-950 dark:hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Confirmar y Añadir al Carrito</span>
              </button>

              <button
                onClick={() => setShowStockModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Seguir Explorando
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Lightbox / Modal Pantalla Completa */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Barra Superior */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white/90 py-2 px-3 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase bg-[#FFDE17] text-slate-950 shrink-0">
                {product.brand}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-gray-200 truncate">
                {product.name}
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              {images.length > 1 && (
                <span className="text-xs font-mono font-bold text-gray-300 bg-white/10 px-2.5 py-1 rounded-full">
                  {activeImageIndex + 1} / {images.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                aria-label="Cerrar pantalla completa (Esc)"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Cerrar (Esc)</span>
              </button>
            </div>
          </div>

          {/* Viewport Principal de la Imagen */}
          <div
            className="relative w-full max-w-6xl flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[activeImageIndex] || product.image}
              alt={`${product.name} - Vista ampliada ${activeImageIndex + 1}`}
              className="max-h-[76vh] max-w-full object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 select-none"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
              }}
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Carrusel de Miniaturas Inferior */}
          {images.length > 1 && (
            <div className="w-full max-w-2xl flex items-center justify-center gap-2.5 overflow-x-auto py-2 px-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 border-2 transition-all flex items-center justify-center shrink-0 bg-black/40 overflow-hidden cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[#FFDE17] ring-2 ring-[#FFDE17]/60 scale-105"
                      : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
</div>
  );
}
