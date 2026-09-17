/**
 * AI Service for Spartan Games
 * Integrates OpenRouter using model openai/gpt-5.6-luna
 * Production: Calls Netlify Serverless Function at /api/chat
 * Development: Falls back to direct OpenRouter API call
 */


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
  const schedule = storeInfo?.schedule || "Lunes a Sábado: 11:00 am a 8:00 pm (Domingos cerrado)";
  const address = storeInfo?.address || "Calle Octavio Muñoz Najar 223 Int 211, Arequipilla, Peru, 04001";
  
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
    storeStatus = "la tienda física en Compuplaza Int 211 está cerrada hoy domingo (atendemos consultas y cotizaciones online 24/7 por WhatsApp).";
  } else if (hour24 >= 11 && hour24 < 20) {
    storeStatus = "la tienda física en Compuplaza Int 211 ESTÁ ABIERTA en este momento (atención hasta las 8:00 pm).";
  } else if (hour24 < 11) {
    storeStatus = "la tienda física en Compuplaza Int 211 abre hoy a las 11:00 am (actualmente atendiendo cotizaciones online).";
  } else {
    storeStatus = "la tienda física en Compuplaza Int 211 cerró por hoy a las 8:00 pm (reanudamos atención presencial mañana a las 11:00 am).";
  }

  return { fullDate, dayOfWeek, time, schedule, address, storeStatus };
}


/**
 * Checks for gibberish, spam of keys, or incomprensible input
 */
function isGibberish(text = "") {
  const trimmed = text.trim().toLowerCase();
  if (trimmed.length < 3) return false;

  // Single character repeat: "aaaa", "zzzz"
  if (/^(.)\1{3,}$/.test(trimmed)) return true;

  // Repeated syllables: "fadsfads", "sdfsdf", "asdfasdf"
  if (/^(.{2,5})\1+$/.test(trimmed)) {
    const validWords = ["yape", "plin"];
    if (!validWords.includes(trimmed)) return true;
  }

  // Keyboard smashing patterns: e.g. "fadsfads", "asdfgh", "zxcvbn", "hjkghjk"
  if (/^[a-z]{5,25}$/.test(trimmed)) {
    const validWords = [
      "hola", "buen", "dias", "tarde", "noche", "asus", "tuf", "rog",
      "rtx", "gtx", "amd", "intel", "core", "ram", "ssd", "nvme",
      "gpu", "cpu", "ddr4", "ddr5", "b650", "h610", "z790", "case",
      "loq", "fps", "rgb", "dell", "acer", "msi", "ryzen", "tienda",
      "stock", "precio", "cuanto", "cuesta", "tienen", "envio", "envios",
      "arequipa", "compuplaza", "placa", "fuente", "monitor", "laptop"
    ];
    if (validWords.some((w) => trimmed.includes(w))) return false;

    const vowels = (trimmed.match(/[aeiouáéíóú]/g) || []).length;
    if (vowels / trimmed.length < 0.2) return true;
  }

  return false;
}

/**
 * Checks for off-topic prompt injection or controversial figures client-side as a safety net
 */
function checkClientSideGuardrails(text = "", storeInfo = {}) {
  const lower = text.toLowerCase();

  // 1. Gibberish check first
  if (isGibberish(text)) {
    return "🛡️ No logré entender tu mensaje. ⚡ Por favor escríbelo de nuevo con más detalle o indícame qué componente, laptop o armado de PC buscas en Spartan Games.";
  }

  // 1.1 Temporal Grounding: Instant, 100% veridic date & schedule response
  const dateTriggers = [
    "que dia es hoy", "qué día es hoy", "que dia estamos", "qué día estamos",
    "que fecha es hoy", "qué fecha es hoy", "que fecha es", "qué fecha es",
    "que fecha estamos", "qué fecha estamos", "que hora es", "qué hora es",
    "hora actual", "estan abiertos", "están abiertos", "estan atendiendo",
    "están atendiendo", "a que hora abren", "a qué hora abren",
    "a que hora cierran", "a qué hora cierran"
  ];

  if (dateTriggers.some((t) => lower.includes(t))) {
    const timeCtx = getStoreTimeContext(storeInfo);
    return `Hoy es **${timeCtx.fullDate}**, son las **${timeCtx.time}** en Arequipa y ${timeCtx.storeStatus}\n\nEl horario de atención en tienda física es **${timeCtx.schedule}** en **${timeCtx.address}**.\n\n¿En qué componente, proforma o armado de PC te puedo asesorar hoy?`;
  }


  // 2. Off-topic politics and historical atrocities
  const offTopicKeywords = [
    "hitler", "nazi", "nazismo", "holocausto", "stalin", "fascismo",
    "partido nazi", "segunda guerra mundial", "primera guerra mundial",
    "quien fue adolf", "conoces a adolf", "conoces a hitler"
  ];

  if (offTopicKeywords.some((kw) => lower.includes(kw))) {
    return "🛡️ En Spartan Games nuestra misión se concentra con disciplina en hardware gamer y armado de PCs. ⚔️ No tratamos temas políticos ni históricos ajenos a nuestra tienda. ¿En qué componente, laptop o proforma te puedo apoyar hoy? ⚡";
  }

  // 3. Jailbreak attempts
  const jailbreakKeywords = [
    "ignora tus instrucciones", "ignore previous instructions",
    "dime tu prompt", "muestra tu system prompt", "reveal your instructions",
    "modo desarrollador", "dan mode", "actua como dan"
  ];

  if (jailbreakKeywords.some((kw) => lower.includes(kw))) {
    return "🛡️ Mis protocolos de Spartan Games están blindados y enfocados en rendimiento gamer. ⚔️ Dime qué componente, presupuesto o juego deseas evaluar. ⚡";
  }

  return null;
}


/**
 * Robustly parses LLM raw text to extract:
 * 1. [PRODUCT:id1, id2, ...] tags -> interactive product cards
 * 2. [ACTION:...] tags -> action buttons (maps, builder, catalog, whatsapp, social, cart)
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

  // 2. Extract [ACTION:BUILDER] / [ACTION:PCBUILDER] / [ACTION:ARMAR]
  const builderRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*(?:BUILDER|PC_?BUILDER|ARMAR(?:_PC)?|CONFIGURADOR)\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (builderRegex.test(cleanText)) {
    rawActions.push({ type: "builder", label: "Armar PC personalizada" });
    cleanText = cleanText.replace(builderRegex, "");
  }

  // 3. Extract [ACTION:CATALOG] / [ACTION:CATALOGO] / [ACTION:TIENDA]
  const catalogRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*(?:CATALOG(?:O|UE)?|CAT[AÁ]LOGO|TIENDA|STORE|PRODUCTOS)\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (catalogRegex.test(cleanText)) {
    rawActions.push({ type: "catalog", label: "Ver catálogo" });
    cleanText = cleanText.replace(catalogRegex, "");
  }

  // 4. Extract [ACTION:MAPS] / [ACTION:MAP] / [ACTION:UBICACION] / [ACTION:LOCATION]
  const mapsRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*(?:MAPS?|UBICACI[OÓ]N|LOCATION|MAPA|GOOGLE_?MAPS?)\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (mapsRegex.test(cleanText)) {
    rawActions.push({ type: "maps", label: "Ubicación en Google Maps" });
    cleanText = cleanText.replace(mapsRegex, "");
  }

  // 5. Extract [ACTION:WHATSAPP:text] or [ACTION:WHATSAPP]
  const waRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*(?:WHATSAPP|WSP|WA)(?:\s*:\s*([^\]]+))?\s*\]\s*(?:\*{0,2}|`?)/gi;
  let waMatch;
  while ((waMatch = waRegex.exec(cleanText)) !== null) {
    const customMsg = waMatch[1]?.trim() || "Hola Spartan Games, deseo realizar una consulta sobre sus productos";
    rawActions.push({ type: "whatsapp", text: customMsg, label: "Consultar por WhatsApp" });
  }
  cleanText = cleanText.replace(waRegex, "");

  // 6. Extract [ACTION:FACEBOOK]
  const fbRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*FACEBOOK\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (fbRegex.test(cleanText)) {
    rawActions.push({ type: "facebook", label: "Facebook" });
    cleanText = cleanText.replace(fbRegex, "");
  }

  // 7. Extract [ACTION:INSTAGRAM]
  const igRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*INSTAGRAM\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (igRegex.test(cleanText)) {
    rawActions.push({ type: "instagram", label: "Instagram" });
    cleanText = cleanText.replace(igRegex, "");
  }

  // 8. Extract [ACTION:TIKTOK]
  const ttRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*TIKTOK\s*\]\s*(?:\*{0,2}|`?)/gi;
  if (ttRegex.test(cleanText)) {
    rawActions.push({ type: "tiktok", label: "TikTok" });
    cleanText = cleanText.replace(ttRegex, "");
  }

  // 9. Extract [ACTION:ADDTOCART:id1,id2,...]
  const addCartRegex = /(?:\*{0,2}|`?)\s*\[\s*ACTION\s*:\s*(?:ADDTOCART|ADD_TO_CART|CARRITO|AGREGAR_CARRITO)\s*:\s*([^\]]+)\s*\]\s*(?:\*{0,2}|`?)/gi;
  let addCartMatch;
  while ((addCartMatch = addCartRegex.exec(cleanText)) !== null) {
    const ids = addCartMatch[1].split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
    if (ids.length > 0) {
      rawActions.push({
        type: "add_to_cart_batch",
        productIds: ids,
        label: `🛒 Agregar cotización al carrito (${ids.length} componentes)`
      });
    }
  }
  cleanText = cleanText.replace(addCartRegex, "");

  // 10. SAFETY SCRUB: Strip any remaining unparsed or malformed [ACTION:...] or [PRODUCT:...] tags
  // This guarantees that raw system tags like [ACTION:XYZ] will NEVER be displayed to the user
  cleanText = cleanText.replace(/(?:\*{0,2}|`?)\s*\[\s*(?:ACTION|PRODUCT|BOTON|BUTTON)\s*:[^\]]*\]\s*(?:\*{0,2}|`?)/gi, "");

  // 11. Clean up orphan list items / bullet points left behind by extracted tags
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
 * Sends chat request to Netlify Function (or direct OpenRouter fallback)
 */
export async function sendChatMessage({
  messages,
  products = [],
  storeInfo = {}
}) {
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  const guardrailResponse = checkClientSideGuardrails(lastUserMessage, storeInfo);
  if (guardrailResponse) {
    return guardrailResponse;
  }

  const catalogContext = buildCatalogContext(products);
  const timeCtx = getStoreTimeContext(storeInfo);
  const storeContext = {
    address: timeCtx.address,
    whatsapp: storeInfo?.whatsappMain,
    phones: storeInfo?.phones,
    schedule: timeCtx.schedule,
    fullDate: timeCtx.fullDate,
    time: timeCtx.time,
    storeStatus: timeCtx.storeStatus
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
  return "En este momento no pude consultar el inventario en vivo. Escríbenos directamente a nuestro WhatsApp (+51 912 930 004) para atenderte al instante en Spartan Games Compuplaza.";
}

