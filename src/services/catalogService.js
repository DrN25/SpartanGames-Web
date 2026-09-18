import {
  productsCatalog as defaultProducts,
  categoriesTree as defaultCategories,
  storeInfo as defaultStoreInfo,
  defaultBanners
} from "../data/storeData.js";

export const GOOGLE_SHEET_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_SHEET_ID) ||
  "1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno";
export const GOOGLE_SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?usp=sharing`;

export function getStoreMapsUrl(info = {}) {
  if (info?.mapsUrl) return info.mapsUrl;
  if (info?.address) return `https://maps.google.com/?q=${encodeURIComponent(info.address)}`;
  return "";
}

export function getStoreWazeUrl(info = {}) {
  if (info?.wazeUrl) return info.wazeUrl;
  if (info?.address) return `https://waze.com/ul?q=${encodeURIComponent(info.address)}&navigate=yes`;
  return "";
}

export function getStoreWhatsAppUrl(info = {}, message = "") {
  const phone = info?.whatsappMain ? String(info.whatsappMain).replace(/[^0-9]/g, "") : "";
  if (!phone) return "";
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

const CACHE_KEY = "spartan_catalog_cache_v5";
const CACHE_CAT_KEY = "spartan_categories_cache";
const CACHE_CONFIG_KEY = "spartan_config_cache_v5";
const CACHE_BANNERS_KEY = "spartan_banners_cache_v5";
const CACHE_TIME_KEY = "spartan_catalog_timestamp_v5";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de caché

// Mapeo bilingüe de cabeceras para pestaña Productos
const HEADER_ALIASES = {
  id: ["id", "codigo", "item_id"],
  name: ["nombre", "name", "producto", "item", "titulo"],
  brand: ["marca", "brand", "fabricante"],
  category: ["categoria", "category", "departamento"],
  categoryId: ["categoria_id", "categoryid", "subcategoria", "slug_categoria"],
  price: ["precio", "price", "precio_oferta", "precio_actual"],
  oldPrice: ["precio_anterior", "oldprice", "precio_regular", "precio_lista"],
  stock: ["stock", "cantidad", "unidades", "disponibilidad"],
  sku: ["sku", "codigo_barra", "part_number"],
  rating: ["calificacion", "puntuacion", "rating", "estrellas"],
  reviewsCount: ["resenas", "reviewscount", "opiniones", "votos"],
  isPromo: ["en_oferta", "ispromo", "oferta", "promocion"],
  promoTag: ["etiqueta_oferta", "promotag", "badge", "tag"],
  featured: ["destacado", "featured", "portada", "popular"],
  image: ["imagen", "image", "foto", "url_imagen", "portada_url", "imagen_principal"],
  images: ["imagenes", "images", "galeria", "fotos", "fotos_adicionales", "galeria_urls", "url_imagenes", "otras_imagenes"],
  specs: ["caracteristicas_rapidas", "specs", "caracteristicas", "especificaciones_rapidas"],
  summary: ["resumen", "summary", "extracto", "bajada"],
  description: ["descripcion", "description", "detalle"],
  detailedSpecs: ["especificaciones_detalladas", "detailedspecs", "ficha_tecnica", "especificaciones"],
  warranty: ["garantia", "warranty", "garantia_meses"]
};
export { parseCSV } from "../utils/csvParser.js";

// ponytail: standard unicode normalize + regex, no external slugify package needed
export function slugify(text) {
  if (!text) return "";
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ponytail: in-memory Set deduplication for IDs and Slugs
export function deduplicateProducts(productList = []) {
  if (!Array.isArray(productList)) return [];
  const seenIds = new Set();
  const seenSlugs = new Set();

  return productList.map((product, idx) => {
    let id = product.id;
    if (id === undefined || id === null || id === "") {
      id = idx + 1;
    }
    let idStr = String(id);
    if (seenIds.has(idStr)) {
      id = `${idStr}-row${idx + 1}`;
    }
    seenIds.add(String(id));

    let baseSlug = product.slug || slugify(product.name) || `producto-${id}`;
    let finalSlug = baseSlug;
    let counter = 2;
    while (seenSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    seenSlugs.add(finalSlug);

    return {
      ...product,
      id,
      slug: finalSlug
    };
  });
}

function normalizeHeader(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]+/g, "");
}

export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "/assets/images/spartan_games_banner.jpg";
  const trimmed = url.trim();
  if (!trimmed) return "/assets/images/spartan_games_banner.jpg";

  // Soporte directo para enlaces de Google Drive copiados por el cliente
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  return trimmed;
}

export function parseProductRow(headers, row) {
  const normalizedHeaders = headers.map(normalizeHeader);

  const getColVal = (aliases) => {
    for (const alias of aliases) {
      const normAlias = normalizeHeader(alias);
      const index = normalizedHeaders.indexOf(normAlias);
      if (index !== -1 && row[index] !== undefined && row[index] !== null) {
        return row[index].trim();
      }
    }
    return "";
  };

  const parseNumber = (val, fallback = 0) => {
    if (val === null || val === undefined || val === "") return fallback;
    let s = String(val).trim().replace(/^[^\d-]+/, "");
    s = s.replace(/[^0-9.,-]/g, "");
    if (!s) return fallback;

    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    if (lastComma !== -1 && lastDot !== -1) {
      if (lastDot > lastComma) {
        s = s.replace(/,/g, "");
      } else {
        s = s.replace(/\./g, "").replace(",", ".");
      }
    } else if (lastComma !== -1) {
      const parts = s.split(",");
      if (parts.length === 2 && parts[1].length <= 2) {
        s = parts[0] + "." + parts[1];
      } else {
        s = s.replace(/,/g, "");
      }
    }

    const n = parseFloat(s);
    return isNaN(n) ? fallback : n;
  };

  const parseBoolean = (val) => {
    if (!val) return false;
    const s = String(val).trim().toUpperCase();
    return s === "SI" || s === "TRUE" || s === "1" || s === "YES";
  };

  const parseSpecs = (val) => {
    if (!val) return [];
    return String(val).split(",").map((s) => s.trim()).filter(Boolean);
  };

  const parseDetailedSpecs = (val) => {
    if (!val) return [];
    return String(val)
      .split("|")
      .map((part) => {
        const [label, ...valParts] = part.split(":");
        if (!label) return null;
        return {
          label: label.trim(),
          value: valParts.join(":").trim()
        };
      })
      .filter(Boolean);
  };

  const rawId = getColVal(HEADER_ALIASES.id);
  const rawPrice = getColVal(HEADER_ALIASES.price);
  const rawOldPrice = getColVal(HEADER_ALIASES.oldPrice);
  const rawStock = getColVal(HEADER_ALIASES.stock);
  const rawRating = getColVal(HEADER_ALIASES.rating);
  const rawReviews = getColVal(HEADER_ALIASES.reviewsCount);
  const rawCategory = getColVal(HEADER_ALIASES.category) || "Hardware";
  const rawCategoryId = getColVal(HEADER_ALIASES.categoryId) || normalizeHeader(rawCategory);

  // Extracción robusta de imágenes múltiples (soporta lista separada por comas, saltos de línea, columnas adicionales)
  const extractImages = () => {
    const rawMain = getColVal(HEADER_ALIASES.image);
    const rawGallery = getColVal(HEADER_ALIASES.images);

    const numberedImages = [];
    normalizedHeaders.forEach((header, idx) => {
      if (
        /^(imagen|image|foto)[_\s-]?\d+$/i.test(header) &&
        row[idx] !== undefined &&
        row[idx] !== null &&
        row[idx].trim() !== ""
      ) {
        numberedImages.push(row[idx].trim());
      }
    });

    const combinedRaw = [rawMain, rawGallery, ...numberedImages].filter(Boolean);
    const urls = [];

    combinedRaw.forEach((entry) => {
      const splitEntries = String(entry).split(/[\r\n,;|]+/);
      splitEntries.forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) {
          urls.push(normalizeImageUrl(trimmed));
        }
      });
    });

    let uniqueUrls = Array.from(new Set(urls));
    if (uniqueUrls.length === 0) {
      uniqueUrls.push("/assets/images/spartan_games_banner.jpg");
    }

    return uniqueUrls;
  };

  const parsedImages = extractImages();
  const parsedName = getColVal(HEADER_ALIASES.name) || "Componente Hardware";

  return {
    id: isNaN(Number(rawId)) ? rawId : Number(rawId),
    name: parsedName,
    slug: slugify(parsedName),
    brand: getColVal(HEADER_ALIASES.brand) || "Spartan",
    category: rawCategory,
    categoryId: rawCategoryId,
    price: parseNumber(rawPrice, 0),
    oldPrice: parseNumber(rawOldPrice, null),
    stock: parseNumber(rawStock, 0),
    sku: getColVal(HEADER_ALIASES.sku) || `SKU-${rawId}`,
    rating: parseNumber(rawRating, 5.0),
    reviewsCount: parseNumber(rawReviews, 0),
    isPromo: parseBoolean(getColVal(HEADER_ALIASES.isPromo)),
    promoTag: getColVal(HEADER_ALIASES.promoTag) || (parseBoolean(getColVal(HEADER_ALIASES.isPromo)) ? "OFERTA" : ""),
    featured: parseBoolean(getColVal(HEADER_ALIASES.featured)),
    image: parsedImages[0],
    images: parsedImages,
    specs: parseSpecs(getColVal(HEADER_ALIASES.specs)),
    summary: getColVal(HEADER_ALIASES.summary) || "",
    description: getColVal(HEADER_ALIASES.description) || "",
    detailedSpecs: parseDetailedSpecs(getColVal(HEADER_ALIASES.detailedSpecs)),
    warranty: getColVal(HEADER_ALIASES.warranty) || "Garantía física directa en tienda con boleta o factura."
  };
}

async function fetchTabRaw(tabName, timestamp) {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}&_t=${timestamp}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${tabName}`);
  return await res.text();
}

export function getCachedCatalog() {
  if (typeof localStorage === "undefined") return deduplicateProducts(defaultProducts);
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return deduplicateProducts(parsed);
      }
    }
  } catch (e) {
    console.warn("Could not read catalog cache", e);
  }
  return deduplicateProducts(defaultProducts);
}

export function getCachedCategories() {
  if (typeof localStorage === "undefined") return defaultCategories;
  try {
    const raw = localStorage.getItem(CACHE_CAT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read categories cache", e);
  }
  return defaultCategories;
}

export function getCachedConfig() {
  if (typeof localStorage === "undefined") return defaultStoreInfo;
  try {
    const raw = localStorage.getItem(CACHE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read config cache", e);
  }
  return defaultStoreInfo;
}

export function getCachedBanners() {
  if (typeof localStorage === "undefined") return defaultBanners;
  try {
    const raw = localStorage.getItem(CACHE_BANNERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read banners cache", e);
  }
  return defaultBanners;
}

/**
 * Recalculates category product counts based on active products
 */
export function countCategories(categoriesList, productsList) {
  const counts = {};
  productsList.forEach((p) => {
    const catId = p.categoryId || normalizeHeader(p.category);
    counts[catId] = (counts[catId] || 0) + 1;
  });

  return categoriesList.map((cat) => ({
    ...cat,
    count: counts[cat.id] !== undefined ? counts[cat.id] : 0
  }));
}

/**
 * Detects price and stock changes between current catalog and newly fetched catalog
 */
export function detectPriceChanges(currentProducts = [], newProducts = []) {
  if (!currentProducts?.length || !newProducts?.length) return [];
  const changes = [];
  const currentMap = new Map(currentProducts.map((p) => [String(p.id), p]));

  for (const next of newProducts) {
    const prev = currentMap.get(String(next.id));
    if (prev) {
      const priceChanged = Math.abs(Number(prev.price) - Number(next.price)) > 0.01;
      const stockChanged = Number(prev.stock) !== Number(next.stock);
      if (priceChanged || stockChanged) {
        changes.push({
          id: next.id,
          name: next.name,
          oldPrice: Number(prev.price),
          newPrice: Number(next.price),
          oldStock: Number(prev.stock),
          newStock: Number(next.stock),
          type: priceChanged ? "price" : "stock"
        });
      }
    }
  }
  return changes;
}

/**
 * Fetches all tabs in parallel (Productos, Categorias, Configuracion, Banners)
 */
export async function fetchLiveCatalog(force = false) {
  try {
    const now = Date.now();
    const lastFetch = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

    if (!force && now - lastFetch < CACHE_TTL_MS) {
      return {
        products: getCachedCatalog(),
        categories: countCategories(getCachedCategories(), getCachedCatalog()),
        storeInfo: getCachedConfig(),
        banners: getCachedBanners()
      };
    }

    // 1. Intentar primero a través del proxy serverless seguro (/api/catalog)
    try {
      const endpoints = ["/api/catalog", "/.netlify/functions/catalog"];
      for (const endpoint of endpoints) {
        const proxyRes = await fetch(`${endpoint}?_t=${now}`);
        if (proxyRes.ok) {
          const contentType = proxyRes.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const proxyData = await proxyRes.json();
            if (proxyData?.products && Array.isArray(proxyData.products) && proxyData.products.length > 0) {
              const safeProxyProducts = deduplicateProducts(proxyData.products);
              localStorage.setItem(CACHE_KEY, JSON.stringify(safeProxyProducts));
              localStorage.setItem(CACHE_TIME_KEY, String(now));

              return {
                products: safeProxyProducts,
                categories: countCategories(getCachedCategories(), safeProxyProducts),
                storeInfo: getCachedConfig(),
                banners: getCachedBanners()
              };
            }
          }
        }
      }
    } catch (proxyErr) {
      // Fallback a lectura directa si el proxy no responde
    }

    const [prodCsv, catCsv, cfgCsv, banCsv] = await Promise.allSettled([
      fetchTabRaw("Productos", now),
      fetchTabRaw("Categorias", now),
      fetchTabRaw("Configuracion", now),
      fetchTabRaw("Banners", now)
    ]);

    // 1. Process Products
    let products = getCachedCatalog();
    if (prodCsv.status === "fulfilled") {
      const rows = parseCSV(prodCsv.value);
      if (rows.length > 1) {
        const headers = rows[0].map((h) => h.trim());
        const parsed = rows.slice(1).map((r) => parseProductRow(headers, r)).filter((p) => p.name);
        if (parsed.length > 0) {
          products = deduplicateProducts(parsed);
          localStorage.setItem(CACHE_KEY, JSON.stringify(products));
        }
      }
    }

    // 2. Process Categories with images
    let categories = getCachedCategories();
    if (catCsv.status === "fulfilled") {
      const rows = parseCSV(catCsv.value);
      if (rows.length > 1) {
        const parsedCats = rows.slice(1).map((r) => {
          const id = r[0]?.trim() || "";
          const name = r[1]?.trim() || "";
          const icon = r[2]?.trim() || "Layers";
          const subCategories = r[3] ? r[3].split(",").map((s) => s.trim()) : [];
          const description = r[4]?.trim() || "";
          const rawImg = r[5]?.trim();
          const defaultCat = defaultCategories.find((c) => c.id === id);
          const image = rawImg ? normalizeImageUrl(rawImg) : (defaultCat?.image || "/assets/images/spartan_games_banner.jpg");
          return { id, name, icon, subCategories, description, image };
        }).filter((c) => c.id && c.name);

        if (parsedCats.length > 0) {
          categories = parsedCats;
          localStorage.setItem(CACHE_CAT_KEY, JSON.stringify(categories));
        }
      }
    }

    // 3. Process Store Config from Google Sheets
    let config = getCachedConfig();
    if (cfgCsv.status === "fulfilled") {
      const rows = parseCSV(cfgCsv.value);
      if (rows.length > 1) {
        const cfgObj = { ...defaultStoreInfo };
        rows.slice(1).forEach((r) => {
          const rawKey = r[0]?.trim()?.toLowerCase() || "";
          const val = r[1]?.trim();
          if (rawKey && val) {
            if (rawKey === "nombre_tienda" || rawKey === "name") cfgObj.name = val;
            if (rawKey === "slogan" || rawKey === "tagline") cfgObj.tagline = val;
            if (rawKey === "logo_url" || rawKey === "logo") cfgObj.logoUrl = normalizeImageUrl(val);
            if (rawKey === "isotipo_url" || rawKey === "isotipo") cfgObj.isotipoUrl = normalizeImageUrl(val);
            if (rawKey === "direccion" || rawKey === "address") cfgObj.address = val;
            if (rawKey === "ciudad" || rawKey === "city") cfgObj.city = val;
            if (rawKey === "whatsapp" || rawKey === "whatsapp_main") cfgObj.whatsappMain = val.replace(/[^0-9]/g, "");
            if (rawKey === "telefono_1" || rawKey === "phone_1") {
              cfgObj.phones = [val.replace(/[^0-9]/g, ""), cfgObj.phones?.[1] || ""];
            }
            if (rawKey === "telefono_2" || rawKey === "phone_2") {
              cfgObj.phones = [cfgObj.phones?.[0] || "", val.replace(/[^0-9]/g, "")];
            }
            if (rawKey === "horario" || rawKey === "schedule") cfgObj.schedule = val;
            if (rawKey === "nota_delivery" || rawKey === "delivery_note") cfgObj.deliveryNote = val;
            if (rawKey === "politica_garantia" || rawKey === "garantia") cfgObj.warrantyPolicy = val;
            if (rawKey === "maps_url" || rawKey === "google_maps_url") cfgObj.mapsUrl = val;
            if (rawKey === "waze_url") cfgObj.wazeUrl = val;
            if (rawKey === "facebook_url" || rawKey === "facebook") cfgObj.facebookUrl = val;
            if (rawKey === "instagram_url" || rawKey === "instagram") cfgObj.instagramUrl = val;
            if (rawKey === "tiktok_url" || rawKey === "tiktok") cfgObj.tiktokUrl = val;
          }
        });
        config = cfgObj;
        localStorage.setItem(CACHE_CONFIG_KEY, JSON.stringify(config));
      }
    }

    // 4. Process Banners
    let banners = getCachedBanners();
    if (banCsv.status === "fulfilled") {
      const rows = parseCSV(banCsv.value);
      if (rows.length > 1) {
        const parseBoolean = (val) => {
          if (!val) return false;
          const s = String(val).trim().toUpperCase();
          return s === "SI" || s === "TRUE" || s === "1" || s === "YES";
        };

        const parsedBanners = rows.slice(1).map((r, idx) => {
          const id = r[0]?.trim() || `banner-${idx + 1}`;
          const title = r[1]?.trim();
          const subtitle = r[2]?.trim() || "";
          const tag = r[3]?.trim() || "OFERTA";
          const image = normalizeImageUrl(r[4]?.trim());
          const actionType = r[5]?.trim() || "category";
          const ctaText = r[6]?.trim() || "Ver Más";
          const actionTarget = r[7]?.trim() || "";
          const active = r[8] !== undefined && r[8] !== "" ? parseBoolean(r[8]) : true;
          return { id, title, subtitle, tag, image, actionType, ctaText, actionTarget, active };
        }).filter((b) => b.title && b.active);

        if (parsedBanners.length > 0) {
          banners = parsedBanners;
          localStorage.setItem(CACHE_BANNERS_KEY, JSON.stringify(banners));
        }
      }
    }

    localStorage.setItem(CACHE_TIME_KEY, String(now));

    return {
      products,
      categories: countCategories(categories, products),
      storeInfo: config,
      banners
    };
  } catch (err) {
    console.warn("Using cached data due to sync exception:", err);
  }

  const cachedP = getCachedCatalog();
  return {
    products: cachedP,
    categories: countCategories(getCachedCategories(), cachedP),
    storeInfo: getCachedConfig(),
    banners: getCachedBanners()
  };
}
