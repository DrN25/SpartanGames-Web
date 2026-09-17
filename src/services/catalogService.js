import {
  productsCatalog as defaultProducts,
  categoriesTree as defaultCategories,
  storeInfo as defaultStoreInfo
} from "../data/storeData.js";

export const GOOGLE_SHEET_ID = "1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno";
export const GOOGLE_SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?usp=sharing`;

const CACHE_KEY = "spartan_catalog_cache_v5";
const CACHE_CAT_KEY = "spartan_categories_cache";
const CACHE_CONFIG_KEY = "spartan_config_cache_v5";
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

export function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentToken = "";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") {
        i++;
      }
      row.push(currentToken.trim());
      currentToken = "";
      if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
        lines.push(row);
      }
      row = [];
    } else {
      currentToken += c;
    }
  }

  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      lines.push(row);
    }
  }

  return lines;
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

  return {
    id: isNaN(Number(rawId)) ? rawId : Number(rawId),
    name: getColVal(HEADER_ALIASES.name) || "Componente Hardware",
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
    warranty: getColVal(HEADER_ALIASES.warranty) || "Garantía física en Spartan Games Compuplaza Arequipa."
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
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read catalog cache", e);
  }
  return defaultProducts;
}

export function getCachedCategories() {
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
  try {
    const raw = localStorage.getItem(CACHE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read config cache", e);
  }
  return defaultStoreInfo;
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
 * Fetches all tabs in parallel (Productos, Categorias, Configuracion)
 */
export async function fetchLiveCatalog(force = false) {
  try {
    const now = Date.now();
    const lastFetch = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

    if (!force && now - lastFetch < CACHE_TTL_MS) {
      return {
        products: getCachedCatalog(),
        categories: countCategories(getCachedCategories(), getCachedCatalog()),
        storeInfo: getCachedConfig()
      };
    }

    const [prodCsv, catCsv, cfgCsv] = await Promise.allSettled([
      fetchTabRaw("Productos", now),
      fetchTabRaw("Categorias", now),
      fetchTabRaw("Configuracion", now)
    ]);

    // 1. Process Products
    let products = getCachedCatalog();
    if (prodCsv.status === "fulfilled") {
      const rows = parseCSV(prodCsv.value);
      if (rows.length > 1) {
        const headers = rows[0].map((h) => h.trim());
        const parsed = rows.slice(1).map((r) => parseProductRow(headers, r)).filter((p) => p.name);
        if (parsed.length > 0) {
          products = parsed;
          localStorage.setItem(CACHE_KEY, JSON.stringify(products));
        }
      }
    }

    // 2. Process Categories
    let categories = getCachedCategories();
    if (catCsv.status === "fulfilled") {
      const rows = parseCSV(catCsv.value);
      if (rows.length > 1) {
        const parsedCats = rows.slice(1).map((r) => ({
          id: r[0]?.trim() || "",
          name: r[1]?.trim() || "",
          icon: r[2]?.trim() || "Layers",
          subCategories: r[3] ? r[3].split(",").map((s) => s.trim()) : [],
          description: r[4]?.trim() || ""
        })).filter((c) => c.id && c.name);

        if (parsedCats.length > 0) {
          categories = parsedCats;
          localStorage.setItem(CACHE_CAT_KEY, JSON.stringify(categories));
        }
      }
    }

    // 3. Process Store Config
    let config = getCachedConfig();
    if (cfgCsv.status === "fulfilled") {
      const rows = parseCSV(cfgCsv.value);
      if (rows.length > 1) {
        const cfgObj = { ...defaultStoreInfo };
        rows.slice(1).forEach((r) => {
          const key = r[0]?.trim();
          const val = r[1]?.trim();
          if (key && val) {
            if (key === "nombre_tienda") cfgObj.name = val;
            if (key === "slogan") cfgObj.tagline = val;
            if (key === "logo_url") cfgObj.logoUrl = normalizeImageUrl(val);
            if (key === "isotipo_url") cfgObj.isotipoUrl = normalizeImageUrl(val);
            if (key === "direccion") cfgObj.address = val;
            if (key === "whatsapp") cfgObj.whatsappMain = val;
            if (key === "telefono_1") cfgObj.phones = [val, cfgObj.phones[1] || ""];
            if (key === "telefono_2" && cfgObj.phones.length > 1) cfgObj.phones[1] = val;
            if (key === "horario") cfgObj.schedule = val;
            if (key === "nota_delivery") cfgObj.deliveryNote = val;
            if (key === "politica_garantia") cfgObj.warrantyPolicy = val;
          }
        });
        config = cfgObj;
        localStorage.setItem(CACHE_CONFIG_KEY, JSON.stringify(config));
      }
    }

    localStorage.setItem(CACHE_TIME_KEY, String(now));

    return {
      products,
      categories: countCategories(categories, products),
      storeInfo: config
    };
  } catch (err) {
    console.warn("Using cached data due to sync exception:", err);
  }

  const cachedP = getCachedCatalog();
  return {
    products: cachedP,
    categories: countCategories(getCachedCategories(), cachedP),
    storeInfo: getCachedConfig()
  };
}
