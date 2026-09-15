import React, { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import {
  CheckCircle2,
  ShoppingCart,
  Share2,
  Maximize2,
  Minus,
  Plus,
  Tag,
  ShieldCheck,
  Truck,
  Cpu,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
  Eye
} from "./Icons";
import { WhatsAppIcon, FacebookIcon, TwitterIcon } from "./Icons";

export default function ProductDetail({
  product,
  allProducts,
  isDarkMode,
  onAddToCart,
  onSelectProduct,
  onSelectCategory,
  onNavigate
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'specs' | 'warranty'
  const [showStockModal, setShowStockModal] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const images = [
    product.image,
    "/assets/images/spartan_games_anuncio_2.jpg",
    "/assets/images/spartan_games_banner.jpg"
  ];

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

  const whatsappMsg = `Hola Spartan Games Arequipa, deseo consultar disponibilidad y precio del producto: *${product.name}* (SKU: ${product.sku}) por S/. ${product.price.toFixed(2)}`;
  const whatsappUrl = `https://wa.me/51912930004?text=${encodeURIComponent(whatsappMsg)}`;

  // Related products
  const relatedProducts = allProducts
    ? allProducts.filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4)
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
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors ${
      isDarkMode ? "text-gray-100" : "text-gray-900"
    }`}>
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbsList} isDarkMode={isDarkMode} onNavigate={onNavigate} />
      </div>

      {/* Main Product Hero Layout (Above the Fold) */}
      <div className={`rounded-3xl border p-6 sm:p-8 lg:p-10 mb-12 shadow-xl ${
        isDarkMode
          ? "bg-[#111620] border-gray-800"
          : "bg-white border-gray-200"
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Columna Izquierda: Galería Multimedia */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Stage */}
            <div className={`relative w-full aspect-square rounded-2xl p-6 sm:p-8 flex items-center justify-center border overflow-hidden ${
              isDarkMode ? "bg-black/50 border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              {/* Badges Flotantes */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black text-[#FFDE17] border border-[#FFDE17]/40 shadow-lg">
                  {product.brand}
                </span>
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF334B] text-white shadow-lg">
                    -{discount}% DESCUENTO
                  </span>
                )}
              </div>

              {/* SKU & ID */}
              <div className="absolute top-4 right-4 z-10 text-[11px] font-mono font-bold text-gray-400 bg-black/60 px-2.5 py-1 rounded-lg">
                ID #{product.id}
              </div>

              {/* Imagen Principal con Zoom */}
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transform hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />

              {/* Scarcity Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  product.stock <= 4
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        product.stock <= 4 ? "bg-red-400" : "bg-emerald-400"
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        product.stock <= 4 ? "bg-red-500" : "bg-emerald-500"
                      }`}></span>
                    </span>
                    ¡Solo quedan {product.stock} unidades disponibles en tienda!
                  </span>
                  <span className="text-[10px] uppercase font-mono opacity-80">Arequipa Stock</span>
                </div>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl p-2 border flex items-center justify-center flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#FFDE17] ring-2 ring-[#FFDE17]/30 bg-black/30"
                      : isDarkMode
                      ? "border-gray-800 bg-black/20 hover:border-gray-600"
                      : "border-gray-200 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="max-h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Datos Comerciales y Acciones */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  onClick={() => {
                    onSelectCategory(product.categoryId);
                    onNavigate("catalog");
                  }}
                  className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#FFDE17] transition-colors"
                >
                  {product.category}
                </button>
                <div className="flex items-center gap-1 text-[#FFDE17] text-xs font-bold">
                  <span>★ {product.rating}</span>
                  <span className="text-gray-500 font-normal">({product.reviewsCount} valoraciones)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Short Summary */}
              <p className={`text-sm mb-4 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {product.summary}
              </p>

              {/* Specs Pills (Hard Evidence inspo-mcp) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.specs.map((spec, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-lg font-mono font-semibold border ${
                      isDarkMode
                        ? "bg-[#18202F] border-gray-700 text-gray-200"
                        : "bg-gray-100 border-gray-300 text-gray-800"
                    }`}
                  >
                    [ {spec} ]
                  </span>
                ))}
              </div>

              {/* Price Box */}
              <div className={`p-4 rounded-2xl border mb-6 ${
                isDarkMode ? "bg-black/40 border-gray-800" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#FF334B] tracking-tight">
                    S/. {product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base line-through text-gray-500 font-medium">
                      S/. {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded text-xs font-black uppercase bg-[#FF334B] text-white">
                      Ahorras S/. {savings}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                  <span>Precios incluyen I.G.V.</span>
                  <span>•</span>
                  <span>Boleta o Factura Electrónica</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">10% Pago por Reserva Disponible</span>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center border rounded-xl p-1 ${
                    isDarkMode ? "bg-black/50 border-gray-700" : "bg-white border-gray-300"
                  }`}>
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartClick}
                    className="flex-1 py-3 px-6 rounded-xl font-black uppercase text-sm tracking-wider bg-[#FFDE17] text-black hover:bg-yellow-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito (S/. {(product.price * quantity).toFixed(2)})</span>
                  </button>
                </div>

                {addedAnimation && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Producto agregado a tu carrito!
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Consultation Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl font-black uppercase text-xs tracking-wider border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-5 h-5" colored={false} />
                <span>Consultar Disponibilidad en Tienda por WhatsApp</span>
              </a>
            </div>

            {/* Quick Benefits Guarantee */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-800/80 text-center">
              <div className="p-2">
                <Truck className="w-5 h-5 mx-auto text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold">Delivery Arequipa</div>
                <div className="text-[10px] text-gray-400">Despacho express</div>
              </div>
              <div className="p-2">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold">Garantía Directa</div>
                <div className="text-[10px] text-gray-400">1 a 3 años física</div>
              </div>
              <div className="p-2">
                <Cpu className="w-5 h-5 mx-auto text-[#FFDE17] mb-1" />
                <div className="text-[11px] font-bold">100% Original</div>
                <div className="text-[10px] text-gray-400">Sellado de fábrica</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Descripción | Ficha Técnica | Garantía y Entregas */}
      <div className={`rounded-3xl border overflow-hidden mb-16 shadow-lg ${
        isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-gray-200"
      }`}>
        {/* Tab Headers */}
        <div className={`flex border-b overflow-x-auto ${
          isDarkMode ? "border-gray-800 bg-black/40" : "border-gray-200 bg-gray-50"
        }`}>
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-6 font-black uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "description"
                ? "border-[#FFDE17] text-[#FFDE17] bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Descripción del Producto</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`py-4 px-6 font-black uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "specs"
                ? "border-[#FFDE17] text-[#FFDE17] bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Ficha Técnica Detallada</span>
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`py-4 px-6 font-black uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "warranty"
                ? "border-[#FFDE17] text-[#FFDE17] bg-black/20"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-white"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Garantía y Envíos en Arequipa</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "description" && (
            <div className="prose prose-invert max-w-none text-sm space-y-4 leading-relaxed">
              <h3 className="text-lg font-black uppercase text-[#FFDE17]">
                Arquitectura y Rendimiento
              </h3>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {product.description}
              </p>
              <div className={`p-4 rounded-xl border mt-4 ${
                isDarkMode ? "bg-black/30 border-gray-800" : "bg-amber-50/50 border-amber-200"
              }`}>
                <h4 className="font-bold text-xs uppercase text-amber-500 mb-1">
                  Nota del Equipo Técnico Spartan Games:
                </h4>
                <p className="text-xs text-gray-400">
                  Si deseas ensamblar este componente en tu equipo actual o armar una PC desde cero, nuestro equipo en Compuplaza realiza el testeo de compatibilidad y actualización de BIOS sin costo adicional.
                </p>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <h3 className="text-lg font-black uppercase mb-4 text-[#FFDE17]">
                Especificaciones de Hardware
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {product.detailedSpecs?.map((spec, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-800/60 ${
                          i % 2 === 0
                            ? isDarkMode ? "bg-black/20" : "bg-gray-50"
                            : isDarkMode ? "bg-transparent" : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-gray-400 w-1/3 border-r border-gray-800/40">
                          {spec.label}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
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
              <h3 className="text-lg font-black uppercase text-[#FFDE17]">
                Políticas de Entrega y Garantía Local
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border ${
                  isDarkMode ? "bg-black/30 border-gray-800" : "bg-gray-50 border-gray-200"
                }`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-emerald-400">
                    <Truck className="w-4 h-4" />
                    Delivery en Arequipa y Despacho a Provincias
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                    <li>Entrega inmediata en Cercado, Yanahuara, Cayma, JLByR y Cerro Colorado.</li>
                    <li>Equipos completos se entregan con Windows 11 y programas esenciales activados.</li>
                    <li>Envíos a Cusco, Puno, Tacna, Moquegua y Lima por Shalom y Olva Courier.</li>
                  </ul>
                </div>

                <div className={`p-5 rounded-2xl border ${
                  isDarkMode ? "bg-black/30 border-gray-800" : "bg-gray-50 border-gray-200"
                }`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-[#FFDE17]">
                    <ShieldCheck className="w-4 h-4" />
                    Garantía Física en Compuplaza
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                    <li>{product.warranty}</li>
                    <li>Soporte técnico directo sin intermediarios ni trámites burocráticos.</li>
                    <li>Cambio inmediato en caso de fallas de fábrica dentro de los primeros 7 días.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                Productos Relacionados
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Más opciones en {product.category} para complementar tu configuración
              </p>
            </div>
            <button
              onClick={() => {
                onSelectCategory(product.categoryId);
                onNavigate("catalog");
              }}
              className="text-xs font-bold text-[#FFDE17] hover:underline flex items-center gap-1"
            >
              <span>Ver todo en {product.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17]/60"
                    : "bg-white border-gray-200 hover:border-amber-400 shadow-sm"
                }`}
              >
                <div className={`aspect-square rounded-xl p-3 mb-3 flex items-center justify-center ${
                  isDarkMode ? "bg-black/40" : "bg-gray-50"
                }`}>
                  <img src={rel.image} alt={rel.name} className="max-h-full object-contain" />
                </div>
                <div className="text-[10px] font-bold uppercase text-gray-400">{rel.brand}</div>
                <h3 className="font-bold text-xs line-clamp-2 hover:text-[#FFDE17] transition-colors mt-0.5">
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

      {/* Modal de Confirmación de Disponibilidad (Intercepción de Stock) */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl relative ${
            isDarkMode ? "bg-[#111620] border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-[#FFDE17] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black uppercase text-center mb-2">
              Confirmación de Stock en Tienda
            </h3>
            <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
              Debido a la alta demanda de hardware gaming en nuestra tienda física de Compuplaza Arequipa, te recomendamos confirmar el stock en tiempo real con nuestros asesores o agregar al carrito para reservar tu unidad.
            </p>

            <div className={`p-3 rounded-xl border mb-6 flex items-center gap-3 ${
              isDarkMode ? "bg-black/50 border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{product.name}</div>
                <div className="text-xs text-[#FF334B] font-black">
                  S/. {(product.price * quantity).toFixed(2)} ({quantity} {quantity === 1 ? "unidad" : "unidades"})
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={confirmAddToCart}
                className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Sí, Agregar al Carrito</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl font-bold uppercase text-xs border border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors flex items-center justify-center gap-2 text-center"
              >
                <WhatsAppIcon className="w-4 h-4" colored={false} />
                <span>Consultar por WhatsApp Primero</span>
              </a>

              <button
                onClick={() => setShowStockModal(false)}
                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white text-center transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
