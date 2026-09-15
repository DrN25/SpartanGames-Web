import React, { useEffect, useRef } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YapeIcon,
  PlinIcon,
  MapPin,
  Phone,
  Truck,
  ShieldCheck,
  BookOpen
} from "./Icons";
import { storeInfo } from "../data/storeData";

export default function Footer({ isDarkMode, onNavigate }) {
  const canvasRef = useRef(null);

  // Subtle interactive particle lights
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? "#FFDE17" : "#FF334B"
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.4;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer
      className={`relative border-t overflow-hidden transition-colors ${
        isDarkMode ? "bg-[#040609] border-gray-800/80 text-gray-400" : "bg-gray-100 border-gray-300 text-gray-600"
      }`}
    >
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFDE17] p-0.5">
                <img
                  src="/assets/images/spartan_games_logo_base.png"
                  alt="Spartan Games Logo"
                  className="w-full h-full object-cover rounded-[10px] bg-black"
                />
              </div>
              <div>
                <div className="font-black text-lg text-[#FFDE17] leading-none">SPARTAN GAMES</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  Arequipa • Perú
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              {storeInfo.tagline}. Tienda física especializada en hardware de alto nivel para eSports,
              creación de contenido y gaming profesional.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/spartangamesaqp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-center hover:text-[#FFDE17] hover:border-[#FFDE17] transition-all"
                aria-label="Facebook Spartan Games"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/spartangamesaqp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-center hover:text-[#FFDE17] hover:border-[#FFDE17] transition-all"
                aria-label="Instagram Spartan Games"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@spartangamesaqp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-center hover:text-[#FFDE17] hover:border-[#FFDE17] transition-all"
                aria-label="TikTok Spartan Games"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${storeInfo.whatsappMain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-black/40 border border-gray-800 flex items-center justify-center hover:text-[#25D366] hover:border-[#25D366] transition-all"
                aria-label="WhatsApp Spartan Games"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Tienda & Navegación */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 pb-1 border-b border-gray-800">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-[#FFDE17] transition-colors">
                  Inicio / Portada
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("catalog")} className="hover:text-[#FFDE17] transition-colors">
                  Catálogo de Hardware
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("catalog")} className="hover:text-[#FFDE17] transition-colors">
                  Laptops Gamer con Windows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("catalog")} className="hover:text-[#FFDE17] transition-colors">
                  Tarjetas de Video RTX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-[#FFDE17] transition-colors">
                  Arma tu PC Personalizada
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ubicación y Horarios */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 pb-1 border-b border-gray-800">
              Tienda Física Arequipa
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFDE17] flex-shrink-0 mt-0.5" />
                <span>{storeInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFDE17] flex-shrink-0" />
                <span>{storeInfo.phones.join(" / ")}</span>
              </li>
              <li className="text-[11px] text-gray-500 pl-6.5">
                {storeInfo.schedule}
              </li>
            </ul>
          </div>

          {/* Col 4: Libro de Reclamaciones y Medios de Pago */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 pb-1 border-b border-gray-800">
              Seguridad & Legal
            </h4>

            {/* Libro de Reclamaciones INDECOPI */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDarkMode ? "bg-black/40 border-gray-800" : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#FFDE17] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-200">Libro de Reclamaciones</div>
                <div className="text-[10px] text-gray-500">Conforme a Ley INDECOPI</div>
              </div>
            </div>

            {/* Pagos */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-gray-400 mb-2">Medios de Pago:</div>
              <div className="flex items-center gap-2 flex-wrap">
                <YapeIcon />
                <PlinIcon />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-gray-800">
                  Culqi / Visa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} Spartan Games Arequipa. Todos los derechos reservados.
          </div>
          <div className="text-[11px] text-gray-500">
            Desarrollado con alto estándar de ingeniería frontend y arquitectura de componentes accesibles.
          </div>
        </div>
      </div>
    </footer>
  );
}
