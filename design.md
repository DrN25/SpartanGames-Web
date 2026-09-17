---
version: "2.4.0"
spec: "DESIGN.md / Design System & Technical Architecture Specification"
project: "Spartan Games Web"
status: "Production Ready"
last_updated: "2026-09-17"
stack:
  framework: "React 19"
  bundler: "Vite 8"
  styling: "TailwindCSS + Custom Glassmorphism + Pure CSS Keyframes"
  icons: "Lucide React + Custom Peruvian Payment Vectors (Yape, Plin, Culqi, Visa)"
  cms: "Google Sheets Headless CMS (CSV RFC 4180 + GViz SQL Query Engine)"
  ai_assistant: "OpenRouter GPT-5.6 Luna + GViz Tool Calling"
wcag_compliance: "WCAG 2.1 Level AA"
tokens:
  colors:
    primary:
      gold: "#FFDE17"
      gold_hover: "#E5C713"
      gold_glow: "rgba(255, 222, 23, 0.18)"
    accents:
      red: "#FF334B"
      emerald: "#25D366"
      blue: "#38BDF8"
    dark:
      canvas: "#07090D"
      surface: "#0B0E14"
      card: "#111620"
      card_hover: "#18202F"
      border: "rgba(31, 41, 55, 0.8)"
      border_subtle: "rgba(55, 65, 81, 0.5)"
    light:
      canvas: "#F8FAFC"
      surface: "#FFFFFF"
      card: "#FFFFFF"
      card_hover: "#F1F5F9"
      border: "#E2E8F0"
  typography:
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    mono: "Consolas, 'SF Mono', Monaco, Inconsolata, 'Fira Code', monospace"
  spacing_grid: "8pt"
  radii:
    badge: "6px"
    input_button: "12px"
    card: "16px"
    modal: "24px"
    pill: "9999px"
---

# Spartan Games — Design System & Technical Architecture Specification

> **Catálogo E-Commerce & Sistema Web de Alto Rendimiento para Hardware Gamer y Workstations**  
> **Sede Central:** Calle Octavio Muñoz Najar 223 Int 211, Compuplaza, Arequipa, Perú (04001)  
> **Canales Oficiales:** WhatsApp (+51 912 930 004 / +51 973 696 367) · [Catálogo en Vivo Google Drive](https://docs.google.com/spreadsheets/d/1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno/)  
> **Filosofía:** Cero AI Slop · Micro-animaciones GPU 60/120 FPS · Single Responsibility (SRP) · Accesibilidad WCAG 2.1 AA

---

## 1. Contexto del Producto & Identidad de Marca

### 1.1 Misión y Propósito
**Spartan Games** es la tienda especializada líder en hardware para videojuegos, streaming y estaciones de trabajo en Arequipa. Este sistema web opera como una vitrina digital interactiva y canal de pre-venta de alta conversión que conecta a los clientes con la tienda física en Compuplaza (Tienda 211) mediante:
- Sincronización continua de inventario y precios desde **Google Sheets**.
- Cotización en tiempo real con cálculo formal del **10% de reserva** para congelar precios.
- Generación de proformas directas formateadas para **WhatsApp Business**.
- Asistente de IA con soporte de lenguaje natural y ejecución de consultas SQL (**Google Visualization API**).

### 1.2 Audiencia Objetivo
1. **Gamers Competitivos & Entusiastas de PC:** Buscan componentes de última generación (CPUs Ryzen/Intel Core, GPUs NVIDIA RTX serie 40 y 50), benchmarks claros y garantía local.
2. **Creadores de Contenido, Arquitectos y Diseñadores 3D:** Exigen memorias de alta frecuencia, almacenamiento NVMe Gen4/Gen5 y soporte de ensamblaje profesional con pruebas de estrés térmico.
3. **Público Local de Arequipa y Sur del Perú:** Prioriza la confirmación de stock físico en tienda, medios de pago inmediatos (**Yape**, **Plin**, transferencia) y retiro en Compuplaza o delivery local.

### 1.3 Tono y Voz de la Interfaz
- **Táctico y Confiable:** Preciso en especificaciones técnicas (watts, frecuencias, factores de forma).
- **Directo y Transparente:** Sin precios ocultos, sin comisiones sorpresa; el precio en soles (`S/.`) es definitivo con opción de reserva al 10%.
- **Sobrio y Premium:** Estética inspirada en interfaces aeroespaciales y gaming de élite, evitando colores estridentes no controlados o sobrecarga visual.

---

## 2. Principios de Diseño & Restricciones Negativas (Guardrails)

### 2.1 Principios Rectores
1. **Precisión Táctica (Tactical Spartan):**
   La información técnica es el núcleo del producto. Toda ficha debe mostrar marca, socket/interfaz, compatibilidad y stock en unidades exactas.
2. **Micro-interacciones Fluidas a 60/120 FPS:**
   Las transiciones de apertura y cierre de modales, sliders y carruseles deben ejecutarse mediante aceleración por hardware (`transform` y `opacity`), con curvas cúbicas naturales y sin saltos de layout (*Layout Shifts CLS = 0*).
3. **Diseño Mobile-First con Ergonomía Táctil:**
   Toda área de toque interactiva debe cumplir el estándar de **44 × 44 px** como mínimo. Los cajones laterales (*drawers*) y el asistente virtual ocupan el 100% de la pantalla en dispositivos móviles para facilitar la navegación con una sola mano.
4. **Arquitectura Desacoplada y Modular (SRP):**
   Ninguna vista asume lógica de renderizado ajena a su responsabilidad. El archivo `App.jsx` actúa exclusivamente como orquestador de estado global y enrutador principal, mientras que las páginas (`HomePage`, `CatalogPage`, `ProductDetailPage`) controlan sus subdominios.

### 2.2 Restricciones Negativas (Forbidden Anti-Patterns)
> [!CAUTION]
> Estas restricciones son de cumplimiento obligatorio tanto para desarrolladores humanos como para agentes de codificación automática:

- ❌ **Prohibido el "AI Slop":** Prohibido insertar emojis decorativos sueltos (como 🚀, 🔥, 💻, ✨) en títulos `<h1>`-`<h3>`, etiquetas de botones o fichas técnicas. Solo se permiten vectores SVG oficiales de **Lucide React** o marcas registradas (Yape, Plin, etc.).
- ❌ **Prohibido el uso de bordes blancos rígidos en modo oscuro:** Los contenedores emergentes (`FaqModal`, `LocationModal`, `PCBuilderModal`, `CartDrawer`, `ChatIABubble`) deben usar `border-0` o bordes sutiles `border-gray-800/80` acompañados de sombras profundas (`shadow-2xl shadow-black/90`). Queda estrictamente prohibido `border-white` o `border-slate-200` en temas oscuros.
- ❌ **Prohibido el bloqueo de navegación en sincronizaciones:** La sincronización de catálogo en segundo plano nunca debe recargar la página ni congelar los inputs. Los cambios de precios deben notificarse al usuario mediante un Toast no intrusivo (`PriceUpdateToast`).
- ❌ **Prohibido el uso de librerías externas de estado no justificadas:** Siguiendo la disciplina de simplicidad (*YAGNI*), no se admiten paquetes pesados como Redux o Zustand; el estado reactivo nativo de React 19 (`useState`, `useRef`, `useMemo`, `useCallback`) es la norma.

---

## 3. Sistema de Tokens de Diseño

### 3.1 Paleta de Colores & Roles Semánticos

| Token Semántico | Valor Hex | Valor HSL | Rol en la Interfaz | Ratio Contraste (WCAG) |
| :--- | :---: | :---: | :--- | :---: |
| `--spartan-gold` | `#FFDE17` | `51°, 100%, 55%` | Acento Primario / Acción / Precios VIP | `14.2:1` (vs `#07090D`) ✅ AAA |
| `--spartan-gold-hover` | `#E5C713` | `51°, 85%, 49%` | Estado Hover de Botones Principales | `11.8:1` (vs `#07090D`) ✅ AAA |
| `--spartan-gold-glow` | `rgba(255,222,23,0.18)` | `51°, 100%, 55%, 0.18` | Halos de enfoque y resplandores activos | Decorativo |
| `--bg-canvas-dark` | `#07090D` | `220°, 30%, 4%` | Fondo base de la aplicación (Dark) | Fondo Primario |
| `--bg-surface-dark` | `#0B0E14` | `223°, 29%, 6%` | Navbar, Footer, Drawers y Modales | Elevación Nivel 1 |
| `--bg-card-dark` | `#111620` | `220°, 30%, 10%` | Tarjetas de producto, paneles y celdas | Elevación Nivel 2 |
| `--bg-card-hover` | `#18202F` | `220°, 33%, 14%` | Hover interactivo en tarjetas | Elevación Nivel 3 |
| `--border-dark` | `#1F2937` | `217°, 33%, 17%` | Líneas divisorias y contornos tenues | `border-gray-800` |
| `--bg-canvas-light` | `#F8FAFC` | `210°, 40%, 98%` | Fondo base diurno (Light) | Fondo Primario Light |
| `--bg-surface-light` | `#FFFFFF` | `0°, 0%, 100%` | Contenedores y modales en modo claro | Elevación Nivel 1 Light |
| `--bg-card-hover-light` | `#F1F5F9` | `210°, 40%, 96%` | Hover en tarjetas de catálogo claras | Elevación Nivel 2 Light |
| `--spartan-red` | `#FF334B` | `353°, 100%, 60%` | Ofertas relámpago, alertas de stock bajo | `5.8:1` (vs `#07090D`) ✅ AA |
| `--spartan-emerald` | `#25D366` | `142°, 70%, 49%` | Botones de WhatsApp, stock físico activo | `8.6:1` (vs `#07090D`) ✅ AAA |
| `--spartan-blue` | `#38BDF8` | `199°, 95%, 60%` | Filtros técnicos, etiquetas de chipset | `9.4:1` (vs `#07090D`) ✅ AAA |

### 3.2 Iconografía de Medios de Pago Peruanos (SVG Oficiales)
Para salvaguardar la confianza comercial y evitar confusiones con imágenes rasterizadas degradadas, todos los sellos de pago son componentes vectoriales puros disponibles en `src/components/common/Icons.jsx`:

| Medio de Pago | Color Primario | Componente React | Ubicación |
| :--- | :---: | :--- | :--- |
| **Yape (BCP)** | `#742284` / `#00D9C0` | `<YapeIcon className="w-5 h-5" />` | Footer, Carrito de Compras y Modal de Reserva |
| **Plin (Interbank/BBVA/Scotiabank)** | `#00DFB6` / `#FF2E93` | `<PlinIcon className="w-5 h-5" />` | Footer, Carrito de Compras y Modal de Reserva |
| **Culqi** | `#FF7800` | `<CulqiIcon className="w-5 h-5" />` | Footer y Pasarela Informativa |
| **Visa** | `#1434CB` | `<VisaIcon className="w-5 h-5" />` | Footer y Pasarela Informativa |

---

## 4. Sistema Tipográfico

El sistema adopta una escala tipográfica modular basada en `Inter` (para legibilidad en pantalla) complementada con `Consolas` para valores numéricos, identificadores de producto (SKU) y especificaciones técnicas de hardware.

### 4.1 Familias Tipográficas
```css
font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-mono: 'Consolas', 'SF Mono', Monaco, Inconsolata, 'Fira Code', monospace;
```

### 4.2 Escala Jerárquica

| Nivel Semántico | Clases Tailwind | Tamaño / Interlínea | Peso | Tracking | Aplicación |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Display H1** | `text-3xl sm:text-4xl lg:text-5xl` | 32px – 48px / 1.1 | 900 (Black) | `-0.025em` | Título del Hero Banner y Ficha de Producto |
| **Section H2** | `text-xl sm:text-2xl lg:text-3xl` | 20px – 30px / 1.2 | 900 (Black) | `0.015em` | Encabezados de Catálogo, PC Builder y Modales |
| **Card H3** | `text-sm sm:text-base` | 14px – 16px / 1.3 | 700 (Bold) | Normal | Título del producto en tarjeta de grilla |
| **Price Hero** | `text-xl sm:text-2xl font-mono` | 20px – 24px / 1.0 | 900 (Black) | Normal | Precio comercial en Soles (`S/. 1,450.00`) |
| **Body Standard** | `text-xs sm:text-sm` | 13px – 14px / 1.5 | 500 (Medium) | Normal | Párrafos descriptivos, preguntas de FAQ |
| **Technical Specs**| `text-xs font-mono` | 11px – 12px / 1.4 | 600 (SemiBold)| Normal | Frecuencias (MHz), Watts (W), Chips, VRAM |
| **Badge / Caption**| `text-[10px] sm:text-[11px]` | 10px – 11px / 1.0 | 800 (ExtraBold)| `0.05em` | Etiquetas de Stock, Descuento y Marca |

---

## 5. Espaciado, Grilla & Layout Responsivo

### 5.1 Sistema de Espaciado (Base 8pt Grid)
Todos los márgenes, rellenos (*padding*) y separaciones se calculan en múltiplos de **4px** y **8px**:
- `space-1` = `4px`
- `space-2` = `8px`
- `space-3` = `12px`
- `space-4` = `16px`
- `space-6` = `24px`
- `space-8` = `32px`
- `space-12` = `48px`
- `space-16` = `64px`

### 5.2 Contenedor Máximo & Breakpoints
La aplicación está optimizada para monitores panorámicos y ultra-anchos de entusiastas de hardware, manteniendo legibilidad centralizada:
- **Ancho Máximo del Canvas:** `max-w-[1720px] mx-auto`
- **Breakpoints Responsivos:**
  - `sm`: `640px` (Móviles en horizontal y phablets)
  - `md`: `768px` (Tablets estándar)
  - `lg`: `1024px` (Laptops estándar)
  - `xl`: `1280px` (Monitores de escritorio 1080p)
  - `2xl`: `1536px` (Monitores 2K y QHD)
  - `3xl`: `1720px` (Límite visual del contenedor central)

### 5.3 Radios de Curvatura (*Border Radius*)
- `rounded-md` (`6px`): Badges pequeños, botones de paginación y chips técnicos.
- `rounded-xl` (`12px`): Campos de texto (`inputs`), botones de acción estándar y miniaturas.
- `rounded-2xl` (`16px`): Tarjetas de producto en catálogo y contenedores secundarios.
- `rounded-3xl` (`24px`): Modales principales, Hero Banner y cajones de navegación.
- `rounded-full` (`9999px`): Botón flotante de IA, avatares y píldoras de estado.

---

## 6. Elevación, Sombras & Capas Z-Index

Para evitar colisiones entre modales, drawers y alertas flotantes, el sistema define la siguiente jerarquía de apilamiento:

| Nivel de Capa | Clase Z-Index | Elemento del Sistema | Sombra Aplicada |
| :--- | :---: | :--- | :--- |
| **Canvas Base** | `z-0` | Contenido de página y secciones de fondo | `shadow-none` |
| **Tarjetas Elevadas** | `z-10` | Tarjetas de producto en estado hover | `shadow-xl shadow-black/40` |
| **Sticky Navigation**| `z-40` | Topbar fija y Navbar con desenfoque de fondo | `shadow-2xl shadow-black/50` |
| **Backdrop de Modales**| `z-50` | Fondo oscurecido (`bg-black/80 backdrop-blur-sm`)| N/A |
| **Cajones / Modales** | `z-50` | `CartDrawer`, `PCBuilderModal`, `LocationModal`, `FaqModal` | `shadow-2xl shadow-black/90` |
| **Alerta Toast Flotante**| `z-50` | `PriceUpdateToast` (Top center) | `shadow-2xl shadow-black/80` |
| **Burbuja y Chat IA** | `z-50` | `ChatIABubble` (Bottom right flotante) | `shadow-2xl shadow-black/80` |
| **Lightbox Pantalla Completa** | `z-[60]` | Visor de imágenes de producto a pantalla completa | `shadow-none` |

---

## 7. Física de Animaciones & Micro-Interacciones (GPU 60/120 FPS)

Todas las animaciones están compiladas en `src/index.css` utilizando curvas cúbicas de desaceleración natural (`cubic-bezier(0.16, 1, 0.3, 1)`):

```css
/* Entradas Fluidas */
.animate-spartan-fade-in      /* Opacidad 0 -> 1 (240ms) */
.animate-spartan-modal        /* Escala 0.93 -> 1.0 + Desplazamiento Y 18px -> 0 (280ms) */
.animate-spartan-drawer-right /* Desplazamiento X 100% -> 0 (300ms) */
.animate-spartan-drawer-left  /* Desplazamiento X -100% -> 0 (300ms) */
.animate-spartan-chat         /* Escala 0.84 -> 1.0 + Desplazamiento Y desde esquina (280ms) */

/* Salidas Simétricas (Evita parpadeos bruscos al desmontar componentes) */
.animate-spartan-fade-out     /* Opacidad 1 -> 0 (200ms) */
.animate-spartan-modal-exit   /* Escala 1.0 -> 0.94 + Desplazamiento Y 0 -> 14px (220ms) */
.animate-spartan-drawer-exit-right /* Desplazamiento X 0 -> 100% (240ms) */
.animate-spartan-drawer-exit-left  /* Desplazamiento X 0 -> -100% (240ms) */
.animate-spartan-chat-exit    /* Escala 1.0 -> 0.85 + Desplazamiento Y 0 -> 24px (220ms) */
```

### 7.1 Regla de Transiciones Simétricas (`useModalTransition`)
Todos los modales y ventanas emergentes invocan el hook `useModalTransition(isOpen, durationMs)` para retener el nodo en el DOM durante el tiempo exacto que toma la animación de salida antes de su desmontaje físico.

---

## 8. Arquitectura de Software & Mapa de Directorios (SRP)

El código fuente implementa el principio de **Responsabilidad Única (Single Responsibility Principle)**, aislando vistas completas de componentes atómicos y servicios:

```
src/
├── pages/                         # Vistas completas independientes (Page Components)
│   ├── HomePage.jsx               # Portada: Hero, categorías, ofertas relámpago, reviews
│   ├── CatalogPage.jsx            # Catálogo: Filtros dinámicos, marcas, ordenamiento, vista dual
│   └── ProductDetailPage.jsx      # Ficha de producto: Galería interactiva, lightbox, stock modal
│
├── components/
│   ├── layout/                    # Andamiaje estructural de la aplicación
│   │   ├── Topbar.jsx             # Datos de Compuplaza, horario y botón de sincronización manual
│   │   ├── Navbar.jsx             # Barra principal con buscador, mega menú y switch de tema
│   │   ├── Footer.jsx             # Enlaces de soporte, libro de reclamaciones y sellos de pago
│   │   └── MegaMenuDrawer.jsx     # Menú lateral por familias de componentes y periféricos
│   │
│   ├── modals/                    # Ventanas emergentes y flujos de usuario aislados
│   │   ├── CartDrawer.jsx         # Carrito de compras, cálculo de reserva 10% y WhatsApp
│   │   ├── PCBuilderModal.jsx     # Configurador paso a paso de PC Gamer con cálculo de potencia
│   │   ├── LocationModal.jsx      # Mapa interactivo de Compuplaza 211, ruta Waze y copiado rápido
│   │   └── FaqModal.jsx           # Preguntas frecuentes con filtrado en tiempo real
│   │
│   ├── home/                      # Secciones especializadas de la página de inicio
│   │   ├── HeroBannerCarousel.jsx # Carrusel principal con banner expansivo y badges tácticos
│   │   ├── CategorySlider.jsx     # Carrusel horizontal continuo de categorías con scroll táctil
│   │   └── CustomerReviewsSection.jsx # Muro de confianza y testimonios de clientes en Compuplaza
│   │
│   ├── feedback/                  # Componentes de interacción y notificación contextual
│   │   ├── ChatIABubble.jsx       # Asistente virtual SPARTAN con ventana flotante inteligente
│   │   └── PriceUpdateToast.jsx   # Banner glassmorphic de notificación de precios actualizados
│   │
│   ├── common/                    # Componentes atómicos transversales
│   │   ├── Icons.jsx              # Hub central de vectores (Yape, Plin, Culqi, Visa, Lucide)
│   │   ├── Breadcrumbs.jsx        # Migas de pan de navegación accesibles
│   │   └── MarqueeTicker.jsx      # Cinta de información continua sobre garantías y entregas
│   │
│   └── [legacy-shims].jsx         # Re-exportaciones transparentes para compatibilidad retroactiva
│
├── hooks/
│   └── useModalTransition.js      # Coordinador de animaciones de entrada y salida
│
├── services/
│   ├── catalogService.js          # Sincronización en vivo con Google Sheets y detección de cambios
│   └── aiService.js               # Motor de IA contextual con herramientas SQL para el chatbot
│
├── utils/
│   └── csvParser.js               # Parser CSV RFC 4180 nativo, tolerante a comillas y saltos de línea
│
├── data/
│   └── storeData.js               # Fallback local de productos, categorías, configuración y FAQs
│
└── App.jsx                        # Orquestador raíz limpio (< 350 líneas)
```

---

## 9. Contrato de Datos Headless con Google Sheets & GViz SQL

El sistema opera conectado de forma bidireccional a la hoja oficial de Google Drive ([Spartan_Games_Catalogo_Productos](https://docs.google.com/spreadsheets/d/1us3QKhPE07Lv3Dt-S5GU6UpEIZudbhWmpU-lOZNiSno/)):

```
┌─────────────────────────────────────────────────────────────┐
│                 Google Spreadsheet (CMS)                    │
│   Pestañas: [Productos] [Categorias] [Configuracion] [MANUAL] │
└──────────────────────────────┬──────────────────────────────┘
                               │ CSV Export (RFC 4180) / GViz SQL
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Netlify Serverless Edge Functions              │
│    /.netlify/functions/catalog  ·  /.netlify/functions/chat  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Caching & Sanitization (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cliente Web (React 19)                    │
│      catalogService.js  ·  aiService.js  ·  Indexed Cache    │
└─────────────────────────────────────────────────────────────┘
```

### 9.1 Estructura de las Pestañas

1. **Pestaña `Productos`:**
   - Columnas requeridas: `id`, `name`, `category`, `categoryId`, `price`, `originalPrice`, `stock`, `featured`, `image`, `description`, `specs`, `brand`.
   - **Múltiples Imágenes:** Admite 1 sola URL para presentación estándar o múltiples URLs separadas por coma (`,`) o salto de línea (`Alt + Enter`). El sistema las normaliza de enlaces de visualización de Google Drive a URLs directas de Google User Content (`https://lh3.googleusercontent.com/d/{ID}`).
2. **Pestaña `Categorias`:**
   - Define el árbol de navegación del Mega Menú, identificadores de familias e iconos asociados.
3. **Pestaña `Configuracion`:**
   - Centraliza los parámetros operativos de la tienda:
     - `direccion`: `Calle Octavio Muñoz Najar 223 Int 211, Compuplaza, Arequipa, Perú, 04001`
     - `horario`: `Lunes a Sábado: 11:00 am a 8:00 pm (Domingos cerrado)`
     - `whatsapp`: `51912930004`
     - `whatsapp_secundario`: `51973696367`
4. **Pestaña `MANUAL`:**
   - Diccionario de campos y fila de plantilla oficial protegida para que el personal de Spartan Games agregue nuevos productos sin romper el formato.

### 9.2 Motor de Consultas SQL (Google Visualization API)
El backend serverless (`netlify/functions/chat.js`) y `catalogService.js` utilizan la API de Visualización de Google para realizar consultas estructuradas en tiempo de ejecución:
```sql
/* Ejemplo de consulta ejecutada por el Asistente IA */
SELECT A, B, C, D, E, F, G WHERE LOWER(B) CONTAINS 'rtx 4060' AND E <= 1600 ORDER BY E ASC LIMIT 5
```
Todas las consultas se validan mediante la función `validateGvizQuery` para evitar inyecciones maliciosas o filtración de datos sensibles.

---

## 10. Especificación del Asistente Virtual SPARTAN (Chatbot IA)

### 10.1 Comportamiento y Ergonomía
- **Modelo:** OpenRouter GPT-5.6 Luna con fallback contextual a modelos de alta velocidad.
- **Acceso a Datos en Vivo:** El bot posee herramientas para consultar el catálogo en tiempo real con GViz SQL (`buscar_catalogo_sheets`).
- **Estados del Componente:**
  - *Cerrado:* Botón flotante circular con pulso visual dorado (`rounded-full shadow-2xl`).
  - *Abierto Normal (Desktop):* Ventana de `420 × 600 px` anclada a la esquina inferior derecha.
  - *Expandido (Desktop):* Modal amplio de `720 × 800 px` centrado en pantalla para comparar múltiples componentes.
  - *Móvil (< 640px):* Ocupa el 100% de la pantalla (`fixed inset-0`) con barra superior ergonómica que garantiza acceso inmediato a los controles de cierre (`X`) y minimizado sin importar la altura del teclado virtual.
- **Micro-Markdown:** El chat procesa texto enriquecido en tiempo real: negritas (`**`), cursivas (`*`), código (`inline code`), listas y tarjetas interactivas de productos sugeridos con botón de compra directo.

---

## 11. Lista de Verificación de Accesibilidad (WCAG 2.1 AA)

- [x] **Contraste de Color:** Todos los textos principales cumplen un ratio superior a `4.5:1` sobre sus fondos respectivos. El texto de acento dorado (`#FFDE17`) sobre fondo oscuro (`#07090D`) ofrece un ratio superior a `14:1`.
- [x] **Navegación por Teclado:**
  - Todos los modales y cajones se cierran al presionar la tecla `Escape`.
  - Los carruseles permiten navegación accesible mediante flechas izquierda y derecha.
  - Indicadores de foco visual (`focus-visible:ring-2 focus-visible:ring-[#FFDE17]`) en todos los elementos interactivos.
- [x] **Áreas Táctiles Mínimas:** Botones y enlaces en móvil tienen una altura mínima de `44px` para evitar pulsaciones erróneas.
- [x] **Atributos ARIA:**
  - Migas de pan identificadas con `<nav aria-label="Ruta de navegación">` y `aria-current="page"`.
  - Cajones y modales con `role="dialog"` y `aria-modal="true"`.
  - Cintas continuas decorativas marcadas con `aria-hidden="true"` para lectores de pantalla.

---

## 12. Protocolo de Gobernanza y Mantenimiento

1. **Modificación de Tokens:**
   Cualquier cambio en colores, tipografías o radios debe realizarse simultáneamente en:
   - El bloque YAML de cabecera de este `design.md`.
   - La sección `:root` y clases utilitarias de `src/index.css`.
   - `tailwind.config.js` (si aplica).
2. **Creación de Nuevos Componentes:**
   - Asignar el archivo a la subcarpeta correspondiente (`layout/`, `modals/`, `home/`, `feedback/`, `common/`).
   - Utilizar únicamente iconos importados desde `src/components/common/Icons.jsx`.
   - Garantizar compatibilidad con tema oscuro y claro mediante clases condicionales `isDarkMode`.
   - Añadir pruebas unitarias en `tests/production.test.js` si el componente introduce cálculos de precios, filtros o parsing de datos.
