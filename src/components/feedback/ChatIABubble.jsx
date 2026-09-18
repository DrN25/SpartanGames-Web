import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  RotateCcw,
  Wrench,
  ShoppingCart,
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon
} from "../common/Icons";
import { sendChatMessage, parseBotResponse } from "../../services/aiService";
import { useModalTransition } from "../../hooks/useModalTransition";

/**
 * Tokenizes inline Markdown: bold (**), italic (*), code (`), links ([text](url))
 */
function renderInlineMarkdown(text) {
  if (!text) return null;

  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded font-mono text-[11px] bg-slate-100 dark:bg-black/50 text-amber-700 dark:text-[#FFDE17] border border-slate-200 dark:border-gray-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 dark:text-[#FFDE17] underline font-bold hover:opacity-80 transition-opacity"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function isTableRow(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
}

function isTableSeparator(line) {
  const trimmed = line.trim();
  return /^\|?(\s*:?-+:?\s*\|?)+$/.test(trimmed) && trimmed.includes("-");
}

function parseTableRow(line) {
  const trimmed = line.trim();
  const stripped = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return stripped.split("|").map((cell) => cell.trim());
}

/**
 * Full Markdown Renderer: supports Headings, Tables, Lists, Code Blocks, Quotes, and Paragraphs
 * Colors dynamically optimized for high-contrast visibility in both Light and Dark modes
 */
function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // 1. Code Block: ```
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    // 2. Markdown Table: line has pipes and next line is a separator
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = parseTableRow(line);
      i += 2; // skip header and separator
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // 3. Headings: ###, ##, #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      i++;
      continue;
    }

    // 4. Unordered Lists: -, *, •
    if (/^[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // 5. Ordered Lists: 1., 2., etc.
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // 6. Blockquotes: >
    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.slice(2) });
      i++;
      continue;
    }

    // 7. Regular Paragraph
    blocks.push({ type: "p", text: line });
    i++;
  }

  return (
    <div className={`markdown-body space-y-1.5 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <div
                key={idx}
                className="text-xs font-black mt-3 mb-1.5 text-slate-950 dark:text-[#FFDE17] uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-gray-800"
              >
                {renderInlineMarkdown(block.text)}
              </div>
            );
          }
          if (block.level === 2) {
            return (
              <div
                key={idx}
                className="text-xs font-black mt-2.5 mb-1 text-slate-900 dark:text-amber-400 uppercase tracking-wide"
              >
                {renderInlineMarkdown(block.text)}
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="text-xs font-bold mt-2 mb-0.5 text-slate-900 dark:text-slate-100"
            >
              {renderInlineMarkdown(block.text)}
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={idx}
              className="overflow-x-auto my-3 rounded-xl border border-slate-300 dark:border-gray-800 shadow-xs max-w-full bg-white dark:bg-[#0c1018]"
            >
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-gray-800">
                    {block.headers.map((th, thIdx) => (
                      <th
                        key={thIdx}
                        className="px-2.5 py-1.5 font-black text-slate-950 dark:text-[#FFDE17] whitespace-nowrap"
                      >
                        {renderInlineMarkdown(th)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-gray-800">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? "bg-white dark:bg-[#131923]"
                          : "bg-slate-50/80 dark:bg-[#0f141f]"
                      }
                    >
                      {row.map((td, tdIdx) => (
                        <td
                          key={tdIdx}
                          className="px-2.5 py-1.5 text-slate-800 dark:text-slate-200 whitespace-nowrap font-medium"
                        >
                          {renderInlineMarkdown(td)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "code") {
          return (
            <div
              key={idx}
              className="my-2.5 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto border leading-relaxed bg-[#0b0f17] text-amber-300 border-gray-800 shadow-inner"
            >
              {block.lang && (
                <div className="text-[9px] uppercase font-bold text-slate-500 mb-1 border-b border-gray-800 pb-0.5">
                  {block.lang}
                </div>
              )}
              <pre className="whitespace-pre">{block.code}</pre>
            </div>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={idx} className="my-1.5 pl-4 space-y-1 list-disc text-slate-800 dark:text-slate-200">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={idx} className="my-1.5 pl-4 space-y-1 list-decimal text-slate-800 dark:text-slate-200">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="my-2 pl-3 py-1 border-l-2 border-amber-500 italic text-[11px] bg-amber-500/10 text-slate-800 dark:text-slate-200 rounded-r-lg"
            >
              {renderInlineMarkdown(block.text)}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="my-1 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatIABubble({
  isDarkMode,
  products = [],
  _categories = [],
  storeInfo = {},
  onOpenPCBuilder,
  onOpenLocation,
  onOpenCart,
  onSelectProduct,
  onAddToCart,
  onAddBatchToCart,
  onNavigate,
  isAnyModalOpen = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldRender: shouldRenderChat, isClosing: isClosingChat } = useModalTransition(isOpen, 220);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 420, height: 560 });
  const [addedBatchMap, setAddedBatchMap] = useState({});
  const messagesEndRef = useRef(null);
  const isResizingRef = useRef(false);

  // Automatically minimize chatbot when any modal or drawer is opened
  useEffect(() => {
    if (isAnyModalOpen) {
      setIsOpen(false);
    }
  }, [isAnyModalOpen]);

  const handleBatchAddToCart = (cards = [], messageId = null) => {
    if (!cards || cards.length === 0) return;
    if (onAddBatchToCart) {
      onAddBatchToCart(cards);
    } else if (onAddToCart) {
      cards.forEach((p) => onAddToCart(p));
    }
    if (messageId) {
      setAddedBatchMap((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setAddedBatchMap((prev) => ({ ...prev, [messageId]: false }));
      }, 3500);
    }
    // Automatically hide chatbot window so it does not overlap the CartDrawer
    setIsOpen(false);
  };

  const initialMessage = {
    id: 1,
    sender: "spartan",
    text: "⚔️ ¡Listo para la batalla! Soy SPARTAN. Te asesoro con stock físico, compatibilidad técnica, precios y armado de PC en nuestra tienda de Compuplaza Arequipa. 🛡️ ¿Qué máquina de combate o componente buscas hoy? ⚡",
    time: "Ahora",
    suggestions: [
      "🎮 Tarjetas de video para 1440p",
      "⚡ Procesadores y placas en stock",
      "🛠️ Armar una PC gamer paso a paso",
      "📍 ¿Cómo llegar a Compuplaza Arequipa?",
      "🌐 Redes sociales oficiales de Spartan Games"
    ],
    productCards: [],
    actions: []
  };

  const [messages, setMessages] = useState([initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  /**
   * Resizing logic from top-left corner and borders (invisible, native feel)
   */
  const handleResizeStart = (direction, e) => {
    e.preventDefault();
    if (isMaximized) return;

    isResizingRef.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = dimensions.width;
    const startH = dimensions.height;

    const onPointerMove = (ev) => {
      if (!isResizingRef.current) return;
      const deltaX = startX - ev.clientX;
      const deltaY = startY - ev.clientY;

      const maxW = Math.min(window.innerWidth - 32, 940);
      const maxH = Math.min(window.innerHeight - 100, 900);
      const minW = Math.min(340, window.innerWidth - 32);
      const minH = 380;

      let nextW = startW;
      let nextH = startH;

      if (direction === "both" || direction === "left") {
        nextW = Math.max(minW, Math.min(maxW, startW + deltaX));
      }
      if (direction === "both" || direction === "top") {
        nextH = Math.max(minH, Math.min(maxH, startH + deltaY));
      }

      setDimensions({ width: Math.round(nextW), height: Math.round(nextH) });
    };

    const onPointerUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isTyping) return;

    const userMsgObj = {
      id: Date.now(),
      sender: "user",
      text: userText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg("");
    setIsTyping(true);

    // Conversational Intent: Add quoted products or previous components to cart
    const lowerText = userText.toLowerCase();
    const isAddToCartIntent =
      /(agregar|a[ñn]ad|pon|mete).*(carrito|cotizaci[oó]n|componentes|piezas|todo)|(puedes agregar).*(carrito)/i.test(
        lowerText
      );

    if (isAddToCartIntent) {
      const lastWithProducts = [...messages].reverse().find(
        (m) => m.productCards && m.productCards.length > 0
      );
      if (lastWithProducts && lastWithProducts.productCards.length > 0) {
        handleBatchAddToCart(lastWithProducts.productCards, lastWithProducts.id);
        const totalQuote = lastWithProducts.productCards.reduce(
          (sum, p) => sum + Number(p.price || 0),
          0
        );
        const confirmMsg = {
          id: Date.now() + 1,
          sender: "spartan",
          text: `⚔️ ¡Listo para la batalla! He añadido los **${lastWithProducts.productCards.length} componentes** de tu cotización directamente al carrito de compras (Total: **S/. ${totalQuote.toFixed(2)}**). 🛒\n\nEl carrito de compras se ha abierto a la derecha para que puedas verificar cada pieza, apartarlas con el 10% de seña o exportar la orden oficial hacia WhatsApp para coordinar tu armado o recojo en ${storeInfo?.address || "Calle Octavio Muñoz Najar 223 Int 211 Compuplaza"}. 🛡️⚡`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          productCards: lastWithProducts.productCards,
          actions: [
            {
              type: "whatsapp",
              text: `Hola Spartan Games, tengo cotizados estos componentes en mi carrito: ${lastWithProducts.productCards.map((p) => p.name).join(", ")} por un total de S/. ${totalQuote.toFixed(2)}`,
              label: "Coordinar Reserva por WhatsApp"
            }
          ]
        };
        setMessages((prev) => [...prev, confirmMsg]);
        setIsTyping(false);
        return;
      }
    }

    const chatHistory = messages
      .filter((m) => m.id !== 1)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

    chatHistory.push({ role: "user", content: userText.trim() });

    try {
      const botRawReply = await sendChatMessage({
        messages: chatHistory,
        products,
        storeInfo
      });

      const parsed = parseBotResponse(botRawReply, products);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "spartan",
          text: parsed.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          productCards: parsed.productCards,
          actions: parsed.actions
        }
      ]);
    } catch (err) {
      console.error("Error comunicando con SPARTAN:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "spartan",
          text: "🛡️ En este momento no pude consultar el inventario en vivo. Escríbenos directamente a nuestro WhatsApp oficial para atenderte al instante. ⚡",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: [
            {
              type: "whatsapp",
              text: `Hola Spartan Games, estaba consultando por la web sobre: ${userText}`,
              label: "Consultar por WhatsApp"
            }
          ]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialMessage]);
  };

  const handleProductCardClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      setIsOpen(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.type === "builder" && onOpenPCBuilder) {
      onOpenPCBuilder();
      setIsOpen(false);
    } else if (action.type === "catalog" && onNavigate) {
      onNavigate("catalog");
      setIsOpen(false);
    } else if (action.type === "whatsapp") {
      const phone = storeInfo?.whatsappMain || "51912930004";
      const text = encodeURIComponent(
        action.text || "Hola Spartan Games, tengo una consulta sobre sus productos"
      );
      window.open(`https://api.whatsapp.com/send/?phone=${phone}&text=${text}`, "_blank");
    } else if (action.type === "facebook") {
      window.open("https://facebook.com/spartangamesaqp", "_blank");
    } else if (action.type === "instagram") {
      window.open("https://instagram.com/spartangamesaqp", "_blank");
    } else if (action.type === "tiktok") {
      window.open("https://tiktok.com/@spartangamesaqp", "_blank");
    } else if (action.type === "add_to_cart_batch") {
      const matching = (action.productIds || [])
        .map((id) => products.find((p) => String(p.id) === String(id)))
        .filter(Boolean);
      if (matching.length > 0) {
        handleBatchAddToCart(matching);
      }
    } else if (action.type === "cart") {
      if (onOpenCart) onOpenCart();
      setIsOpen(false);
    } else if (action.type === "maps") {
      if (onOpenLocation) {
        onOpenLocation();
        setIsOpen(false);
      } else {
        window.open(
          "https://maps.app.goo.gl/gVknznGWkkmZHsgL9",
          "_blank"
        );
      }
    }
  };

  const whatsappDirectPhone = storeInfo?.whatsappMain || "51912930004";
  const whatsappDirectUrl = `https://wa.me/${whatsappDirectPhone}?text=Hola%20Spartan%20Games%20Arequipa,%20deseo%20consultar%20disponibilidad%20de%20stock%20y%20proformas.`;

  return (
    <>
      {/* 1. Primary WhatsApp Floating Button */}
      <a
        href={whatsappDirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Contactar por WhatsApp Oficial de Spartan Games"
      >
        <WhatsAppIcon className="w-7 h-7" colored={false} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
        <span className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-800 shadow-xl">
          WhatsApp Oficial Spartan
        </span>
      </a>

      {/* 2. SPARTAN Button */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border-2 shadow-xl transition-all cursor-pointer group ${
            isOpen
              ? "bg-slate-950 border-amber-400 text-white ring-2 ring-amber-400/30"
              : isDarkMode
              ? "bg-[#111620] border-amber-500/50 hover:border-[#FFDE17] text-white hover:scale-105"
              : "bg-slate-950 border-amber-400 text-white hover:scale-105 shadow-amber-500/10"
          }`}
          aria-label={isOpen ? "Cerrar chat SPARTAN" : "Abrir chat SPARTAN"}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FFDE17] p-1 shadow-md ring-2 ring-[#FFDE17]/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/assets/images/spartan_games_logo_base_solo.png"
              alt="SPARTAN Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <div className="text-xs font-black uppercase tracking-wider text-[#FFDE17] leading-none">
              SPARTAN
            </div>
          </div>

          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>
      </div>

      {/* 3. The SPARTAN Window */}
      {shouldRenderChat && (
        <div
          style={{
            width: isMaximized
              ? "min(920px, calc(100vw - 2rem))"
              : `${Math.min(dimensions.width, typeof window !== "undefined" ? window.innerWidth - 24 : 420)}px`,
            height: isMaximized
              ? "calc(100dvh - 110px)"
              : `${Math.min(dimensions.height, typeof window !== "undefined" ? window.innerHeight - 120 : 560)}px`,
            maxWidth: "calc(100vw - 1.5rem)",
            maxHeight: "calc(100dvh - 110px)",
            minWidth: "min(320px, calc(100vw - 1.5rem))",
            minHeight: "340px"
          }}
          className={`fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-50 rounded-3xl border-0 shadow-2xl shadow-black/80 flex flex-col overflow-hidden select-text origin-bottom-right ${
            isClosingChat ? "animate-spartan-chat-exit" : "animate-spartan-chat"
          } ${
            isDarkMode
              ? "bg-[#0B0E14] text-white"
              : "bg-white text-slate-900"
          }`}
        >
          {/* Top Edge Resize Zone (Desktop only) */}
          {!isMaximized && (
            <div
              onPointerDown={(e) => handleResizeStart("top", e)}
              className="hidden sm:block absolute top-0 left-4 right-4 h-2 cursor-ns-resize z-30"
              title="Ajustar altura"
            />
          )}

          {/* Left Edge Resize Zone (Desktop only) */}
          {!isMaximized && (
            <div
              onPointerDown={(e) => handleResizeStart("left", e)}
              className="hidden sm:block absolute top-4 bottom-4 left-0 w-2 cursor-ew-resize z-30"
              title="Ajustar ancho"
            />
          )}

          {/* Top-Left Corner Resize Zone (Desktop only) */}
          {!isMaximized && (
            <div
              onPointerDown={(e) => handleResizeStart("both", e)}
              className="hidden sm:block absolute top-0 left-0 w-5 h-5 cursor-nwse-resize z-40"
              title="Ajustar tamaño"
            />
          )}

          {/* Header */}
          <div className="p-3.5 border-b border-gray-800 bg-slate-950 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#FFDE17] p-0.5 shadow-sm ring-1 ring-[#FFDE17]/60 flex items-center justify-center flex-shrink-0">
                <img
                  src="/assets/images/spartan_games_logo_base_solo.png"
                  alt="SPARTAN"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-sm font-black tracking-widest text-[#FFDE17]">
                SPARTAN
              </span>
              {/* Online indicator green dot */}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="En línea" />
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Maximize/Restore button only on desktop where horizontal expansion makes sense */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMaximized ? "Restaurar tamaño" : "Maximizar ventana"}
                aria-label={isMaximized ? "Restaurar tamaño" : "Maximizar ventana"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar chat"
                aria-label="Reiniciar chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Cerrar ventana"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className={`flex-1 p-3.5 overflow-y-auto space-y-3.5 scroll-smooth ${
              isDarkMode ? "bg-[#0B0E14]" : "bg-[#F8FAFC]"
            }`}
          >
            {messages.map((m) => (
              <div key={m.id} className="space-y-2 animate-spartan-message">
                <div
                  className={`flex items-start gap-2.5 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "spartan" && (
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#FFDE17] p-0.5 shadow-xs ring-1 ring-[#FFDE17]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <img
                        src="/assets/images/spartan_games_logo_base_solo.png"
                        alt="SPARTAN"
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      m.sender === "user"
                        ? isDarkMode
                          ? "bg-[#FFDE17] text-slate-950 font-semibold rounded-tr-xs"
                          : "bg-slate-950 text-white font-semibold rounded-tr-xs"
                        : isDarkMode
                        ? "bg-[#131923] border border-gray-800 text-slate-100 rounded-tl-xs"
                        : "bg-white border border-slate-200 text-slate-900 rounded-tl-xs shadow-xs"
                    }`}
                  >
                    {/* User message is rendered with crisp direct contrast */}
                    {m.sender === "user" ? (
                      <p className="whitespace-pre-wrap font-medium text-inherit leading-relaxed">
                        {m.text}
                      </p>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}

                    {/* Interactive Catalog Product Cards (Up to 10 Cards) */}
                    {m.productCards && m.productCards.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-gray-800">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 flex items-center justify-between">
                          <span>Componentes cotizados ({m.productCards.length})</span>
                          {m.productCards.length > 1 && (
                            <span className="font-mono font-black text-amber-500 dark:text-[#FFDE17]">
                              Total: S/. {m.productCards.reduce((acc, p) => acc + Number(p.price || 0), 0).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                          {m.productCards.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleProductCardClick(p)}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 ${
                                isDarkMode
                                  ? "bg-black/60 border-gray-800 hover:border-amber-400/60 hover:bg-[#151c28]"
                                  : "bg-white border-slate-200 hover:border-amber-400 hover:bg-slate-50 shadow-xs"
                              }`}
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-11 h-11 rounded-lg object-contain bg-slate-50 dark:bg-black/80 p-1 flex-shrink-0"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-black uppercase text-amber-600 dark:text-[#FFDE17]">
                                  {p.brand} • {p.category}
                                </span>
                                <h4 className="font-bold text-xs truncate text-slate-900 dark:text-white">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-black text-[#FF334B]">
                                    S/. {Number(p.price).toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                    Stock: {p.stock}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onAddToCart) onAddToCart(p);
                                  setIsOpen(false);
                                }}
                                className="p-2 rounded-xl bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 cursor-pointer flex-shrink-0 active:scale-95 transition-transform"
                                title="Agregar al carrito"
                                aria-label={`Agregar ${p.name} al carrito`}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Batch Add to Cart Button for all items in the quote */}
                        {m.productCards.length > 1 && (
                          <button
                            onClick={() => handleBatchAddToCart(m.productCards, m.id)}
                            className={`mt-2 w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                              addedBatchMap[m.id]
                                ? "bg-emerald-600 text-white"
                                : isDarkMode
                                ? "bg-[#FFDE17] text-slate-950 hover:bg-yellow-400"
                                : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                              {addedBatchMap[m.id]
                                ? "✓ ¡Cotización agregada al carrito!"
                                : `Agregar los ${m.productCards.length} componentes al carrito`}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Rich Action & Social buttons */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-200/50 dark:border-gray-800">
                        {m.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(act)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              act.type === "whatsapp"
                                ? "bg-[#25D366] text-white hover:bg-emerald-600"
                                : act.type === "builder" || act.type === "cart"
                                ? "bg-[#FFDE17] text-slate-950 hover:bg-yellow-400"
                                : act.type === "facebook"
                                ? "bg-[#1877F2] text-white hover:bg-blue-700"
                                : act.type === "instagram"
                                ? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90"
                                : act.type === "tiktok"
                                ? "bg-black text-white border border-gray-700 hover:border-gray-500"
                                : act.type === "maps"
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-slate-900 text-white dark:bg-gray-800 hover:bg-slate-800"
                            }`}
                          >
                            {act.type === "whatsapp" && (
                              <WhatsAppIcon className="w-3.5 h-3.5" colored={false} />
                            )}
                            {act.type === "builder" && (
                              <Wrench className="w-3.5 h-3.5 text-slate-950" />
                            )}
                            {act.type === "cart" && (
                              <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
                            )}
                            {act.type === "catalog" && (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            {act.type === "facebook" && (
                              <FacebookIcon className="w-3.5 h-3.5" />
                            )}
                            {act.type === "instagram" && (
                              <InstagramIcon className="w-3.5 h-3.5" />
                            )}
                            {act.type === "tiktok" && (
                              <TikTokIcon className="w-3.5 h-3.5" />
                            )}
                            {act.type === "maps" && (
                              <MapPin className="w-3.5 h-3.5" />
                            )}
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] font-mono text-right mt-1.5 ${
                        m.sender === "user"
                          ? isDarkMode
                            ? "text-slate-900/80 font-bold"
                            : "text-slate-300 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>

                {/* Suggestion Chips */}
                {m.suggestions && (
                  <div className="pt-1.5 pl-9">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Consultas frecuentes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.suggestions.map((sugg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sugg)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border text-left transition-all ${
                            isDarkMode
                              ? "bg-[#131923] border-gray-800 hover:border-amber-400 text-gray-300 hover:text-white"
                              : "bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 shadow-xs"
                          }`}
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <span>SPARTAN está procesando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isTyping || !inputMsg.trim()) return;
              handleSendMessage(inputMsg);
            }}
            className={`p-3 border-t flex items-center gap-2 flex-shrink-0 ${
              isDarkMode
                ? "border-gray-800 bg-[#0B0E14]"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="text"
              placeholder={isTyping ? "Escribiendo... Puedes redactar tu siguiente consulta" : "Escribe tu consulta sobre stock, precios o armado..."}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs border outline-none transition-all ${
                isDarkMode
                  ? "bg-[#131923] border-gray-800 text-white placeholder-gray-500 focus:border-[#FFDE17]"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              }`}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isTyping}
              className="p-2 rounded-xl bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-xs font-bold cursor-pointer"
              aria-label="Enviar mensaje"
            >
              {isTyping ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
