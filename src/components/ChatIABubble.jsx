import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

export default function ChatIABubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola gamer! 👋 Soy el Asistente Virtual IA de Spartan Games Arequipa. ¿En qué te puedo ayudar hoy? (Consultar stock, delivery, recomendaciones para armar tu PC o garantías).'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);

    // Smart simulated responses based on store data
    setTimeout(() => {
      let botReply = 'Contamos con stock disponible para entrega inmediata en nuestra tienda de Compuplaza Arequipa o con servicio de Delivery.';
      const lower = userText.toLowerCase();

      if (lower.includes('delivery') || lower.includes('envio') || lower.includes('envío')) {
        botReply = '¡Sí! Contamos con servicio de DELIVERY en todo Arequipa y envíos a todo el Perú por Shalom y Olva Courier.';
      } else if (lower.includes('pago') || lower.includes('reserva') || lower.includes('tarjeta') || lower.includes('yape')) {
        botReply = 'Aceptamos todas las tarjetas de crédito sin recargo abusivo, además de Yape y Plin. También puedes separar cualquier producto con el 10% de seña.';
      } else if (lower.includes('garantia') || lower.includes('garantía')) {
        botReply = 'Todos nuestros productos tienen hasta 1 año de garantía escrita de fabricante con boleta o factura legal.';
      } else if (lower.includes('pc') || lower.includes('armar') || lower.includes('ensamble')) {
        botReply = 'Puedes usar nuestra herramienta "Arma tu PC" en la barra superior para calcular tu presupuesto en vivo con piezas 100% compatibles.';
      } else if (lower.includes('whatsapp') || lower.includes('humano') || lower.includes('telefono')) {
        botReply = `Puedes hablar de inmediato con un asesor humano en WhatsApp al 912930004 o al 973696367.`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[440px] bg-[#0f0f18] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-fade-in text-white">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#09090f] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-spartan-gold/20 flex items-center justify-center text-spartan-gold border border-spartan-gold/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Spartan AI Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <span className="text-[10px] text-slate-400">En línea | Soporte 24/7</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-spartan-gold text-black font-medium rounded-br-none' 
                    : 'bg-[#181824] text-slate-200 border border-white/5 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-[#181824] border border-white/5 rounded-2xl w-fit text-slate-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-spartan-gold animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-spartan-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-spartan-gold animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[10px]">Spartan AI escribiendo...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-2.5 bg-[#09090f] border-t border-white/10 flex items-center gap-2">
            <input 
              type="text"
              placeholder="Pregunta sobre stock, delivery o precios..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-spartan-gold"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-spartan-gold text-black hover:bg-spartan-goldHover transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Trigger Floating Buttons: Chatbot & WhatsApp */}
      <div className="flex items-center gap-2.5">
        {/* WhatsApp Float */}
        <a
          href={`https://wa.me/51${STORE_INFO.phones[0]}?text=Hola%20Spartan%20Games,%20necesito%20información`}
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-spartan-green hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform hover:scale-110"
          title="WhatsApp Oficial"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>

        {/* AI Bot Float */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-spartan-card hover:bg-spartan-cardHover border border-spartan-gold text-spartan-gold flex items-center justify-center shadow-lg shadow-spartan-gold/20 transition-transform hover:scale-110 cursor-pointer group"
          title="Asistente Virtual Spartan AI"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
        </button>
      </div>
    </div>
  );
}
