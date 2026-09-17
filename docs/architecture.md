# ARCHITECTURE

Este documento describe la arquitectura de alto nivel de **Spartan Games Web**.
Si acabas de aterrizar en el proyecto, lee esto primero.

Para el sistema de diseño visual (colores, tipografía, tokens, animaciones), consulta `design.md` en la raíz del repositorio.
Para la documentación específica del chatbot de IA, consulta `docs/chatbot.md`.

## Bird's Eye View

Spartan Games Web es una tienda virtual de hardware gamer y estaciones de trabajo ubicada en Arequipa, Perú. Funciona como una **Single-Page Application (SPA)** construida con React 19 y Vite 8 que se conecta a un backend serverless en Netlify.

La pieza central del sistema es que **no existe una base de datos tradicional**. Todo el catálogo de productos, categorías y configuración de la tienda vive en una hoja de cálculo de Google Sheets que actúa como CMS Headless. El frontend consulta esta hoja a través de funciones serverless que parsean el CSV y lo exponen como JSON limpio.

El flujo general es:

```
Google Sheets (CMS)  ──CSV/GViz──►  Netlify Functions  ──JSON──►  React SPA
OpenRouter (IA)      ◄──prompts──►  Netlify Functions  ──reply──►  ChatIABubble
```

Además del catálogo, el sistema incluye un asistente de IA conversacional que puede ejecutar consultas SQL sobre el inventario en tiempo real mediante la API de Visualización de Google (GViz), y un mecanismo de detección de cambios de precios que notifica al usuario sin recargar la página.

## Code Map

Este es el mapa de los módulos principales. Usa la búsqueda de símbolos de tu editor (`Ctrl+Shift+O` o `Cmd+Shift+O`) para localizar los componentes por nombre.

### `src/App.jsx`

Punto de entrada de la aplicación React. Coordina el estado global de la sesión: productos, categorías, configuración de tienda, carrito de compras, tema visual (dark/light) y la vista activa (`home`, `catalog`, `product`). No contiene lógica de presentación propia; delega el renderizado a las páginas y componentes que importa.

### `src/pages/`

Vistas completas e independientes. Cada archivo es una pantalla autónoma con su propia lógica de filtrado y estado local:

- **`HomePage`** — Vitrina de entrada. Compone el Hero Banner, el slider de categorías, las ofertas relámpago con autoplay horizontal y la sección de testimonios de clientes.
- **`CatalogPage`** — Catálogo con filtrado multifactorial: búsqueda textual, selección de marcas, rango de precio dual con inputs manuales, toggle de stock disponible, ordenamiento y alternancia de vista grilla/lista. Paginación para catálogos de 500+ productos.
- **`ProductDetailPage`** — Ficha técnica completa. Galería de 1-N imágenes con lightbox fullscreen navegable por teclado, pestañas de especificaciones, selector de cantidad y modal de confirmación de stock.

### `src/components/`

Componentes organizados por dominio funcional. Las subcarpetas agrupan por responsabilidad:

- **`layout/`** — Estructura permanente visible en toda la app: `Topbar` (horarios, ubicación, sync manual), `Navbar` (buscador predictivo, categorías, toggle de tema), `Footer` (pasarelas de pago, datos legales), `MegaMenuDrawer` (navegación lateral por familias de hardware).
- **`modals/`** — Diálogos emergentes aislados: `CartDrawer` (carrito, cálculo de reserva 10%, proforma WhatsApp), `PCBuilderModal` (configurador paso a paso de PC), `LocationModal` (mapa de la tienda física en Compuplaza, ruta Waze), `FaqModal` (preguntas frecuentes con búsqueda en vivo).
- **`home/`** — Secciones exclusivas de la portada: `HeroBannerCarousel`, `CategorySlider`, `CustomerReviewsSection`.
- **`feedback/`** — Componentes reactivos de notificación: `ChatIABubble` (asistente IA flotante con tres modos de tamaño), `PriceUpdateToast` (alerta glassmorphic de precios actualizados).
- **`common/`** — Átomos transversales: `Icons` (hub SVG centralizado de Lucide + vectores de pago peruanos), `Breadcrumbs` (migas de pan accesibles), `MarqueeTicker` (cinta informativa continua).

### `src/services/`

Capa de integración con servicios externos. Ningún componente de UI accede directamente a la red; siempre pasa por esta capa.

- **`catalogService`** — Descarga y cachea los datos de Google Sheets. Transforma URLs de Google Drive a CDN directa (`lh3.googleusercontent.com`). Implementa `detectPriceChanges`, que compara el catálogo en memoria contra datos frescos para detectar variaciones de precio o stock.
- **`aiService`** — Cliente del asistente IA. Envía mensajes al endpoint serverless y parsea la respuesta, extrayendo etiquetas de acción (`[ACTION:MAPS]`, `[ACTION:OPEN_CART]`, `[PRODUCT:sku]`) para convertirlas en botones y tarjetas interactivas.

### `src/utils/`

Funciones puras sin dependencias de React ni del DOM.

- **`csvParser`** — Analizador sintáctico conforme a RFC 4180. Maneja comillas escapadas, comas internas en descripciones de hardware y saltos de línea dentro de campos.

### `src/hooks/`

- **`useModalTransition`** — Hook que retiene un componente en el DOM durante el tiempo exacto que necesita su animación de salida antes de desmontarlo. Todos los modales y drawers lo usan.

### `src/data/`

- **`storeData`** — Datos de contingencia offline: catálogo semilla, árbol de categorías, configuración por defecto, FAQ y banners. Si la red falla, la app se levanta con estos datos.

### `netlify/functions/`

Backend serverless ejecutado en el edge de Netlify. Existen dos funciones:

- **`catalog`** — Proxy hacia Google Sheets. Evita CORS del navegador y añade headers de cache.
- **`chat`** — Gateway de IA. Almacena la API key de OpenRouter de forma segura. Ejecuta guardrails de seguridad (anti-jailbreak, anti-gibberish, anti-off-topic) antes de invocar el modelo. Si el modelo solicita datos del catálogo, ejecuta consultas GViz SQL validadas contra la hoja.

### `tests/`

- **`production.test.js`** — 14 pruebas unitarias con `node:test`. Cubren parseo CSV, normalización de URLs de imagen, cálculos de carrito y reserva, paginación, guardrails de IA, validación de queries GViz y detección de cambios de precio.

## Invariantes Arquitectónicos

Estas son propiedades del sistema que deben mantenerse verdaderas. Violarlas introduce bugs difíciles de rastrear:

1. **Las API keys nunca tocan el navegador.** `OPENROUTER_API_KEY` y el Sheet ID de Google solo existen en las funciones serverless (`netlify/functions/`). El frontend no tiene acceso directo a estos valores.

2. **La sincronización de catálogo nunca bloquea al usuario.** El chequeo periódico de precios (cada 60 segundos) se ejecuta en segundo plano. Si detecta cambios, muestra un toast no intrusivo. En ningún caso recarga la página ni congela inputs.

3. **Los componentes de UI no hacen fetch directamente.** Toda comunicación de red pasa por `src/services/`. Los componentes reciben datos y callbacks mediante props.

4. **Nada en `src/pages/` importa de `src/components/modals/`.** Las páginas no conocen la existencia de los modales; estos se montan desde `App.jsx`. Esto garantiza que las vistas sean independientes y testables de forma aislada.

5. **Nada en `src/components/common/` importa de otro subdirectorio de `src/components/`.** Los componentes comunes son átomos terminales sin dependencias laterales.

6. **El estado del carrito y el tema siempre se persisten en `localStorage`.** Si el usuario cierra el navegador y vuelve, su carrito y preferencia visual se restauran.

7. **Cero emojis decorativos en la UI.** Toda la iconografía usa vectores SVG de Lucide React o vectores oficiales de pasarelas de pago (Yape, Plin, Culqi, Visa) centralizados en `Icons`.

## Cross-Cutting Concerns

### Temas (Dark / Light)

El tema se controla con un booleano `isDarkMode` que baja por props desde `App.jsx`. Las clases CSS se aplican de forma condicional con template strings de Tailwind. La clase `dark` se sincroniza en `document.documentElement` para que los selectores `dark:` de Tailwind funcionen globalmente.

### Animaciones y Transiciones

Todas las animaciones de modales y drawers usan clases CSS definidas en `src/index.css` con prefijo `animate-spartan-*`. Se ejecutan exclusivamente sobre `transform` y `opacity` para aprovechar composición GPU a 60/120 FPS. El hook `useModalTransition` coordina la simetría entre las animaciones de entrada y salida.

### Manejo de Errores

Los errores de red en la sincronización del catálogo se capturan silenciosamente para no degradar la experiencia del usuario. Los datos de contingencia en `storeData` garantizan que la app funcione sin conexión. Los errores de guardrails del chatbot devuelven mensajes amigables predefinidos en lugar de errores técnicos.

### Parseo de Datos y Normalización

Google Sheets exporta CSV con particularidades (comillas dobles escapadas, saltos de línea internos). El parser en `csvParser` es una máquina de estados determinista que los maneja sin dependencias externas. Las URLs de imagen de Google Drive se normalizan a `lh3.googleusercontent.com/d/{ID}` para carga directa.

### Seguridad del Chatbot

El endpoint `chat.js` ejecuta tres capas de validación antes de invocar al modelo de IA:
1. `isGibberish` — Detecta spam de teclado y secuencias sin sentido.
2. `checkGuardrails` — Bloquea inyecciones de prompt y temas fuera de contexto.
3. `validateGvizQuery` — Verifica que las consultas SQL generadas por el modelo solo lean datos y no contengan operaciones destructivas.

## Flujo de Datos: Sincronización de Catálogo

```
1. App se monta → llama handleSyncCatalog(false)
2. catalogService → fetch a /api/catalog → proxy descarga CSV de Google Sheets
3. CSV se parsea con csvParser → se normaliza a objetos Product[]
4. App actualiza estado: products, categories, storeInfo, banners
5. Cada 60s, un intervalo en segundo plano repite el paso 2-3
6. Si detectPriceChanges encuentra diferencias → setPendingUpdate()
7. PriceUpdateToast aparece → usuario decide si aplicar los cambios
```

## Flujo de Datos: Chatbot IA

```
1. Usuario escribe en ChatIABubble → sendChatMessage()
2. aiService → POST /api/chat con historial de mensajes
3. chat.js ejecuta guardrails → si pasan, invoca OpenRouter
4. Si el modelo pide datos del catálogo → ejecuta GViz SQL contra Google Sheets
5. Respuesta final se envía al frontend
6. parseBotResponse() extrae texto limpio + etiquetas [ACTION:*] y [PRODUCT:*]
7. ChatIABubble renderiza burbujas con markdown + tarjetas de producto + botones
```
