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

const GOOGLE_SHEET_ID = (process.env.GOOGLE_SHEET_ID || "1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno").trim();
const CACHE_TTL_MS = 60 * 1000; // 60 segundos de caché en memoria

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

async function fetchSheetCsv(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tabName)}&_t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${tabName}`);
  return await res.text();
}

async function buildCatalogPayload() {
  const [prodRes, catRes, cfgRes, banRes, revRes, faqRes] = await Promise.allSettled([
    fetchSheetCsv("Productos"),
    fetchSheetCsv("Categorias"),
    fetchSheetCsv("Configuracion"),
    fetchSheetCsv("Banners"),
    fetchSheetCsv("Resenas"),
    fetchSheetCsv("FAQ")
  ]);

  // 1. Parse Products
  let products = [];
  if (prodRes.status === "fulfilled") {
    try {
      const rows = parseCSV(prodRes.value);
      if (rows.length > 1) {
        const headers = rows[0].map(normalizeHeader);
        const findCol = (row, aliases) => {
          for (const a of aliases) {
            const idx = headers.indexOf(normalizeHeader(a));
            if (idx !== -1 && row[idx] !== undefined) return row[idx].trim();
          }
          return "";
        };

        products = rows.slice(1).map((r) => {
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
    } catch (e) {
      console.error("Error parsing Productos CSV:", e);
    }
  }
  if (!products.length && defaultProducts?.length) {
    products = defaultProducts;
  }

  // 2. Parse Store Configuration (Key-Value)
  let storeInfo = { ...defaultStoreInfo };
  if (cfgRes.status === "fulfilled") {
    try {
      const rows = parseCSV(cfgRes.value);
      if (rows.length > 1) {
        rows.slice(1).forEach((r) => {
          const rawKey = r[0]?.trim()?.toLowerCase() || "";
          const val = r[1]?.trim();
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
      }
    } catch (e) {
      console.error("Error parsing Configuracion CSV:", e);
    }
  }

  // 3. Parse Categories
  let categories = defaultCategories;
  if (catRes.status === "fulfilled") {
    try {
      const rows = parseCSV(catRes.value);
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

        if (parsedCats.length > 0) categories = parsedCats;
      }
    } catch (e) {
      console.error("Error parsing Categorias CSV:", e);
    }
  }

  // 4. Parse Banners
  let banners = defaultBanners;
  if (banRes.status === "fulfilled") {
    try {
      const rows = parseCSV(banRes.value);
      // Ensure this is not the fallback to default first sheet
      const firstRow = (rows[0] || []).map(normalizeHeader);
      if (rows.length > 1 && (firstRow.includes("titulo") || firstRow.includes("title") || firstRow[0] === "id")) {
        const parsedBanners = rows.slice(1).map((r, idx) => {
          const id = r[0]?.trim() || `banner-${idx + 1}`;
          const title = r[1]?.trim();
          const subtitle = r[2]?.trim() || "";
          const tag = r[3]?.trim() || "OFERTA";
          const image = normalizeImageUrl(r[4]?.trim());
          const actionType = r[5]?.trim() || "category";
          const ctaText = r[6]?.trim() || "Ver Más";
          const actionTarget = r[7]?.trim() || "";
          const active = r[8] !== undefined && r[8] !== "" ? ["SI", "TRUE", "1", "YES"].includes(String(r[8]).trim().toUpperCase()) : true;
          return { id, title, subtitle, tag, image, actionType, ctaText, actionTarget, active };
        }).filter((b) => b.title && b.active);

        if (parsedBanners.length > 0) banners = parsedBanners;
      }
    } catch (e) {
      console.error("Error parsing Banners CSV:", e);
    }
  }

  // 5. Parse Reviews
  let reviews = defaultReviews;
  if (revRes.status === "fulfilled") {
    try {
      const rows = parseCSV(revRes.value);
      const firstRow = (rows[0] || []).map(normalizeHeader);
      if (rows.length > 1 && (firstRow.includes("cliente") || firstRow.includes("name") || firstRow.includes("comentario"))) {
        const parsedReviews = rows.slice(1).map((r, idx) => ({
          id: r[0]?.trim() || idx + 1,
          name: r[1]?.trim() || "Cliente",
          city: r[2]?.trim() || storeInfo.city || "Arequipa",
          role: r[3]?.trim() || "Cliente Verificado",
          purchase: r[4]?.trim() || "Compra Verificada",
          rating: parseFloat(r[5]) || 5,
          comment: r[6]?.trim() || "",
          image: normalizeImageUrl(r[7]?.trim() || ""),
          badge: r[8]?.trim() || "Compra Verificada"
        })).filter(rev => rev.comment && rev.name);

        if (parsedReviews.length > 0) reviews = parsedReviews;
      }
    } catch (e) {
      console.error("Error parsing Resenas CSV:", e);
    }
  }

  // 6. Parse FAQs
  let faqs = defaultFaqs;
  if (faqRes.status === "fulfilled") {
    try {
      const rows = parseCSV(faqRes.value);
      const firstRow = (rows[0] || []).map(normalizeHeader);
      if (rows.length > 1 && (firstRow.includes("pregunta") || firstRow.includes("question") || firstRow.includes("categoria"))) {
        const rawItems = rows.slice(1).map((r) => ({
          category: r[0]?.trim() || "General",
          q: r[1]?.trim() || "",
          a: r[2]?.trim() || ""
        })).filter(f => f.q && f.a);

        if (rawItems.length > 0) {
          const grouped = {};
          rawItems.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push({ q: item.q, a: item.a });
          });
          faqs = Object.entries(grouped).map(([category, items]) => ({ category, items }));
        }
      }
    } catch (e) {
      console.error("Error parsing FAQ CSV:", e);
    }
  }

  return {
    products,
    categories,
    storeInfo,
    banners,
    reviews,
    faqs,
    version: Date.now(),
    timestamp: new Date().toISOString()
  };
}

export async function handler(event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Webhook para invalidar caché inmediatamente desde Google Apps Script
  if (event.httpMethod === "POST") {
    const params = event.queryStringParameters || {};
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
    if (!memoryCache || !memoryCache.products?.length || now - lastFetchTime > CACHE_TTL_MS) {
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
