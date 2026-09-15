import React, { useEffect, useRef } from 'react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { MapPin, Phone, Mail, Truck, ShieldCheck, BookOpen, Video } from 'lucide-react';
import { STORE_INFO } from '../data/storeData';

export default function Footer() {
  const canvasRef = useRef(null);

  // Subtle interactive particle/light effect replacing heavy Three.js script
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle nodes
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? '#FFDE17' : '#FF334B'
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
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
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer className="relative bg-[#07070a] border-t border-white/10 text-slate-400 text-xs overflow-hidden pt-12 pb-8">
      {/* Background Interactive Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/assets/images/spartan_games_logo_base.png" 
                alt="Spartan Games Logo" 
                className="w-10 h-10 object-contain rounded-full border border-spartan-gold/40"
              />
              <div>
                <span className="font-display font-black text-lg text-white tracking-wider flex items-center gap-1">
                  SPART<span className="text-spartan-gold">Λ</span>N <span className="text-spartan-gold">GΛMES</span>
                </span>
                <span className="text-[10px] text-slate-400 block tracking-widest uppercase">Hardware de Alto Rendimiento</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tu tienda gamer y de cómputo de confianza en Arequipa. Venta de componentes, laptops, monitores y ensambles personalizados con garantía total.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a 
                href={STORE_INFO.socials.facebook} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href={STORE_INFO.socials.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href={STORE_INFO.socials.tiktok} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                title="TikTok"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 text-spartan-gold">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#catalogo" className="hover:text-white transition-colors">Catálogo Completo</a></li>
              <li><a href="#pcbuilder" className="hover:text-white transition-colors">Configurador "Arma tu PC"</a></li>
              <li><a href="#garantia" className="hover:text-white transition-colors">Políticas de Garantía</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Zonas de Delivery en Arequipa</a></li>
            </ul>
          </div>

          {/* Col 3: Métodos y Garantía */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 text-spartan-gold">
              Beneficios Spartan
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-spartan-gold shrink-0" />
                <span>Delivery en Arequipa & Envíos Nacionales</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 Año de Garantía Oficial</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-spartan-red/20 text-spartan-red text-[10px] font-black flex items-center justify-center">10%</span>
                <span>Modalidad Pago por Reserva</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto & Libro de Reclamaciones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 text-spartan-gold">
              Tienda Física & Contacto
            </h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-spartan-red shrink-0 mt-0.5" />
              <span>{STORE_INFO.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-4 h-4 text-spartan-gold shrink-0" />
              <span>WhatsApp: {STORE_INFO.phones.join(' / ')}</span>
            </div>

            {/* Libro de Reclamaciones (Normativa Legal Perú) */}
            <div className="pt-2">
              <a
                href="#libro-reclamaciones"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-spartan-red/20 border border-white/10 hover:border-spartan-red/40 text-slate-300 hover:text-white text-[11px] transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-spartan-red" />
                <span>Libro de Reclamaciones Virtual</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Spartan Games Arequipa. Todos los derechos reservados.</p>
          <p>Desarrollado con arquitectura moderna React + Tailwind + shadcn</p>
        </div>

      </div>
    </footer>
  );
}

