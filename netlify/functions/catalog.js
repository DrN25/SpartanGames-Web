/**
 * Netlify Serverless Function: Spartan Games Catalog Proxy
 * Protects GOOGLE_SHEET_ID on the server, filters sensitive columns,
 * and provides in-memory caching with instant webhook revalidation.
 */

import {
  productsCatalog as defaultProducts,
  categoriesTree as defaultCategories,
  storeInfo as defaultStoreInfo,
  defaultBanners,
  customerReviews as defaultReviews,
  faqData as defaultFaqs
} from "../../src/data/storeData.js";
import { parseCSV } from "../../src/utils/csvParser.js";

export { parseCSV };

const rawSheetId = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SHEET_ID = (rawSheetId && rawSheetId !== "undefined" ? rawSheetId : "1_lfhNXffYfXKOXXTlk8wjel0veAn8zvnZ8kB2ktd-Xc").trim();
export const FALLBACK_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ022TtIzjOthBhNjTuBWaBoMIlhGZ-jiVpPy4hfJ87dhqt9HbEYLnz1iPqlrJlFNu/exec";
const rawAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const GOOGLE_APPS_SCRIPT_URL = (rawAppsScriptUrl && rawAppsScriptUrl !== "undefined" && rawAppsScriptUrl.trim() !== "" ? rawAppsScriptUrl.trim() : FALLBACK_APPS_SCRIPT_URL);
const CACHE_TTL_MS = 15 * 1000; // 15 segundos de caché pasiva en memoria

let memoryCache = null;
let lastFetchTime = 0;

function normalizeHeader(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]+/g, "");
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "/assets/images/spartan_games_banner.jpg";
  const trimmed = url.trim();
  if (!trimmed) return "/assets/images/spartan_games_banner.jpg";
  if (trimmed.includes("drive.google.com")) {
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return trimmed;
}

export function parseProductsFromRows(rows = []) {
  if (!Array.isArray(rows) || rows.length <= 1) return [];
  const headers = (rows[0] || []).map(h => normalizeHeader(String(h || "")));
  const findCol = (row, aliases) => {
    for (const a of aliases) {
      const idx = headers.indexOf(normalizeHeader(a));
      if (idx !== -1 && row[idx] !== undefined && row[idx] !== null) return String(row[idx]).trim();
    }
    return "";
  };

  return rows.slice(1).map((r) => {
    const rawPrice = findCol(r, ["precio", "price"]).replace(/[^0-9.]/g, "");
    const rawOldPrice = findCol(r, ["precio_anterior", "oldprice"]).replace(/[^0-9.]/g, "");
    const rawStock = findCol(r, ["stock", "cantidad"]).replace(/[^0-9]/g, "");
    const rawImg = findCol(r, ["imagen", "image", "foto"]);
    const id = findCol(r, ["id", "codigo"]);

    return {
      id: isNaN(Number(id)) ? id : Number(id),
      name: findCol(r, ["nombre", "name", "producto"]) || "Componente Hardware",
      brand: findCol(r, ["marca", "brand"]) || "Spartan",
      category: findCol(r, ["categoria", "category"]) || "Hardware",
      categoryId: findCol(r, ["categoria_id", "categoryid"]) || normalizeHeader(findCol(r, ["categoria", "category"])),
      price: parseFloat(rawPrice) || 0,
      oldPrice: rawOldPrice ? parseFloat(rawOldPrice) : null,
      stock: parseInt(rawStock, 10) || 0,
      sku: findCol(r, ["sku"]) || `SKU-${id}`,
      rating: parseFloat(findCol(r, ["calificacion", "rating"])) || 5.0,
      reviewsCount: parseInt(findCol(r, ["resenas", "opiniones"]), 10) || 0,
      isPromo: ["SI", "TRUE", "1"].includes(findCol(r, ["en_oferta", "ispromo"]).toUpperCase()),
      featured: ["SI", "TRUE", "1"].includes(findCol(r, ["destacado", "featured"]).toUpperCase()),
      image: normalizeImageUrl(rawImg),
      specs: (findCol(r, ["specs", "caracteristicas"]) || "").split(",").map(s => s.trim()).filter(Boolean),
      description: findCol(r, ["descripcion", "detalle"]) || "",
      warranty: findCol(r, ["garantia"]) || "Garantía física directa en tienda con comprobante oficial."
    };
  }).filter(p => p.name && p.price > 0);
}

export function parseStoreInfoFromRows(rows = []) {
  const storeInfo = { ...defaultStoreInfo };
  if (!Array.isArray(rows) || rows.length <= 1) return storeInfo;

  rows.slice(1).forEach((r) => {
    const rawKey = String(r[0] || "").trim().toLowerCase();
    const val = String(r[1] !== undefined && r[1] !== null ? r[1] : "").trim();
    if (rawKey && val) {
      if (rawKey === "nombre_tienda" || rawKey === "name") storeInfo.name = val;
      if (rawKey === "slogan" || rawKey === "tagline") storeInfo.tagline = val;
      if (rawKey === "logo_url" || rawKey === "logo") storeInfo.logoUrl = normalizeImageUrl(val);
      if (rawKey === "isotipo_url" || rawKey === "isotipo") storeInfo.isotipoUrl = normalizeImageUrl(val);
      if (rawKey === "direccion" || rawKey === "address") storeInfo.address = val;
      if (rawKey === "ciudad" || rawKey === "city") storeInfo.city = val;
      if (rawKey === "whatsapp" || rawKey === "whatsapp_main") storeInfo.whatsappMain = val.replace(/[^0-9]/g, "");
      if (rawKey === "telefono_1" || rawKey === "phone_1") {
        storeInfo.phones = [val.replace(/[^0-9]/g, ""), storeInfo.phones?.[1] || ""];
      }
      if (rawKey === "telefono_2" || rawKey === "phone_2") {
        storeInfo.phones = [storeInfo.phones?.[0] || "", val.replace(/[^0-9]/g, "")];
      }
      if (rawKey === "horario" || rawKey === "schedule") storeInfo.schedule = val;
      if (rawKey === "nota_delivery" || rawKey === "delivery_note") storeInfo.deliveryNote = val;
      if (rawKey === "politica_garantia" || rawKey === "garantia") storeInfo.warrantyPolicy = val;
      if (rawKey === "maps_url" || rawKey === "google_maps_url") storeInfo.mapsUrl = val;
      if (rawKey === "waze_url") storeInfo.wazeUrl = val;
      if (rawKey === "maps_embed_url") storeInfo.mapsEmbedUrl = val;
      if (rawKey === "referencia_ubicacion" || rawKey === "location_reference" || rawKey === "referencia") {
        storeInfo.locationReference = val;
      }
      if (rawKey === "correo_contacto" || rawKey === "email") storeInfo.email = val;
      if (rawKey === "ruc") storeInfo.ruc = val;
      if (rawKey === "razon_social" || rawKey === "business_name") storeInfo.businessName = val;
      if (rawKey === "facebook_url" || rawKey === "facebook") storeInfo.facebookUrl = val;
      if (rawKey === "instagram_url" || rawKey === "instagram") storeInfo.instagramUrl = val;
      if (rawKey === "tiktok_url" || rawKey === "tiktok") storeInfo.tiktokUrl = val;
    }
  });
  return storeInfo;
}

export function parseCategoriesFromRows(rows = []) {
  if (!Array.isArray(rows) || rows.length <= 1) return defaultCategories;
  const parsedCats = rows.slice(1).map((r) => {
    const id = String(r[0] || "").trim();
    const name = String(r[1] || "").trim();
    const icon = String(r[2] || "").trim() || "Layers";
    const subCategories = r[3] ? String(r[3]).split(",").map((s) => s.trim()) : [];
    const description = String(r[4] || "").trim();
    const rawImg = r[5] !== undefined && r[5] !== null ? String(r[5]).trim() : "";
    const defaultCat = defaultCategories.find((c) => c.id === id);
    const image = rawImg ? normalizeImageUrl(rawImg) : (defaultCat?.image || "/assets/images/spartan_games_banner.jpg");
    return { id, name, icon, subCategories, description, image };
  }).filter((c) => c.id && c.name);

  return parsedCats.length > 0 ? parsedCats : defaultCategories;
}

export function parseBannersFromRows(rows = []) {
  if (!Array.isArray(rows) || rows.length <= 1) return defaultBanners;
  const firstRow = (rows[0] || []).map(h => normalizeHeader(String(h || "")));
  if (firstRow.includes("titulo") || firstRow.includes("title") || firstRow[0] === "id") {
    const parsedBanners = rows.slice(1).map((r, idx) => {
      const id = String(r[0] || "").trim() || `banner-${idx + 1}`;
      const title = String(r[1] || "").trim();
      const subtitle = String(r[2] || "").trim();
      const tag = String(r[3] || "").trim() || "OFERTA";
      const image = normalizeImageUrl(String(r[4] || "").trim());
      const actionType = String(r[5] || "").trim() || "category";
      const ctaText = String(r[6] || "").trim() || "Ver Más";
      const actionTarget = String(r[7] || "").trim();
      const active = r[8] !== undefined && r[8] !== "" ? ["SI", "TRUE", "1", "YES"].includes(String(r[8]).trim().toUpperCase()) : true;
      return { id, title, subtitle, tag, image, actionType, ctaText, actionTarget, active };
    }).filter((b) => b.title && b.active);

    if (parsedBanners.length > 0) return parsedBanners;
  }
  return defaultBanners;
}

export function parseReviewsFromRows(rows = [], defaultCity = "Arequipa") {
  if (!Array.isArray(rows) || rows.length <= 1) return defaultReviews;
  const firstRow = (rows[0] || []).map(h => normalizeHeader(String(h || "")));
  if (firstRow.includes("cliente") || firstRow.includes("name") || firstRow.includes("comentario")) {
    const parsedReviews = rows.slice(1).map((r, idx) => ({
      id: String(r[0] || "").trim() || idx + 1,
      name: String(r[1] || "").trim() || "Cliente",
      city: String(r[2] || "").trim() || defaultCity,
      role: String(r[3] || "").trim() || "Cliente Verificado",
      purchase: String(r[4] || "").trim() || "Compra Verificada",
      rating: parseFloat(r[5]) || 5,
      comment: String(r[6] || "").trim(),
      image: normalizeImageUrl(String(r[7] || "").trim()),
      badge: String(r[8] || "").trim() || "Compra Verificada"
    })).filter(rev => rev.comment && rev.name);

    if (parsedReviews.length > 0) return parsedReviews;
  }
  return defaultReviews;
}

export function parseFaqsFromRows(rows = []) {
  if (!Array.isArray(rows) || rows.length <= 1) return defaultFaqs;
  const firstRow = (rows[0] || []).map(h => normalizeHeader(String(h || "")));
  if (firstRow.includes("pregunta") || firstRow.includes("question") || firstRow.includes("categoria")) {
    const rawItems = rows.slice(1).map((r) => ({
      category: String(r[0] || "").trim() || "General",
      q: String(r[1] || "").trim(),
      a: String(r[2] || "").trim()
    })).filter(f => f.q && f.a);

    if (rawItems.length > 0) {
      const grouped = {};
      rawItems.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push({ q: item.q, a: item.a });
      });
      return Object.entries(grouped).map(([category, items]) => ({ category, items }));
    }
  }
  return defaultFaqs;
}

async function fetchAppsScriptData() {
  const url = (process.env.GOOGLE_APPS_SCRIPT_URL && process.env.GOOGLE_APPS_SCRIPT_URL !== "undefined" && process.env.GOOGLE_APPS_SCRIPT_URL.trim() !== ""
    ? process.env.GOOGLE_APPS_SCRIPT_URL.trim()
    : GOOGLE_APPS_SCRIPT_URL).trim();
  if (!url || url === "undefined") return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${url}?_t=${Date.now()}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json && json.status === "success" && json.data) {
      return json.data;
    }
  } catch {
    // ponytail: silent fallback to GViz when Apps Script is unreachable or times out
  } finally {
    clearTimeout(timeoutId);
  }
  return null;
}

async function fetchSheetCsv(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tabName)}&_t=${Date.now()}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${tabName}`);
  return await res.text();
}

async function buildCatalogPayload() {
  // 1. Intentar primero con Google Apps Script en tiempo real (0 delay)
  const gasData = await fetchAppsScriptData();
  if (gasData) {
    try {
      const products = parseProductsFromRows(gasData.productos || []);
      const storeInfo = parseStoreInfoFromRows(gasData.configuracion || []);
      const categories = parseCategoriesFromRows(gasData.categorias || []);
      const banners = parseBannersFromRows(gasData.banners || []);
      const reviews = parseReviewsFromRows(gasData.resenas || [], storeInfo.city);
      const faqs = parseFaqsFromRows(gasData.faq || []);

      return {
        products: products.length ? products : defaultProducts,
        categories,
        storeInfo,
        banners,
        reviews,
        faqs,
        _source: "apps_script_realtime",
        version: Date.now(),
        timestamp: new Date().toISOString()
      };
    } catch {
      // ponytail: silent fallback to GViz if payload parsing fails
    }
  }

  // 2. Fallback a Google Sheets GViz si Apps Script no está configurado o falló
  const [prodRes, catRes, cfgRes, banRes, revRes, faqRes] = await Promise.allSettled([
    fetchSheetCsv("Productos"),
    fetchSheetCsv("Categorias"),
    fetchSheetCsv("Configuracion"),
    fetchSheetCsv("Banners"),
    fetchSheetCsv("Resenas"),
    fetchSheetCsv("FAQ")
  ]);

  const prodRows = prodRes.status === "fulfilled" ? parseCSV(prodRes.value) : [];
  const cfgRows = cfgRes.status === "fulfilled" ? parseCSV(cfgRes.value) : [];
  const catRows = catRes.status === "fulfilled" ? parseCSV(catRes.value) : [];
  const banRows = banRes.status === "fulfilled" ? parseCSV(banRes.value) : [];
  const revRows = revRes.status === "fulfilled" ? parseCSV(revRes.value) : [];
  const faqRows = faqRes.status === "fulfilled" ? parseCSV(faqRes.value) : [];

  const products = parseProductsFromRows(prodRows);
  const storeInfo = parseStoreInfoFromRows(cfgRows);
  const categories = parseCategoriesFromRows(catRows);
  const banners = parseBannersFromRows(banRows);
  const reviews = parseReviewsFromRows(revRows, storeInfo.city);
  const faqs = parseFaqsFromRows(faqRows);

  return {
    products: products.length ? products : defaultProducts,
    categories,
    storeInfo,
    banners,
    reviews,
    faqs,
    _source: "gviz_fallback",
    version: Date.now(),
    timestamp: new Date().toISOString()
  };
}

export async function handler(event) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const params = event.queryStringParameters || {};

  // Webhook para invalidar caché inmediatamente desde Google Apps Script
  if (event.httpMethod === "POST") {
    const secret = params.secret || "";
    const expectedSecret = (process.env.REVALIDATE_SECRET || "spartan_secret_2026").trim();

    if (secret === expectedSecret || params.action === "revalidate") {
      memoryCache = null;
      lastFetchTime = 0;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ revalidated: true, message: "Cache cleared successfully" })
      };
    }
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid secret" }) };
  }

  try {
    const now = Date.now();
    const isForce = params.force === "true" || params.bypass === "true" || params.refresh === "true";
    if (isForce || !memoryCache || !memoryCache.products?.length || now - lastFetchTime > CACHE_TTL_MS) {
      memoryCache = await buildCatalogPayload();
      lastFetchTime = now;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(memoryCache)
    };
  } catch (err) {
    console.error("Catalog function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch catalog", message: err.message })
    };
  }
}
