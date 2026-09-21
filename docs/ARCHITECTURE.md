# ARCHITECTURE

Este documento describe la arquitectura de alto nivel de **Spartan Games Web**.
Si acabas de aterrizar en el proyecto, lee esto primero.

Para el sistema de diseño visual (colores, tipografía, tokens, animaciones), consulta `DESIGN.md` en la raíz del repositorio.
Para la documentación específica del chatbot de IA, consulta `docs/chatbot.md`.

## Bird's Eye View

Spartan Games Web es una tienda virtual de hardware gamer y estaciones de trabajo ubicada en Arequipa, Perú. Funciona como una **Single-Page Application (SPA)** construida con React 19 y Vite 8 que se conecta a un backend serverless en Netlify.

La pieza central del sistema es que **no existe una base de datos tradicional**. Todo el catálogo de productos, categorías, configuración de la tienda y banners vive en una hoja de cálculo de Google Sheets que actúa como CMS Headless. El Google Sheet contiene 4 pestañas principales: `Productos`, `Categorias`, `Configuracion` (datos de negocio: nombre, dirección, teléfonos, redes sociales, horarios, URLs de mapa) y `Banners`. El frontend consulta estas pestañas a través de funciones serverless y lectura directa GViz CSV.

El flujo general es:

```
Google Sheets (CMS)  ──CSV/GViz──►  Netlify Functions  ──JSON──►  React SPA
OpenRouter (IA)      ◄──prompts──►  Netlify Functions  ──reply──►  ChatIABubble
```

Además del catálogo, el sistema incluye un asistente de IA conversacional que puede ejecutar consultas SQL sobre el inventario en tiempo real mediante la API de Visualización de Google (GViz), y un mecanismo de detección de cambios de precios que notifica al usuario sin recargar la página.

## Code Map

Este es el mapa de los módulos principales. Usa la búsqueda de símbolos de tu editor (`Ctrl+Shift+O` o `Cmd+Shift+O`) para localizar los componentes por nombre.

### `src/App.jsx`

Punto de entrada de la aplicación React. Coordina el enrutamiento con `react-router-dom` y el estado global de la sesión: productos, categorías, configuración de tienda, carrito de compras y tema visual (dark/light). Define las rutas (`/`, `/catalog`, `/product/:idOrSlug`) y delega el renderizado a cada página mientras mantiene modales y asistentes como capas superpuestas.

### `src/pages/`

Vistas completas e independientes. Cada archivo es una pantalla autónoma con su propia lógica de filtrado y estado local:

- **`HomePage`** — Vitrina de entrada. Compone el Hero Banner, el carrusel de categorías, las ofertas relámpago con scroll continuo y los testimonios de clientes.
- **`CatalogPage`** — Catálogo con filtrado sincronizado en la URL mediante `useSearchParams` (`category`, `q`, `min`, `max`). Soporta búsqueda de texto, marcas, rango de precios con slider continuo e inputs manuales, filtro de stock, ordenamiento y alternancia grilla/lista.
- **`ProductDetailPage`** — Ficha técnica con URL amigable basada en slug (`/product/:idOrSlug`). Resuelve productos por ID numérico, slug exacto o prefijo de ID si el nombre cambió en Google Sheets. Incluye galería con lightbox, pestañas de especificaciones técnicas, selector de unidades y botón de consulta directa por WhatsApp.

### `src/components/`

Componentes organizados por dominio funcional. Las subcarpetas agrupan por responsabilidad:

- **`layout/`** — Estructura permanente visible en toda la app: `Topbar` (horarios, ubicación, sync manual), `Navbar` (buscador predictivo sincronizado con la URL, categorías, toggle de tema), `Footer` (pasarelas de pago, datos legales), `MegaMenuDrawer` (navegación lateral por familias de hardware).
- **`modals/`** — Diálogos emergentes aislados: `CartDrawer` (carrito, cálculo de reserva 10%, proforma WhatsApp), `PCBuilderModal` (configurador paso a paso de PC), `LocationModal` (mapa de la tienda física en Compuplaza, ruta Waze), `FaqModal` (preguntas frecuentes con búsqueda en vivo).
- **`home/`** — Secciones exclusivas de la portada: `HeroBannerCarousel`, `CategorySlider`, `CustomerReviewsSection`.
- **`feedback/`** — Componentes reactivos de notificación: `ChatIABubble` (asistente IA flotante con modos estándar y maximizado vía Tailwind), `PriceUpdateToast` (alerta glassmorphic de precios actualizados).
- **`common/`** — Átomos transversales: `Icons` (hub SVG centralizado de Lucide + vectores de pago peruanos), `MarkdownRenderer` (renderizador de Markdown del chatbot), `Breadcrumbs` (migas de pan accesibles), `MarqueeTicker` (cinta informativa continua).

### `src/services/`

Capa de integración con servicios externos. Ningún componente de UI accede directamente a la red; siempre pasa por esta capa.

- **`catalogService`** — Descarga y cachea los datos de Google Sheets desde 4 pestañas en paralelo (`Productos`, `Categorias`, `Configuracion`, `Banners`). Normaliza URLs de Google Drive a CDN directa (`lh3.googleusercontent.com`). Genera slugs limpios con `slugify`, desduplica IDs y slugs en memoria con `deduplicateProducts` para prevenir errores de edición humana en la hoja, detecta cambios de precio o stock con `detectPriceChanges`, y parsea la pestaña `Configuracion` a un objeto `storeInfo` que alimenta toda la UI y el prompt del chatbot. Exporta helpers dinámicos: `getStoreMapsUrl()`, `getStoreWazeUrl()`, `getStoreWhatsAppUrl()`.
- **`aiService`** — Cliente del asistente IA. Envía mensajes al endpoint serverless y parsea la respuesta, delegando la extracción y resolución de acciones al `actionRegistry`. Maneja contingencia offline en fallos de red redirigiendo a WhatsApp.
- **`actionRegistry`** — Registro de acciones del chatbot bajo el Patrón Dispatcher (`[ACTION:MAPS]`, `[ACTION:BUILDER]`, etc.). Mapea sinónimos, regex unificada y metadatos de botones. Abierto a extensión sin modificar el parseo.

### `src/utils/`

Funciones puras sin dependencias de React ni del DOM.

- **`csvParser`** — Analizador sintáctico conforme a RFC 4180. Maneja comillas escapadas, comas internas en descripciones de hardware y saltos de línea dentro de campos.

### `src/hooks/`

- **`useModalTransition`** — Hook que retiene un componente en el DOM durante el tiempo exacto que necesita su animación de salida antes de desmontarlo. Todos los modales y drawers lo usan.

### `src/data/`

- **`storeData`** — Plantilla genérica de contingencia offline. Contiene el catálogo semilla, árbol de categorías, banners y un `storeInfo` con campos vacíos (sin datos personales de negocio). Si la red falla, la app se levanta con estos datos como fallback. **Toda la información real de la tienda proviene de la pestaña `Configuracion` del Google Sheet.**

### `netlify/functions/`

Backend serverless ejecutado en el edge de Netlify. Existen dos funciones:

- **`catalog`** — Proxy hacia Google Sheets. Evita CORS del navegador y añade headers de cache.
- **`chat`** — Gateway de IA. Recibe `storeContext` dinámico del frontend y construye el system prompt sin datos hardcodeados. Almacena la API key de OpenRouter de forma segura. Ejecuta guardrails de seguridad (anti-jailbreak, anti-gibberish, anti-off-topic) antes de invocar el modelo. Si el modelo solicita datos del catálogo, ejecuta consultas GViz SQL validadas contra la hoja.

### `tests/`

- **`production.test.js`** — 19 pruebas unitarias con `node:test`. Cubren parseo CSV, normalización de URLs de imagen, cálculos de carrito y reserva, paginación, guardrails de IA, validación de queries GViz, detección de cambios de precio, normalización de slugs, desduplicación de inventario en memoria y compatibilidad con matrices de datos.

## Invariantes Arquitectónicos

Estas son propiedades del sistema que deben mantenerse verdaderas. Violarlas introduce bugs difíciles de rastrear:

1. **Las API keys nunca tocan el navegador.** `OPENROUTER_API_KEY` y el Sheet ID de Google solo existen en las funciones serverless (`netlify/functions/`). El frontend no tiene acceso directo a estos valores.

2. **La sincronización de catálogo nunca bloquea al usuario.** El chequeo periódico de precios (cada 60 segundos) se ejecuta en segundo plano. Si detecta cambios, muestra un toast no intrusivo. En ningún caso recarga la página ni congela inputs.

3. **Los componentes de UI no hacen fetch directamente.** Toda comunicación de red pasa por `src/services/`. Los componentes reciben datos y callbacks mediante props.

4. **Nada en `src/pages/` importa de `src/components/modals/`.** Las páginas no conocen la existencia de los modales; estos se montan desde `App.jsx`. Esto garantiza que las vistas sean independientes y testables de forma aislada.

5. **Nada en `src/components/common/` importa de otro subdirectorio de `src/components/`.** Los componentes comunes son átomos terminales sin dependencias laterales.

6. **El estado del carrito y el tema siempre se persisten en `localStorage`.** Si el usuario cierra el navegador y vuelve, su carrito y preferencia visual se restauran.

7. **Cero emojis decorativos en la UI.** Toda la iconografía usa vectores SVG de Lucide React o vectores oficiales de pasarelas de pago (Yape, Plin, Culqi, Visa) centralizados en `Icons`.

8. **Cero datos personales de negocio en el código fuente.** Teléfonos, direcciones, URLs de redes sociales, horarios y cualquier dato específico de un cliente deben provenir exclusivamente de la pestaña `Configuracion` del Google Sheet. El archivo `storeData.js` contiene solo una plantilla genérica con campos vacíos como fallback.

9. **Gobernanza de Calidad y Ponytail (`GEMINI.md` / `AGENTS.md`):** Todo desarrollo debe respetar la Escalera de Ponytail (YAGNI, reutilización estricta con `grep`, capacidades nativas de JS/Tailwind antes de instalar dependencias o crear helpers innecesarios) y leer obligatoriamente `DESIGN.md` antes de crear o tocar componentes visuales.

## Cross-Cutting Concerns

### Enrutamiento y Deep Linking

La navegación usa `react-router-dom` con `BrowserRouter`. En Netlify, la regla `/* -> /index.html 200` en `netlify.toml` asegura que cualquier ruta directa o recarga con F5 entregue la SPA sin errores 404.

Las rutas de producto usan el patrón `/product/:idOrSlug` (por ejemplo, `/product/115-corsair-vengeance-rgb-16gb-ddr5-6400mhz`). El resolver busca por ID numérico, slug exacto o prefijo de ID; si el título cambia en Google Sheets, los enlaces compartidos previamente no se rompen.

El catálogo sincroniza sus filtros principales (`category`, `q`, `min`, `max`) en la URL vía `useSearchParams` con reemplazo de historial. Al compartir un enlace o recargar la página, el catálogo y el slider de precios restauran exactamente el estado configurado.

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
   Si el proxy no responde: fetchTabRaw() descarga las 4 pestañas en paralelo vía GViz CSV
3. Productos CSV se parsea con csvParser → se normaliza a objetos Product[]
4. Configuracion CSV se parsea a pares clave-valor → objeto storeInfo
5. App actualiza estado: products, categories, storeInfo, banners
6. Cada 60s, un intervalo en segundo plano repite el paso 2-4
7. Si detectPriceChanges encuentra diferencias → setPendingUpdate()
8. PriceUpdateToast aparece → usuario decide si aplicar los cambios
```

## Flujo de Datos: Chatbot IA
 
 ```
 1. Usuario escribe en ChatIABubble → sendChatMessage()
 2. aiService → POST /api/chat con historial de mensajes + storeContext dinámico
 3. chat.js construye systemPrompt con datos de storeContext (nombre, dirección, WhatsApp, redes)
 4. chat.js ejecuta guardrails → si pasan, invoca OpenRouter
 5. Si el modelo pide datos del catálogo → ejecuta GViz SQL contra Google Sheets
 6. Respuesta final se envía al frontend
 7. parseBotResponse() utiliza actionRegistry (Patrón Dispatcher) para resolver acciones y extraer texto limpio + [PRODUCT:*]
 8. ChatIABubble delega el texto enriquecido a MarkdownRenderer + renderiza tarjetas de producto y botones de acción
 ```
