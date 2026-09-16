# Spartan Games — Design System & Architecture Guide

> **Sistema Web y Catálogo E-Commerce de Alto Rendimiento**  
> **Ubicación:** Calle Octavio Muñoz Najar 223 Int 211, Compuplaza, Arequipa, Perú  
> **Stack:** React 19 + Vite 8 + TailwindCSS + Lucide Icons + Google Sheets Headless CMS  
> **Estándar Visual:** Zero AI Slop · Micro-animaciones fluidas (60/120 FPS) · Paleta Táctica Gamer  

---

## 1. Filosofía de Diseño & Principios de Marca

1. **Precisión Táctica y Rendimiento (Tactical Spartan):**  
   Inspirado en la potencia del hardware competitivo y la disciplina espartana. Los elementos visuales comunican solidez, velocidad y confiabilidad técnica.
2. **Cero "AI Slop" (No AI Slop):**  
   - Prohibido el uso de emojis decorativos sueltos en encabezados, botones o fichas de catálogo.
   - Toda la iconografía se construye con vectores SVG oficiales (Yape, Plin, Culqi, Visa) y la librería estándar de **Lucide React**.
   - Tipografía limpia, datos técnicos concretos y redacción directa sin frases de relleno.
3. **Comercio Fluido & Contextual:**  
   - Tarjetas de producto interactivas: un solo clic en la tarjeta redirige inmediatamente a la ficha técnica detallada.
   - Cotizaciones instantáneas por WhatsApp con formato estructurado de proforma.
   - Opción de "Pago por Reserva (10%)" claramente calculada en el carrito de compras.
4. **Contornos Impecables (Sin bordes blancos no deseados):**  
   - Todos los modales y ventanas emergentes (`FaqModal`, `LocationModal`, `PCBuilderModal`, `ChatIABubble`) implementan `border-0` y sombras profundas difuminadas (`shadow-2xl shadow-black/90`), eliminando cualquier contorno blanco o línea rígida que desentone con el fondo oscuro.

---

## 2. Paleta de Colores & Tokens Semánticos

### 2.1 Colores Principales (Core Palette)

| Nombre del Token | Valor Hex | Rol Semántico | Aplicación en la Interfaz |
| :--- | :---: | :--- | :--- |
| `--spartan-gold` | `#FFDE17` | Acento Primario / Acción | Botones principales, precios destacados, badges VIP y bordes activos. |
| `--spartan-gold-hover`| `#E5C713` | Hover de Acento | Estado hover en botones de compra y llamadas a la acción. |
| `--bg-canvas-dark` | `#07090D` | Fondo Profundo (Dark) | Canvas base de la aplicación en modo oscuro. |
| `--bg-surface-dark`| `#0B0E14` | Superficie (Dark) | Navbar, modales, footer y contenedores elevados. |
| `--bg-card-dark` | `#111620` | Tarjetas & Paneles (Dark)| Tarjetas de productos, celdas de categorías y campos de entrada. |
| `--bg-card-hover` | `#18202F` | Hover de Tarjeta (Dark) | Elevación interactiva de tarjetas en catálogo. |
| `--bg-canvas-light`| `#F8FAFC` | Canvas Base (Light) | Fondo general limpio en modo diurno. |
| `--bg-surface-light`| `#FFFFFF`| Superficie (Light) | Fondo de navbar, modales y tarjetas en modo diurno. |
| `--spartan-red` | `#FF334B` | Alerta & Ofertas | Precios en oferta, alertas de stock bajo (`≤ 4 unid.`) y badges de descuento. |
| `--spartan-emerald`| `#25D366` | WhatsApp & Verificación | Botones de WhatsApp, badges de stock físico y estados de éxito. |

### 2.2 Medios de Pago Oficiales (SVG Brand Vectors)

| Medio de Pago | Color Dominante | Vector / Componente | Aplicación |
| :--- | :---: | :--- | :--- |
| **Yape** | `#742284` / `#00D9C0` | `<YapeIcon />` | Footer, Carrito y Modal de Reserva. |
| **Plin** | `#00DFB6` / `#FF2E93` | `<PlinIcon />` | Footer, Carrito y Modal de Reserva. |
| **Culqi** | `#FF7800` / `#0B0E14` | `<CulqiIcon />` | Footer y Carrito de Compras. |
| **Visa** | `#1434CB` / `#FFFFFF` | `<VisaIcon />` | Footer y Carrito de Compras. |

---

## 3. Sistema Tipográfico

- **Fuente Primaria:** `Inter`, system-ui, -apple-system, sans-serif.
- **Fuente Técnica / Monospace:** `Consolas`, monospace (para códigos SKU, precios `S/.`, frecuencias MHz y tablas técnicas).

| Nivel / Rol | Tamaño | Peso | Tracking | Uso en el Sistema |
| :--- | :---: | :---: | :---: | :--- |
| **Hero Title (H1)** | 32px – 48px | 900 (Black) | `-0.025em` (Tight) | Título principal de portada y encabezados de producto. |
| **Section Header (H2)**| 20px – 28px | 900 (Black) | `0.025em` (Wide) | Cabeceras de catálogo, categorías y modales. |
| **Card Title (H3)** | 14px – 16px | 700 (Bold) | Normal | Título de producto en tarjeta de catálogo. |
| **Body Standard** | 13px – 14px | 500 (Medium) | Normal | Párrafos descriptivos, preguntas de FAQ y especificaciones. |
| **Caption / Badges** | 10px – 11px | 800 (ExtraBold) | `0.05em` (Wider) | Marcas, etiquetas de oferta, contadores y tags de stock. |
| **Price Hero** | 20px – 24px | 900 (Black) | Normal | Precio final en Soles peruanos (`S/.`). |

---

## 4. Escala de Espaciado, Bordes & Elevación

### 4.1 Radios de Borde (Border Radius Scale)
- `rounded-md` (`6px`): Badges pequeños, botones de paginación y chips técnicos.
- `rounded-xl` (`12px`): Botones de acción, inputs de búsqueda y tarjetas de miniaturas.
- `rounded-2xl` (`16px`): Tarjetas de producto en catálogo y bloques de contenido secundario.
- `rounded-3xl` (`24px`): Contenedores modales principales, fichas de producto y hero banner.
- `rounded-full` (`9999px`): Avatares, botones flotantes circulares y badges de estado online.

### 4.2 Reglas de Bordes en Modales
Para garantizar un acabado premium y libre de contornos rígidos:
- **Contenedor exterior del modal:** `border-0 shadow-2xl shadow-black/90`.
- **Líneas divisorias internas:** `border-gray-800` (en modo oscuro) y `border-slate-200` (en modo claro).
- **Prohibido:** El uso de `border-white`, `border-slate-300` o bordes claros en los envoltorios modales superpuestos al backdrop oscuro.

---

## 5. Suite de Animaciones & Física de Transición (GPU 60/120 FPS)

Implementadas en `src/index.css` con curvas cúbicas de desaceleración natural (`cubic-bezier(0.16, 1, 0.3, 1)`):

```css
/* Entradas */
.animate-spartan-fade-in      /* Opacidad 0 -> 1 (240ms) */
.animate-spartan-modal        /* Escala 0.93 -> 1.0 + Desplazamiento Y 18px -> 0 (280ms) */
.animate-spartan-drawer-right /* Desplazamiento X 100% -> 0 (300ms) */
.animate-spartan-drawer-left  /* Desplazamiento X -100% -> 0 (300ms) */
.animate-spartan-chat         /* Escala 0.84 -> 1.0 + Desplazamiento Y desde abajo a la derecha (280ms) */

/* Salidas Fluidas (Simétricas para evitar cierres bruscos) */
.animate-spartan-fade-out     /* Opacidad 1 -> 0 (200ms) */
.animate-spartan-modal-exit   /* Escala 1.0 -> 0.94 + Desplazamiento Y 0 -> 14px (220ms) */
.animate-spartan-drawer-exit-right /* Desplazamiento X 0 -> 100% (240ms) */
.animate-spartan-drawer-exit-left  /* Desplazamiento X 0 -> -100% (240ms) */
.animate-spartan-chat-exit    /* Escala 1.0 -> 0.85 + Desplazamiento Y 0 -> 24px (220ms) */
```

---

## 6. Arquitectura de Componentes Principales

```
src/
├── components/
│   ├── Topbar.jsx          # Dirección física exacta, horario de atención y WhatsApp rápido
│   ├── Navbar.jsx          # Logo oficial, buscador predictivo, botón de categorías y carrito
│   ├── MarqueeTicker.jsx   # Cinta informativa continua con iconos Lucide de tienda física
│   ├── MegaMenuDrawer.jsx  # Menú desplegable lateral por familias y categorías de hardware
│   ├── CatalogView.jsx     # Catálogo general con filtros dinámicos por marca, precio y vista dual
│   ├── ProductDetail.jsx   # Ficha técnica completa, galería de 1 a N fotos y Lightbox fullscreen
│   ├── PCBuilderModal.jsx  # Configurador paso a paso de PC Gamer con validación y presupuesto
│   ├── CartDrawer.jsx      # Carrito de compras, cálculo del 10% de reserva y exportación a WhatsApp
│   ├── LocationModal.jsx   # Mapa interactivo de Compuplaza Tienda 211, ruta Waze y copiado de dirección
│   ├── FaqModal.jsx        # Preguntas frecuentes clasificadas, buscador en tiempo real y soporte
│   ├── ChatIABubble.jsx    # Asistente virtual SPARTAN con ventana flotante inteligente y redimensionable
│   ├── Footer.jsx          # Información legal, libro de reclamaciones y pasarelas de pago SVG
│   └── Icons.jsx           # Hub central de vectores (Yape, Plin, Culqi, Visa) y Lucide exports
├── data/
│   └── storeData.js        # Configuración por defecto, productos base, árbol de categorías y FAQs
├── hooks/
│   └── useModalTransition.js # Hook para coordinar animaciones simétricas de entrada y salida
└── services/
    ├── aiService.js        # Motor de IA contextual para SPARTAN con guardrails de tienda física
    └── catalogService.js   # Sincronización en vivo con Google Sheets (Productos, Categorias, Config)
```

---

## 7. Integración Headless con Google Sheets

El sistema está conectado de forma bidireccional a la hoja de cálculo de Google Drive ([Spartan_Games_Catalogo_Productos](https://docs.google.com/spreadsheets/d/1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno/)):

1. **Pestaña `Productos`:**
   - Define el catálogo comercial (nombres, marcas, precios, stock físico, ofertas y fichas).
   - **Gestión de Imágenes:** Admite 1 sola URL para presentación limpia o múltiples URLs separadas por coma o salto de línea (`Alt + Enter`), generando automáticamente la galería interactiva y el visor pantalla completa.
2. **Pestaña `Categorias`:**
   - Define el árbol de navegación del Mega Menú, iconos y familias de componentes.
3. **Pestaña `Configuracion`:**
   - Centraliza los datos clave de tienda:
     - `direccion`: `Calle Octavio Muñoz Najar 223 Int 211, Arequipilla, Peru, 04001`
     - `horario`: `Lunes a Sábado: 11:00 am a 8:00 pm (Domingos cerrado)`
     - `whatsapp`: `51912930004`
4. **Pestaña `MANUAL`:**
   - Guía oficial ilustrada para el equipo de Spartan Games con diccionario de columnas y fila de plantilla para duplicar.

---

## 8. Datos Oficiales de Tienda Física

- **Dirección Oficial:** `Calle Octavio Muñoz Najar 223 Int 211, Arequipilla, Peru, 04001`
- **Referencia:** Centro Comercial Compuplaza, 2do Nivel, Interior 211 (Cercado de Arequipa).
- **Horario de Atención:** Lunes a Sábado de 11:00 am a 8:00 pm (Domingos cerrado).
- **Teléfono de Ventas / WhatsApp:** +51 912 930 004 / +51 973 696 367.
