import React, { useState, useMemo } from "react";
import Breadcrumbs from "./Breadcrumbs";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Check,
  X,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  Eye,
  ShoppingCart,
  Layers,
  Sparkles,
  Filter
} from "./Icons";

export default function CatalogView({
  products,
  categories,
  isDarkMode,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onAddToCart,
  onNavigate
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 8000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const availableBrands = useMemo(() => {
    const brandsMap = {};
    products.forEach((p) => {
      brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
    });
    return Object.entries(brandsMap).map(([brand, count]) => ({ brand, count }));
  }, [products]);

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleQuickPrice = (min, max) => {
    setPriceRange([min, max]);
  };

  const resetFilters = () => {
    onSelectCategory(null);
    onSearchChange("");
    setSelectedBrands([]);
    setPriceRange([0, 8000]);
    setOnlyInStock(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchQuery) ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 8000 ||
    onlyInStock;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory && p.categoryId !== selectedCategory && p.category !== selectedCategory) {
          return false;
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchSpecs = p.specs?.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchCategory && !matchSpecs) return false;
        }
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }
        if (onlyInStock && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "discount") {
          const discA = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
          const discB = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
          return discB - discA;
        }
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, selectedBrands, priceRange, onlyInStock, sortBy]);

  const currentCategoryObj = categories.find(
    (c) => c.id === selectedCategory || c.name === selectedCategory
  );

  const breadcrumbsList = [
    { label: "Catálogo de Hardware", action: () => resetFilters() }
  ];
  if (currentCategoryObj) {
    breadcrumbsList.push({ label: currentCategoryObj.name });
  }

  return (
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors ${
      isDarkMode ? "text-gray-100" : "text-gray-900"
    }`}>
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbsList} isDarkMode={isDarkMode} onNavigate={onNavigate} />
      </div>

      <div className={`p-6 sm:p-8 rounded-2xl mb-8 border relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-r from-[#111620] via-[#161D2A] to-[#111620] border-gray-800"
          : "bg-gradient-to-r from-white via-amber-50/40 to-white border-amber-200/60 shadow-sm"
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-[#FFDE17] text-black">
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo Oficial Spartan Games
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight">
              {currentCategoryObj ? currentCategoryObj.name : "Hardware & Laptops Gamer Arequipa"}
            </h1>
            <p className={`text-sm mt-1 max-w-2xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {currentCategoryObj
                ? `Explora nuestra selección en stock físico de ${currentCategoryObj.name.toLowerCase()} con garantía local de hasta 3 años en Compuplaza Arequipa.`
                : "Componentes originales, ensambles con Windows preinstalado y envíos express garantizados en Arequipa y el Sur del Perú."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-center border ${
              isDarkMode ? "bg-black/40 border-gray-800" : "bg-white border-gray-200 shadow-sm"
            }`}>
              <div className="text-2xl font-black text-[#FFDE17]">
                {filteredProducts.length}
              </div>
              <div className="text-[11px] uppercase font-bold text-gray-400">
                Productos
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-[#111620] border-gray-800/80" : "bg-white border-gray-200 shadow-sm"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b mb-5 border-gray-700/50">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FFDE17]" />
                Filtros Avanzados
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#FF334B] hover:underline font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Limpiar
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                Categorías de Hardware
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => onSelectCategory(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      !selectedCategory
                        ? "bg-[#FFDE17] text-black"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800/60"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>Todas las categorías</span>
                    <span className="text-[10px] opacity-75">{products.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => onSelectCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? "bg-[#FFDE17] text-black"
                            : isDarkMode
                            ? "text-gray-300 hover:bg-gray-800/60"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isSelected ? "bg-black text-[#FFDE17]" : isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-6 pt-5 border-t border-gray-700/40">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                Presupuesto (Soles S/.)
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                  isDarkMode ? "bg-black/50 border-gray-800 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-800"
                }`}>
                  S/. {priceRange[0]}
                </div>
                <span className="text-gray-500 font-bold">-</span>
                <div className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                  isDarkMode ? "bg-black/50 border-gray-800 text-gray-200" : "bg-gray-50 border-gray-300 text-gray-800"
                }`}>
                  S/. {priceRange[1]}
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="8000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#FFDE17] cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-1.5 mt-3">
                <button
                  onClick={() => handleQuickPrice(0, 500)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                    priceRange[1] === 500 ? "bg-[#FFDE17] text-black border-[#FFDE17]" : isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Hasta S/. 500
                </button>
                <button
                  onClick={() => handleQuickPrice(500, 1500)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                    priceRange[0] === 500 && priceRange[1] === 1500 ? "bg-[#FFDE17] text-black border-[#FFDE17]" : isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  S/. 500 - 1500
                </button>
                <button
                  onClick={() => handleQuickPrice(1500, 4000)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                    priceRange[0] === 1500 && priceRange[1] === 4000 ? "bg-[#FFDE17] text-black border-[#FFDE17]" : isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  S/. 1500 - 4000
                </button>
                <button
                  onClick={() => handleQuickPrice(4000, 8000)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                    priceRange[0] === 4000 && priceRange[1] === 8000 ? "bg-[#FFDE17] text-black border-[#FFDE17]" : isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Más de S/. 4000
                </button>
              </div>
            </div>

            <div className="mb-6 pt-5 border-t border-gray-700/40">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                Marcas Oficiales
              </h3>
              <div className="space-y-2">
                {availableBrands.map(({ brand, count }) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-[#FFDE17] border-[#FFDE17] text-black"
                              : isDarkMode
                              ? "border-gray-700 group-hover:border-gray-500"
                              : "border-gray-300 group-hover:border-gray-500"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? "font-bold text-[#FFDE17]" : ""}>
                          {brand}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-5 border-t border-gray-700/40">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-[#FFDE17] w-4 h-4 cursor-pointer"
                />
                <span className="font-bold">Solo con stock en tienda</span>
              </label>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-gray-200 shadow-sm"
          }`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar componente o modelo..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#FFDE17] ${
                  isDarkMode
                    ? "bg-black/40 border-gray-800 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                    isDarkMode
                      ? "bg-black/40 border-gray-800 text-gray-200"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="featured">Destacados / Popular</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="discount">Mayor Descuento %</option>
                  <option value="name">Alfabético (A - Z)</option>
                </select>
              </div>

              <div className={`flex items-center p-1 rounded-xl border ${
                isDarkMode ? "bg-black/30 border-gray-800" : "bg-gray-100 border-gray-300"
              }`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#FFDE17] text-black"
                      : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                  }`}
                  title="Vista Cuadrícula"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#FFDE17] text-black"
                      : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                  }`}
                  title="Vista Lista"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="text-gray-400 text-[11px] font-bold uppercase">Filtros activos:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFDE17]/20 border border-[#FFDE17]/50 text-[#FFDE17] font-bold">
                  Cat: {currentCategoryObj ? currentCategoryObj.name : selectedCategory}
                  <button onClick={() => onSelectCategory(null)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400 font-bold">
                  "{searchQuery}"
                  <button onClick={() => onSearchChange("")} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-400 font-bold"
                >
                  {brand}
                  <button onClick={() => toggleBrand(brand)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 8000) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold">
                  S/. {priceRange[0]} - S/. {priceRange[1]}
                  <button onClick={() => setPriceRange([0, 8000])} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-red-400 hover:underline font-bold ml-2"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border ${
              isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-gray-200"
            }`}>
              <div className="w-16 h-16 rounded-full bg-amber-400/10 text-[#FFDE17] flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black uppercase mb-2">
                No se encontraron productos con estos filtros
              </h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                Intenta ajustar los rangos de precio o buscar con un término más general.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#FFDE17] text-black font-black uppercase text-xs tracking-wider hover:bg-yellow-400 transition-colors"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17]/60 hover:shadow-xl hover:shadow-yellow-500/5"
                        : "bg-white border-gray-200 hover:border-amber-400 hover:shadow-xl shadow-sm"
                    }`}
                  >
                    <div>
                      <div className={`relative p-5 aspect-square flex items-center justify-center overflow-hidden ${
                        isDarkMode ? "bg-black/40" : "bg-gray-50"
                      }`}>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#FFDE17] border border-[#FFDE17]/30">
                            {product.brand}
                          </span>
                          {discount > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF334B] text-white shadow-md">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        <div className="absolute bottom-2.5 left-3 right-3">
                          {product.stock <= 4 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              ¡Últimas {product.stock} unidades!
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              En stock físico ({product.stock} unid.)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-[11px] font-bold uppercase text-gray-400 mb-1">
                          {product.category}
                        </div>
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-bold text-sm leading-snug line-clamp-2 hover:text-[#FFDE17] cursor-pointer transition-colors"
                          title={product.name}
                        >
                          {product.name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {product.specs.slice(0, 3).map((spec, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                                isDarkMode ? "bg-gray-800/80 text-gray-300" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`p-5 pt-3 border-t ${
                      isDarkMode ? "border-gray-800/80" : "border-gray-100"
                    }`}>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-black text-[#FF334B]">
                          S/. {product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs line-through text-gray-500">
                            S/. {product.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                            isDarkMode
                              ? "border-gray-700 hover:border-[#FFDE17] hover:text-[#FFDE17]"
                              : "border-gray-300 hover:border-black hover:text-black"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </button>

                        <button
                          onClick={() => onAddToCart(product)}
                          className="py-2 px-3 rounded-xl text-xs font-black uppercase bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
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
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-[#FFDE17]/60"
                        : "bg-white border-gray-200 hover:border-amber-400 shadow-sm"
                    }`}
                  >
                    <div className={`w-32 h-32 flex-shrink-0 rounded-xl p-3 flex items-center justify-center ${
                      isDarkMode ? "bg-black/40" : "bg-gray-50"
                    }`}>
                      <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black text-[#FFDE17]">
                          {product.brand}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">{product.category}</span>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF334B] text-white">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-base hover:text-[#FFDE17] cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {product.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.specs.map((spec, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:pl-4 sm:border-l sm:border-gray-800">
                      <div className="text-left sm:text-right">
                        <div className="text-xl font-black text-[#FF334B]">
                          S/. {product.price.toFixed(2)}
                        </div>
                        {product.oldPrice && (
                          <div className="text-xs line-through text-gray-500">
                            S/. {product.oldPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className={`p-2 rounded-xl border text-xs font-bold ${
                            isDarkMode ? "border-gray-700 hover:text-[#FFDE17]" : "border-gray-300 hover:text-black"
                          }`}
                          title="Ver Ficha Técnica"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="py-2 px-3 rounded-xl text-xs font-black uppercase bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors flex items-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
