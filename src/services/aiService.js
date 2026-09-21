/**
 * AI Service for Spartan Games
 * Integrates OpenRouter using model openai/gpt-5.6-luna
 * Production: Calls Netlify Serverless Function at /api/chat
 * Development: Falls back to direct OpenRouter API call
 */

import { dispatchAction } from "./actionRegistry.js";

/**
 * Builds compact catalog text for the LLM context
 */
function buildCatalogContext(products = []) {
  if (!products || products.length === 0) return "Catálogo en actualización...";

  return products
    .slice(0, 45)
    .map(
      (p) =>
        `- [ID: ${p.id}] ${p.name} | Marca: ${p.brand} | Categoría: ${p.category} | Precio: S/. ${Number(p.price).toFixed(2)}${p.oldPrice ? ` (Antes: S/. ${Number(p.oldPrice).toFixed(2)})` : ""} | Stock: ${p.stock} unid.`
    )
    .join("\n");
}

/**
 * Builds system prompt with enterprise guardrails, store info, emojis, and subtle Spartan personality
 */
export function getStoreTimeContext(storeInfo = {}) {
  const schedule = storeInfo?.schedule || "Lunes a Sábado según horario oficial";
  const address = storeInfo?.address || "";
  const storeName = storeInfo?.name || "la tienda física";
  
  const now = new Date();
  const fullDate = now.toLocaleDateString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  const dayOfWeek = now.toLocaleDateString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long"
  }).toLowerCase();
  
  const time = now.toLocaleTimeString("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  
  const hour24 = parseInt(
    now.toLocaleTimeString("en-US", {
      timeZone: "America/Lima",
      hour: "numeric",
      hour12: false
    }),
    10
  );

  const isSunday = dayOfWeek.includes("domingo");
  
  let storeStatus = "";
  if (isSunday) {
    storeStatus = `${storeName} está cerrada hoy domingo (atendemos consultas y cotizaciones online por WhatsApp).`;
  } else if (hour24 >= 11 && hour24 < 20) {
    storeStatus = `${storeName} ESTÁ ABIERTA en este momento para atención presencial.`;
  } else if (hour24 < 11) {
    storeStatus = `${storeName} abre hoy a las 11:00 am (actualmente atendiendo consultas online).`;
  } else {
    storeStatus = `${storeName} cerró por hoy (reanudamos atención presencial mañana).`;
  }

  return { fullDate, dayOfWeek, time, schedule, address, storeStatus };
}

/**
 * Robustly parses LLM raw text using the Dispatcher Pattern:
 * 1. [PRODUCT:id1, id2, ...] tags -> interactive product cards
 * 2. [ACTION:...] tags -> action buttons via actionRegistry
 * 3. Strips all system tags, orphan bullet points, and leftover brackets
 */
export function parseBotResponse(rawText = "", products = []) {
  let cleanText = String(rawText || "");
  const foundProductIds = [];
  const rawActions = [];

  // 1. Extract [PRODUCT:id1, id2, ...] tags (case-insensitive, whitespace & markdown tolerant)
  const productRegex = /(?:\*{0,2}|`?)\s*\[\s*PRODUCT\s*:\s*([a-zA-Z0-9_,\s-]+)\s*\]\s*(?:\*{0,2}|`?)/gi;
  let prodMatch;
  while ((prodMatch = productRegex.exec(cleanText)) !== null) {
    if (prodMatch[1]) {
      const ids = prodMatch[1].split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
      ids.forEach((id) => foundProductIds.push(id));
    }
  }
  cleanText = cleanText.replace(productRegex, "");

  // 2. Extract [ACTION:COMMAND] or [ACTION:COMMAND:PAYLOAD] via Action Dispatcher
  const actionRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*([a-zA-Z0-9_-]+)(?:\s*:\s*([^\]]+))?\s*\]\s*(?:\*{0,2}|`?)/gi;
  let actMatch;
  while ((actMatch = actionRegex.exec(cleanText)) !== null) {
    const command = actMatch[1];
    const payload = actMatch[2];
    const actionObj = dispatchAction(command, payload);
    if (actionObj) {
      rawActions.push(actionObj);
    }
  }
  cleanText = cleanText.replace(actionRegex, "");

  // 3. SAFETY SCRUB: Strip any remaining unparsed or malformed [ACTION:...] or [PRODUCT:...] tags
  cleanText = cleanText.replace(/(?:\*{0,2}|`?)\s*\[\s*(?:ACTION|PRODUCT|BOTON|BUTTON)\s*:[^\]]*\]\s*(?:\*{0,2}|`?)/gi, "");

  // 4. Clean up orphan list items / bullet points left behind by extracted tags
  cleanText = cleanText
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^[-*•]\s*$/.test(trimmed)) return false;
      if (/^[-*•]?\s*[^:\n]{1,45}:\s*$/.test(trimmed)) {
        if (
          /whatsapp|cat[aá]logo|redes|facebook|instagram|tiktok|ubicaci[oó]n|maps?|proforma|armar|horario/i.test(
            trimmed
          )
        ) {
          return false;
        }
      }
      return true;
    })
    .join("\n")
    .trim();

  // Deduplicate actions while preserving order
  const actions = [];
  const seenActionKeys = new Set();
  for (const act of rawActions) {
    const key = `${act.type}_${act.text || ""}_${(act.productIds || []).join(",")}`;
    if (!seenActionKeys.has(key)) {
      seenActionKeys.add(key);
      actions.push(act);
    }
  }

  // Match found products with actual catalog items (limit to 10 cards max, deduplicated)
  const uniqueProductIds = Array.from(new Set(foundProductIds)).slice(0, 10);
  const productCards = uniqueProductIds
    .map((id) => products.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase()))
    .filter(Boolean);

  return {
    text: cleanText,
    productCards,
    actions
  };
}

/**
 * Sends chat request to Netlify Function (with automatic network error resilience)
 */
export async function sendChatMessage({
  messages,
  products = [],
  storeInfo = {}
}) {
  const catalogContext = buildCatalogContext(products);
  const timeCtx = getStoreTimeContext(storeInfo);
  const storeContext = {
    name: storeInfo?.name || "Spartan Games",
    city: storeInfo?.city || "",
    address: timeCtx.address,
    whatsapp: storeInfo?.whatsappMain,
    phones: storeInfo?.phones,
    schedule: timeCtx.schedule,
    fullDate: timeCtx.fullDate,
    time: timeCtx.time,
    storeStatus: timeCtx.storeStatus,
    facebookUrl: storeInfo?.facebookUrl,
    instagramUrl: storeInfo?.instagramUrl,
    tiktokUrl: storeInfo?.tiktokUrl,
    mapsUrl: storeInfo?.mapsUrl,
    wazeUrl: storeInfo?.wazeUrl
  };

  const endpoints = ["/.netlify/functions/chat", "/api/chat"];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const netlifyRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          catalogContext,
          storeContext
        })
      });

      const contentType = netlifyRes.headers.get("content-type") || "";

      // If Netlify redirected to index.html (HTML instead of JSON), try next endpoint
      if (!contentType.includes("application/json")) {
        console.warn(`[SpartanAI] ${endpoint} returned non-JSON (${contentType}). Trying fallback.`);
        continue;
      }

      const data = await netlifyRes.json();

      if (netlifyRes.ok && data.reply) {
        return data.reply;
      } else {
        lastError = data?.error || `HTTP ${netlifyRes.status}`;
        console.error(`[SpartanAI] Error from ${endpoint} (${netlifyRes.status}):`, data);
      }
    } catch (err) {
      lastError = err.message;
      console.warn(`[SpartanAI] Could not reach ${endpoint}:`, err);
    }
  }

  console.error("[SpartanAI] All chat endpoints failed. Last error:", lastError);
  const waContact = storeInfo?.whatsappMain ? `+${storeInfo.whatsappMain}` : "+51 912 930 004";
  const storeLabel = storeInfo?.name || "Spartan Games";
  return `🛡️ En este momento no pude consultar el inventario en vivo. Escríbenos directamente a nuestro WhatsApp oficial (${waContact}) para atenderte al instante en ${storeLabel}. ⚡`;
}
