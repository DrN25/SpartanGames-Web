import React, { useState } from "react";
import { Bot, X, Send, Sparkles, MessageCircle } from "./Icons";
import { storeInfo } from "../data/storeData";

export default function ChatIABubble({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "¡Hola gamer! ⚔️ Soy el Asistente Virtual Spartan Games Arequipa. ¿En qué te puedo asesorar hoy? (Disponibilidad de stock, cotizaciones de PC, pagos con Yape/Plin o envíos express)."
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg = { id: Date.now(), sender: "user", text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply =
        "Contamos con stock físico disponible para entrega inmediata en nuestra tienda de C.C. Compuplaza Tienda 204 o con servicio de Delivery express en Arequipa.";
      const lower = userText.toLowerCase();

      if (lower.includes("delivery") || lower.includes("envio") || lower.includes("envío")) {
        botReply =
          "¡Sí! Contamos con servicio de DELIVERY propio en todo Arequipa Metropolitana y despachos asegurados a provincias del Sur por Shalom y Olva Courier.";
      } else if (
        lower.includes("pago") ||
        lower.includes("reserva") ||
        lower.includes("tarjeta") ||
        lower.includes("yape") ||
        lower.includes("plin")
      ) {
        botReply =
          "Aceptamos Yape, Plin, transferencias directas y tarjetas de crédito con Culqi. Además, puedes reservar cualquier componente con el 10% de seña y pagar el saldo al retirar en tienda.";
      } else if (lower.includes("garantia") || lower.includes("garantía")) {
        botReply =
          "Todos nuestros componentes y laptops cuentan con garantía física local de 1 a 3 años y entrega de boleta o factura con RUC.";
      } else if (lower.includes("pc") || lower.includes("armar") || lower.includes("ensamble")) {
        botReply =
          "Puedes usar el botón 'Arma tu PC' en la barra superior para cotizar tu ensamble paso a paso con piezas compatibles y presupuesto en Soles.";
      } else if (lower.includes("whatsapp") || lower.includes("humano") || lower.includes("telefono")) {
        botReply = `Puedes escribirnos directamente a nuestro WhatsApp oficial: ${storeInfo.phones[0]} para atención humana inmediata con un asesor técnico.`;
      }

      setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-80 sm:w-96 rounded-3xl border shadow-2xl overflow-hidden flex flex-col mb-4 animate-fadeIn ${
            isDarkMode
              ? "bg-[#0E121A] border-gray-800 text-white"
              : "bg-white border-gray-200 text-gray-900 shadow-2xl"
          }`}
          style={{ height: "460px" }}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? "border-gray-800 bg-[#111620]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFDE17] text-black flex items-center justify-center font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span>Asistente Spartan IA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-gray-400">En línea • Compuplaza AQP</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#FFDE17] text-black font-semibold rounded-br-none shadow-md"
                      : isDarkMode
                      ? "bg-gray-800/80 text-gray-200 rounded-bl-none border border-gray-700/50"
                      : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs pl-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFDE17] animate-spin" />
                <span>Spartan IA está escribiendo...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className={`p-3 border-t flex items-center gap-2 ${
              isDarkMode ? "border-gray-800 bg-[#111620]" : "border-gray-200 bg-gray-50"
            }`}
          >
            <input
              type="text"
              placeholder="Pregunta sobre stock, delivery o precios..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs border outline-none ${
                isDarkMode
                  ? "bg-black/40 border-gray-800 text-white placeholder-gray-500 focus:border-[#FFDE17]"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black"
              }`}
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#FFDE17] text-black hover:bg-yellow-400 transition-colors flex-shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FFDE17] to-amber-300 text-black shadow-xl shadow-yellow-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
        aria-label="Abrir asistente virtual"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF334B] border-2 border-black" />
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-800 shadow-xl">
          ¿Dudas sobre hardware? Chatea aquí
        </span>
      </button>
    </div>
  );
}
