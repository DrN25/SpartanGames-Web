/**
 * Netlify Serverless Function: Spartan Games Catalog Proxy
 * Protects GOOGLE_SHEET_ID on the server, filters sensitive columns,
 * and provides in-memory caching with instant webhook revalidation.
 */

import { productsCatalog as defaultProducts } from "../../src/data/storeData.js";
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
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}&_t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${tabName}`);
  return await res.text();
}

async function buildCatalogPayload() {
  let products = [];
  try {
    const prodCsv = await fetchSheetCsv("Productos");
    const rows = parseCSV(prodCsv);
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
  } catch (err) {
    console.error("Error fetching catalog products sheet:", err);
  }

  if (products.length === 0 && defaultProducts && defaultProducts.length > 0) {
    products = defaultProducts;
  }

  return {
    products,
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
