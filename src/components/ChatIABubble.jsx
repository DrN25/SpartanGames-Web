import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ShieldCheck,
  Truck,
  Cpu,
  Flame,
  Wrench
} from "./Icons";
import { WhatsAppIcon } from "./Icons";
import { storeInfo } from "../data/storeData";

export default function ChatIABubble({ isDarkMode, onOpenPCBuilder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessage = {
    id: 1,
    sender: "spartan",
    text: "¡Saludos, guerrero! Soy SPARTAN, tu asesor táctico de hardware en Compuplaza Arequipa. Dime qué batalla vas a librar (gaming competitivo, renderizado o streaming) y te guiaré con el arsenal exacto para tu presupuesto.",
    time: "Ahora",
    suggestions: [
      "⚔️ Recomiéndame una PC para jugar en 1440p",
      "🛵 ¿Cómo funcionan los envíos en Arequipa?",
      "💳 ¿Cómo pagar con Yape o reservar con 10%?",
      "🛡️ ¿Qué garantía física tienen en tienda?",
      "📍 ¿Cuál es su horario en Compuplaza Tienda 204?"
    ]
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

  const processQuery = (userText) => {
    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botReply =
        "Contamos con stock físico disponible para entrega inmediata en nuestro cuartel de C.C. Compuplaza Tienda 204 o con delivery express en toda Arequipa.";
      let actionType = null;

      if (lower.includes("1440p") || lower.includes("recomiendame") || lower.includes("jugar") || lower.includes("fps") || lower.includes("fortnite") || lower.includes("warzone")) {
        botReply =
          "Para dominar en 1440p a más de 120 FPS te recomiendo la combinación de Ryzen 7 7800X3D o Ryzen 5 7600X con una RTX 4070 Ti SUPER 16GB y 32GB RAM DDR5 a 6000MHz. Puedes armar la configuración exacta en nuestro configurador de PC o consultarnos por WhatsApp para apartar los componentes.";
        actionType = "builder";
      } else if (lower.includes("delivery") || lower.includes("envio") || lower.includes("envío") || lower.includes("despacho")) {
        botReply =
          "Realizamos delivery express propio y seguro en Arequipa Metropolitana (Cercado, Yanahuara, Cayma, JLByR, Cerro Colorado, Paucarpata). A provincias del Sur (Cusco, Puno, Moquegua, Tacna y Lima) despachamos el mismo día por Shalom u Olva Courier con código de seguimiento y seguro de carga.";
        actionType = "whatsapp";
      } else if (
        lower.includes("pago") ||
        lower.includes("reserva") ||
        lower.includes("tarjeta") ||
        lower.includes("yape") ||
        lower.includes("plin") ||
        lower.includes("cuotas")
      ) {
        botReply =
          "Aceptamos Yape y Plin sin comisión, transferencias directas a cuentas BCP/Interbank/BBVA y tarjetas Visa/Mastercard vía Culqi. Además, puedes reservar cualquier pieza con solo el 10% de seña y abonar el saldo al retirar en Compuplaza Tienda 204.";
        actionType = "whatsapp";
      } else if (lower.includes("garantia") || lower.includes("garantía") || lower.includes("falla") || lower.includes("soporte")) {
        botReply =
          "En Spartan Games el honor es ley: todos nuestros componentes y laptops son 100% nuevos en caja sellada con garantía física local directa de 12 a 36 meses. Emitimos boleta o factura con RUC oficial.";
      } else if (lower.includes("pc") || lower.includes("armar") || lower.includes("ensamble") || lower.includes("proforma") || lower.includes("cotiz")) {
        botReply =
          "El ensamble es completamente GRATUITO en la compra de tu equipo completo. Incluye gestión de cables, instalación de Windows 11 activado y pruebas de estrés térmico en nuestro taller de Compuplaza.";
        actionType = "builder";
      } else if (lower.includes("horario") || lower.includes("ubicacion") || lower.includes("donde") || lower.includes("tienda") || lower.includes("compuplaza")) {
        botReply = `Nuestra tienda física está ubicada en ${storeInfo.address}. Atendemos de ${storeInfo.schedule}. Ven a visitarnos para ver componentes y monitores en exhibición.`;
        actionType = "whatsapp";
      } else if (lower.includes("humano") || lower.includes("asesor") || lower.includes("telefono") || lower.includes("whatsapp")) {
        botReply = `Escríbenos directamente a la línea de WhatsApp oficial de Spartan Games: ${storeInfo.phones[0]} para coordinar proforma y despacho con un especialista.`;
        actionType = "whatsapp";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "spartan",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: actionType
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const text = inputMsg.trim();
    setInputMsg("");
    processQuery(text);
  };

  const handleSuggestionClick = (suggestion) => {
    processQuery(suggestion);
  };

  const handleReset = () => {
    setMessages([initialMessage]);
  };

  const whatsappDirectUrl = `https://wa.me/${storeInfo.whatsappMain}?text=Hola%20Spartan%20Games%20Arequipa,%20vengo%20del%20asistente%20SPARTAN%20y%20deseo%20consultar%20disponibilidad%20de%20stock.`;

  return (
    <>
      {/* 1. Primary WhatsApp Floating Button (Prioridad #1: Esquina inferior derecha fija) */}
      <a
        href={whatsappDirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Contactar por WhatsApp Oficial de Spartan Games"
      >
        <WhatsAppIcon className="w-7 h-7" colored={false} />
        {/* Pulsing notification rings */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
        
        {/* Tooltip */}
        <span className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-950 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-800 shadow-xl">
          WhatsApp Oficial Spartan
        </span>
      </a>

      {/* 2. SPARTAN Tactical Advisor Button (Directamente encima del WhatsApp con Isotipo Oficial) */}
      <div className="fixed bottom-22 sm:bottom-24 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border-2 shadow-xl transition-all cursor-pointer group ${
            isOpen
              ? "bg-slate-950 border-amber-400 text-white ring-2 ring-amber-400/30"
              : isDarkMode
              ? "bg-[#111620] border-amber-500/50 hover:border-[#FFDE17] text-white hover:scale-105"
              : "bg-slate-950 border-amber-400 text-white hover:scale-105 shadow-amber-500/10"
          }`}
          aria-label={isOpen ? "Cerrar asesor SPARTAN" : "Consultar a SPARTAN Asesor de Hardware"}
        >
          {/* Official Spartan Helmet Emblem Icon */}
          <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/60 p-1 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:border-amber-400 transition-colors">
            <img
              src="/assets/images/spartan_games_logo_base_solo.png"
              alt="SPARTAN Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FFDE17] leading-none">
              SPARTAN
            </div>
            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tight leading-none mt-0.5">
              Asesor IA
            </div>
          </div>

          {/* Tactical Online Indicator */}
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>

        {/* 3. The SPARTAN Hardware Advisor Window */}
        {isOpen && (
          <div
            className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col animate-fadeIn ${
              isDarkMode
                ? "bg-[#0B0E14] border-gray-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
            style={{ height: "530px", maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header: Branded SPARTAN Tactical Advisor */}
            <div
              className={`px-5 py-3.5 border-b flex items-center justify-between ${
                isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-800 bg-slate-950 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/70 p-1 shadow-sm flex-shrink-0">
                  <img
                    src="/assets/images/spartan_games_logo_base_solo.png"
                    alt="SPARTAN Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-black text-xs uppercase tracking-wider text-[#FFDE17] flex items-center gap-1.5">
                    <span>SPARTAN</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-normal capitalize">
                      • Asesor de Hardware
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className={`text-[10px] ${isDarkMode ? "text-gray-400" : "text-slate-300"}`}>
                    C.C. Compuplaza Tienda 204 • Arequipa
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title="Reiniciar asesoría"
                  aria-label="Reiniciar asesoría"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                  aria-label="Cerrar ventana SPARTAN"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.sender === "spartan" && (
                      <div className="w-7 h-7 rounded-lg bg-black border border-amber-400/40 p-0.5 mr-2 flex-shrink-0 mt-0.5">
                        <img
                          src="/assets/images/spartan_games_logo_base_solo.png"
                          alt="Spartan"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                        m.sender === "user"
                          ? "bg-slate-900 text-white dark:bg-[#FFDE17] dark:text-slate-950 font-medium rounded-br-xs shadow-xs"
                          : isDarkMode
                          ? "bg-[#161D2A] text-gray-200 border border-gray-800 rounded-bl-xs"
                          : "bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <p>{m.text}</p>

                      {/* Action buttons inside response */}
                      {m.action === "whatsapp" && (
                        <a
                          href={whatsappDirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#25D366] text-white hover:bg-emerald-600 transition-colors shadow-xs"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>Abrir WhatsApp con Asesor de Tienda</span>
                        </a>
                      )}

                      {m.action === "builder" && onOpenPCBuilder && (
                        <button
                          onClick={() => {
                            onOpenPCBuilder();
                            setIsOpen(false);
                          }}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#FFDE17] text-slate-950 hover:bg-yellow-400 transition-colors shadow-xs"
                        >
                          <Wrench className="w-3.5 h-3.5 text-slate-950" />
                          <span>Configurar PC Paso a Paso</span>
                        </button>
                      )}

                      <div
                        className={`text-[9px] font-mono text-right mt-1.5 ${
                          m.sender === "user"
                            ? isDarkMode ? "text-slate-700" : "text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {m.suggestions && (
                    <div className="pt-2 pl-9">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-[#FFDE17] mb-2 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-500" />
                        <span>Arsenal de Consultas Rápidas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sugg, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(sugg)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border text-left transition-all ${
                              isDarkMode
                                ? "bg-black/40 border-gray-800 hover:border-amber-400 text-gray-300 hover:text-white"
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
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-xs pl-9">
                  <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <span>SPARTAN está forjando la respuesta...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSend}
              className={`p-3 border-t flex items-center gap-2 ${
                isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
              }`}
            >
              <input
                type="text"
                placeholder="Pregunta a SPARTAN sobre GPUs, armado, stock..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs border outline-none transition-all ${
                  isDarkMode
                    ? "bg-black/40 border-gray-800 text-white placeholder-gray-500 focus:border-[#FFDE17]"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                }`}
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="p-2 rounded-xl bg-[#FFDE17] hover:bg-yellow-400 text-slate-950 disabled:opacity-40 transition-colors flex-shrink-0 shadow-xs font-bold"
                aria-label="Enviar consulta a SPARTAN"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
