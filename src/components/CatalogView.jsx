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
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1720px] mx-auto transition-colors ${
      isDarkMode ? "text-gray-100" : "text-slate-900"
    }`}>
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbsList} isDarkMode={isDarkMode} onNavigate={onNavigate} />
      </div>

      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl mb-8 border relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-r from-[#111620] via-[#161D2A] to-[#111620] border-gray-800"
          : "bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-slate-200 shadow-xs"
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#FFDE17] text-slate-950 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo Oficial Spartan Games
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              {currentCategoryObj ? currentCategoryObj.name : "Hardware & Laptops Gamer Arequipa"}
            </h1>
            <p className={`text-sm mt-1 max-w-2xl ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
              {currentCategoryObj
                ? `Stock físico garantizado de ${currentCategoryObj.name.toLowerCase()} con respaldo local de 1 a 3 años en C.C. Compuplaza Tienda 204.`
                : "Componentes nuevos, ensambles testeados y entrega rápida garantizada en Arequipa y todo el Sur del Perú."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-5 py-2.5 rounded-2xl text-center border ${
              isDarkMode ? "bg-black/40 border-gray-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="text-2xl font-black text-slate-950 dark:text-[#FFDE17]">
                {filteredProducts.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                Productos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flex/Grid: Fixed/Proportional Sidebar + Expansive Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters: Fixed/Proportional Width */}
        <aside className="w-full lg:w-72 2xl:w-80 flex-shrink-0 space-y-6">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b mb-5 border-slate-200 dark:border-gray-800">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Filtros Avanzados</span>
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 dark:text-[#FFDE17] hover:underline font-bold"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Categorías */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-3">
                Categorias
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => onSelectCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    selectedCategory === null
                      ? "bg-[#FFDE17] text-slate-950 font-black shadow-xs"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>Todos los Componentes</span>
                  <span className="text-[10px] opacity-70">({products.length})</span>
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-[#FFDE17] text-slate-950 font-black shadow-xs"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected
                            ? "bg-slate-950 text-[#FFDE17]"
                            : isDarkMode
                            ? "bg-gray-800 text-gray-400"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rango de Precios */}
            <div className="mb-6 pt-5 border-t border-slate-200 dark:border-gray-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-3">
                Rango de Precio (S/.)
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-black/30 text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold">Min</span>
                  <span className="font-mono font-bold">S/. {priceRange[0]}</span>
                </div>
                <div className="p-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-black/30 text-xs">
                  <span className="text-[10px] text-slate-400 block font-semibold">Max</span>
                  <span className="font-mono font-bold">S/. {priceRange[1]}</span>
                </div>
              </div>

              {/* Slider Nativo */}
              <input
                type="range"
                min="0"
                max="8000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#FFDE17] cursor-pointer mb-3"
              />

              {/* Botones Rápidos de Presupuesto */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleQuickPrice(0, 500)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                    priceRange[0] === 0 && priceRange[1] === 500
                      ? isDarkMode ? "bg-[#FFDE17] text-black border-[#FFDE17]" : "bg-slate-900 text-white border-slate-900"
                      : isDarkMode ? "border-gray-800 hover:border-gray-700" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  Hasta S/. 500
                </button>
                <button
                  onClick={() => handleQuickPrice(500, 1500)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                    priceRange[0] === 500 && priceRange[1] === 1500
                      ? isDarkMode ? "bg-[#FFDE17] text-black border-[#FFDE17]" : "bg-slate-900 text-white border-slate-900"
                      : isDarkMode ? "border-gray-800 hover:border-gray-700" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  S/. 500 - 1500
                </button>
                <button
                  onClick={() => handleQuickPrice(1500, 3000)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                    priceRange[0] === 1500 && priceRange[1] === 3000
                      ? isDarkMode ? "bg-[#FFDE17] text-black border-[#FFDE17]" : "bg-slate-900 text-white border-slate-900"
                      : isDarkMode ? "border-gray-800 hover:border-gray-700" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  S/. 1500 - 3000
                </button>
                <button
                  onClick={() => handleQuickPrice(3000, 8000)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                    priceRange[0] === 3000 && priceRange[1] === 8000
                      ? isDarkMode ? "bg-[#FFDE17] text-black border-[#FFDE17]" : "bg-slate-900 text-white border-slate-900"
                      : isDarkMode ? "border-gray-800 hover:border-gray-700" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  Gamer Gama Alta
                </button>
              </div>
            </div>

            {/* Marcas Oficiales */}
            <div className="mb-6 pt-5 border-t border-slate-200 dark:border-gray-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-3">
                Marcas Oficiales
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map(({ brand, count }) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? "bg-slate-900 dark:bg-[#FFDE17] border-slate-900 dark:border-[#FFDE17] text-white dark:text-black"
                              : "border-slate-300 dark:border-gray-700"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? "font-bold text-amber-800 dark:text-[#FFDE17]" : "text-slate-700 dark:text-gray-300"}>
                          {brand}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-gray-500">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Solo en stock */}
            <div className="pt-5 border-t border-slate-200 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-800 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <span className="font-bold">Solo con stock en tienda física</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Catalog Content Zone */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Controls Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200 shadow-xs"
          }`}>
            {/* Live Search inside Catalog */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar componente, modelo o especificación..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors outline-none ${
                  isDarkMode
                    ? "bg-black/40 border-gray-800 text-white placeholder-gray-500 focus:border-[#FFDE17]"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort + View Mode */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                    isDarkMode
                      ? "bg-black/40 border-gray-800 text-gray-200"
                      : "bg-slate-50 border-slate-300 text-slate-800"
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
                isDarkMode ? "bg-black/30 border-gray-800" : "bg-slate-100 border-slate-300"
              }`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#FFDE17] text-slate-950 font-bold"
                      : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-black"
                  }`}
                  title="Vista Cuadrícula"
                  aria-label="Vista Cuadrícula"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#FFDE17] text-slate-950 font-bold"
                      : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-black"
                  }`}
                  title="Vista Lista"
                  aria-label="Vista Lista"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-500 dark:text-gray-400 text-[11px] font-bold uppercase">
                Filtros activos:
              </span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-[#FFDE17]/20 border border-amber-300 dark:border-[#FFDE17]/50 text-amber-950 dark:text-[#FFDE17] font-bold">
                  {currentCategoryObj ? currentCategoryObj.name : selectedCategory}
                  <button onClick={() => onSelectCategory(null)} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/50 text-blue-900 dark:text-blue-400 font-bold">
                  "{searchQuery}"
                  <button onClick={() => onSearchChange("")} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/50 text-purple-900 dark:text-purple-400 font-bold"
                >
                  {brand}
                  <button onClick={() => toggleBrand(brand)} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 8000) && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/50 text-emerald-950 dark:text-emerald-400 font-bold">
                  S/. {priceRange[0]} - S/. {priceRange[1]}
                  <button onClick={() => setPriceRange([0, 8000])} className="hover:opacity-75">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 dark:text-red-400 hover:underline font-bold ml-2"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* Product Grid / List Rendering with Ultrawide responsiveness */}
          {filteredProducts.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              isDarkMode ? "bg-[#111620] border-gray-800" : "bg-white border-slate-200 shadow-xs"
            }`}>
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black uppercase mb-2 text-slate-900 dark:text-white">
                No se encontraron productos con estos filtros
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Intenta ajustar el presupuesto o buscar un término más general.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 dark:bg-[#FFDE17] dark:text-slate-950 font-bold uppercase text-xs tracking-wider transition-colors shadow-xs"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-amber-400/50 hover:shadow-lg hover:shadow-black/40"
                        : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className={`relative p-5 aspect-square flex items-center justify-center overflow-hidden ${
                        isDarkMode ? "bg-black/40" : "bg-slate-50/70"
                      }`}>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-950 text-[#FFDE17]">
                            {product.brand}
                          </span>
                          {discount > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF334B] text-white shadow-xs">
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

                        <div className="absolute bottom-2.5 left-3 right-3">
                          {product.stock <= 4 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                              ¡Últimas {product.stock} unidades!
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                              En stock físico ({product.stock} unid.)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-gray-400 mb-1">
                          {product.category}
                        </div>
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-bold text-sm leading-snug line-clamp-2 text-slate-950 dark:text-white hover:text-amber-800 dark:hover:text-[#FFDE17] cursor-pointer transition-colors"
                          title={product.name}
                        >
                          {product.name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {product.specs.slice(0, 3).map((spec, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-gray-800/60 mt-3">
                      <div className="flex items-baseline gap-2 my-3">
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
                          onAddToCart(product);
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
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                      isDarkMode
                        ? "bg-[#111620] border-gray-800 hover:border-amber-400/50 hover:shadow-lg"
                        : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    <div className={`w-32 h-32 rounded-xl p-3 flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? "bg-black/40" : "bg-slate-50"
                    }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-950 text-[#FFDE17]">
                          {product.brand}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">{product.category}</span>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF334B] text-white">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-base text-slate-950 dark:text-white hover:text-amber-800 dark:hover:text-[#FFDE17] cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
                        {product.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.specs.map((s, i) => (
                          <span key={i} className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-700"
                          }`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 sm:border-l sm:pl-6 border-slate-200 dark:border-gray-800 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div>
                        <div className="text-xl font-black text-[#FF334B]">
                          S/. {product.price.toFixed(2)}
                        </div>
                        {product.oldPrice && (
                          <div className="text-xs line-through text-slate-400">
                            S/. {product.oldPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98 ${
                          isDarkMode
                            ? "bg-[#18202F] text-slate-100 hover:bg-[#FFDE17] hover:text-slate-950 border border-gray-700"
                            : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 border border-slate-900"
                        }`}
                        aria-label={`Añadir ${product.name} al carrito`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Añadir al Carrito</span>
                      </button>
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
