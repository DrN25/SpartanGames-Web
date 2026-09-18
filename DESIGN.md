---
name: "Spartan Games Web"
description: "Sistema de diseño para tienda web de hardware gamer y estaciones de trabajo. Estética táctica, oscura y de alto rendimiento inspirada en instrumental aeroespacial e interfaces de e-sports."
version: "2.5.0"
status: "production"
last_updated: "2026-09-17"

colors:
  # --- Marca ---
  primary: "#FFDE17"
  primary-hover: "#E5C713"
  primary-glow: "rgba(255, 222, 23, 0.18)"

  # --- Semánticos ---
  danger: "#FF334B"
  success: "#25D366"
  info: "#38BDF8"

  # --- Superficies (Modo Oscuro) ---
  canvas-dark: "#07090D"
  surface-dark: "#0B0E14"
  card-dark: "#111620"
  card-hover-dark: "#18202F"
  border-dark: "rgba(31, 41, 55, 0.8)"
  border-subtle-dark: "rgba(55, 65, 81, 0.5)"
  text-primary-dark: "#F1F5F9"
  text-muted-dark: "#94A3B8"

  # --- Superficies (Modo Claro) ---
  canvas-light: "#F8FAFC"
  surface-light: "#FFFFFF"
  card-light: "#FFFFFF"
  card-hover-light: "#F1F5F9"
  border-light: "#E2E8F0"
  text-primary-light: "#0F172A"
  text-muted-light: "#64748B"

typography:
  font-sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-mono: "Consolas, 'SF Mono', Monaco, Inconsolata, 'Fira Code', monospace"

spacing:
  unit: "4px"
  grid: "8px"
  scale: [4, 8, 12, 16, 24, 32, 48, 64]

radii:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

motion:
  easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration-fast: "200ms"
  duration-base: "240ms"
  duration-slow: "300ms"

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  2xl: "1536px"
  max-canvas: "1720px"
---

# DESIGN

Especificación del sistema de diseño de **Spartan Games Web**.
Este documento define el lenguaje visual, tokens de diseño, restricciones de componentes y patrones de interacción de la interfaz.

Para la arquitectura de software (módulos, flujo de datos, invariantes), consulta `docs/ARCHITECTURE.md`.

---

## 1. Esencia de Marca

### Tono y Voz

Spartan Games opera como tienda física de hardware. La información de ubicación, horarios y canales de contacto se carga dinámicamente desde la pestaña `Configuracion` del Google Sheet. La marca se comunica con un **tono táctico y directo**: especificaciones técnicas precisas, precios definitivos en Soles (S/.) y cero contenido de relleno decorativo. Cada elemento de la pantalla existe para ayudar al usuario a evaluar componentes y tomar decisiones de compra.

### Identidad Visual

El sistema visual combina dos influencias principales: **paneles de instrumentos aeroespaciales** (alto contraste, densidad informativa, distribución funcional) e **interfaces de e-sports competitivos** (fondos oscuros profundos, acentos dorados focalizados y tipografía limpia). El resultado es una interfaz sobria y prémium sin saturación visual.

### Audiencia Objetivo

| Segmento | Expectativas |
|:---|:---|
| Gamers Competitivos | Última generación de tarjetas de video (RTX serie 40/50), benchmarks de procesadores, stock en unidades exactas, navegación rápida |
| Creadores de Contenido y Diseñadores 3D | Memorias de alta frecuencia, almacenamiento NVMe Gen4/Gen5, armado especializado y pruebas térmicas |
| Clientes Locales (Arequipa y Sur del Perú) | Confirmación de stock físico en tienda, medios de pago inmediatos (Yape, Plin) y retiro en Compuplaza |

---

## 2. Sistema de Color

### Decisiones de Diseño

- **El dorado (`#FFDE17`) es el único color de acento de marca.** Concentra todas las llamadas a la acción (CTA), estados activos y destacados de precios. Esta restricción previene la sobrecarga visual de acentos en conflicto.
- **El modo oscuro es el tema principal.** El modo claro existe como alternativa de accesibilidad, pero toda la paleta de colores fue concebida y probada primero para entornos oscuros.
- **El rojo se reserva para urgencia y advertencias.** Ofertas relámpago con descuento, avisos de pocas unidades en inventario y badges de liquidación. Nunca se utiliza con fines meramente decorativos.
- **El verde se reserva para WhatsApp y disponibilidad física.** Indicadores de stock en almacén y botones de contacto por WhatsApp. Nunca para toasts de confirmación genéricos.

### Ratios de Contraste (WCAG 2.1 AA)

| Token | Valor Hex | Contraste vs `canvas-dark` | Clasificación |
|:---|:---:|:---:|:---:|
| `primary` | `#FFDE17` | 14.2:1 | AAA |
| `primary-hover` | `#E5C713` | 11.8:1 | AAA |
| `danger` | `#FF334B` | 5.8:1 | AA |
| `success` | `#25D366` | 8.6:1 | AAA |
| `info` | `#38BDF8` | 9.4:1 | AAA |

### Elevación de Superficies (Modo Oscuro)

La profundidad visual se transmite mediante aclarado gradual de las superficies, no únicamente con sombras:

| Nivel | Token | Valor Hex | Uso |
|:---|:---|:---:|:---|
| 0 — Base | `canvas-dark` | `#07090D` | Fondo general de la aplicación |
| 1 — Superficie | `surface-dark` | `#0B0E14` | Barras de navegación (Topbar, Navbar), Footer y Drawers |
| 2 — Tarjeta | `card-dark` | `#111620` | Tarjetas de producto en catálogo y paneles interiores |
| 3 — Hover | `card-hover-dark` | `#18202F` | Estado interactivo al pasar el cursor sobre tarjetas |

---

## 3. Tipografía

### Combinación de Fuentes

- **Inter** (sans-serif) — Texto general de la interfaz: títulos, párrafos, botones y etiquetas. Elegida por su alta legibilidad en pantallas pequeñas y sus números tabulares que alinean columnas de precios.
- **Consolas** (monospace) — Exclusiva para valores técnicos: precios en Soles, especificaciones de hardware (MHz, Watts, GB), códigos SKU y bloques de código del asistente virtual.

### Escala Tipográfica

| Rol | Rango de Tamaño | Peso | Tracking | Uso |
|:---|:---:|:---:|:---:|:---|
| Display H1 | 32–48px | 900 (Black) | -0.025em | Título principal del Hero Banner y nombre en ficha de producto |
| Section H2 | 20–30px | 900 (Black) | 0.015em | Encabezados de catálogo y títulos de modales |
| Card H3 | 14–16px | 700 (Bold) | Normal | Título de producto en tarjeta de grilla o lista |
| Price | 20–24px | 900 (Black) | Normal | Precios comerciales (`S/. 1,450.00`) — siempre en monospace |
| Body | 13–14px | 500 (Medium) | Normal | Párrafos descriptivos, respuestas de preguntas frecuentes |
| Specs | 11–12px | 600 (SemiBold) | Normal | Frecuencias, consumos y memoria (MHz, W, VRAM) — monospace |
| Badge | 10–11px | 800 (ExtraBold) | 0.05em | Etiquetas de stock disponible, porcentaje de descuento y marca |

### Reglas

- Los precios se representan **siempre en fuente monospace** para mantener alineados los dígitos verticalmente en tablas y carritos.
- Las especificaciones técnicas de hardware (frecuencias, consumo, bus) usan monospace para diferenciarse visualmente del texto comercial.
- Los títulos `H1` a `H3` utilizan peso 900 (Black). No se admiten pesos ligeros en encabezados principales.

---

## 4. Espaciado y Layout

### Grilla de Espaciado

Todo espaciado se basa en una **grilla base de 4px / 8px**. Márgenes, paddings y separaciones entre elementos deben ser múltiplos de 4px. La progresión estándar es: `4, 8, 12, 16, 24, 32, 48, 64`.

### Ancho de Contenedor

El ancho máximo del canvas central es de **1720px**, centrado con márgenes automáticos (`max-w-[1720px] mx-auto`). Esto optimiza la visualización en monitores panorámicos y ultrawide comunes en usuarios de PC gaming, manteniendo un límite de lectura cómodo.

### Breakpoints Responsivos

| Breakpoint | Ancho Mínimo | Dispositivo Objetivo |
|:---|:---:|:---|
| `sm` | 640px | Teléfonos en orientación horizontal, phablets |
| `md` | 768px | Tablets en orientación vertical |
| `lg` | 1024px | Laptops y monitores compactos |
| `xl` | 1280px | Monitores de escritorio estándar (1080p) |
| `2xl` | 1536px | Monitores de alta resolución (2K / QHD) |

### Escala de Radios de Curvatura

| Token | Medida | Uso |
|:---|:---:|:---|
| `sm` | 6px | Badges de estado, botones de paginación, chips de filtro |
| `md` | 12px | Campos de texto (inputs), botones estándar, miniaturas |
| `lg` | 16px | Tarjetas de producto en catálogo y contenedores secundarios |
| `xl` | 24px | Modales principales, Hero Banner y cajones laterales |
| `full` | 9999px | Botón flotante de IA, avatares y píldoras de stock |

---

## 5. Elevación y Z-Index

### Estrategia de Sombras

En modo oscuro, las sombras utilizan intensidades profundas (`shadow-black/40` a `shadow-black/90`). Los contenedores elevados se acompañan siempre de un borde sutil (`border-gray-800/80`) para delimitar los contornos sin generar contrastes duros.

### Jerarquía de Capas (Z-Index)

| Z-Index | Nivel de Capa | Elementos |
|:---:|:---|:---|
| `0` | Canvas base | Contenido principal de la página, grillas y secciones |
| `10` | Tarjetas activas | Tarjetas de producto en estado hover |
| `40` | Navegación fija | Topbar y Navbar fija con desenfoque de fondo (*backdrop blur*) |
| `50` | Superposiciones | Modales, cajones (*drawers*), toasts y ventana de chat IA |
| `60` | Lightbox | Visor de imágenes de producto a pantalla completa |

### Regla de Límite

**No se permite ningún z-index superior a 60.** Cualquier capa emergente que requiera atención sobre el lightbox exige el cierre previo del mismo, evitando la inflación de índices de apilamiento.

---

## 6. Movimiento y Animaciones GPU

### Curva de Aceleración

Todas las animaciones del sistema utilizan una curva cúbica de desaceleración: `cubic-bezier(0.16, 1, 0.3, 1)`. Esta curva produce una llegada suave y natural a la posición final, similar a las transiciones nativas de interfaces de escritorio modernas.

### Catálogo de Animaciones (`src/index.css`)

| Clase | Efecto Visual | Duración | Propiedades Aceleradas |
|:---|:---|:---:|:---|
| `animate-spartan-fade-in` | Opacidad 0 → 1 | 240ms | `opacity` |
| `animate-spartan-modal` | Escala 0.93 → 1 + Y 18px → 0 | 280ms | `transform, opacity` |
| `animate-spartan-drawer-right` | Desplazamiento X 100% → 0 | 300ms | `transform` |
| `animate-spartan-drawer-left` | Desplazamiento X -100% → 0 | 300ms | `transform` |
| `animate-spartan-chat` | Escala 0.84 → 1 + Y 28px → 0 | 280ms | `transform, opacity` |
| `animate-spartan-message` | Desplazamiento Y 10px → 0 | 220ms | `transform, opacity` |
| `animate-spartan-glow` | Pulso tenue de sombra dorada | Ciclo 2.5s | `box-shadow` |

Cada animación de entrada cuenta con su contraparte de salida simétrica (`*-exit`), asegurando que ningún elemento desaparezca con cortes bruscos al desmontarse del DOM.

### Reglas Técnicas

- Las animaciones se ejecutan exclusivamente sobre `transform` y `opacity`. Queda prohibido animar `width`, `height`, `top`, `left` o `margin`, ya que provocan recálculo de layout del navegador y degradan el rendimiento por debajo de 60 FPS.
- Todo modal o cajón lateral debe coordinar su ciclo de vida mediante el hook `useModalTransition`. Queda prohibido el renderizado condicional directo sin retención de nodo (`{isOpen && <Modal/>}`) porque elimina la animación de salida.

---

## 7. Iconografía y Medios de Pago Peruanos

Para proteger la nitidez en pantallas de alta densidad (Retina / 4K) y mantener el rendimiento sin solicitudes de imagen adicionales, todos los sellos de medios de pago peruanos son vectores SVG puros centralizados en el componente `Icons`:

| Medio de Pago | Color Primario | Color Secundario | Ubicación |
|:---|:---:|:---:|:---|
| Yape (BCP) | `#742284` | `#00D9C0` | Footer, Carrito de Compras y Modal de Reserva |
| Plin (Interbank/BBVA/Scotiabank) | `#00DFB6` | `#FF2E93` | Footer, Carrito de Compras y Modal de Reserva |
| Culqi | `#FF7800` | — | Footer y bloque informativo de pasarelas |
| Visa | `#1434CB` | — | Footer y bloque informativo de pasarelas |

Queda prohibido utilizar imágenes rasterizadas (PNG, JPG, WebP) para logotipos de pasarelas o marcas de pago.

---

## 8. Restricciones y Guardrails de Componentes

Estas directrices son de cumplimiento estricto para evitar regresiones visuales:

### Bordes en Modo Oscuro

En modo oscuro, los contenedores utilizan bordes sutiles `border-gray-800/80` o `border-0` combinados con sombras profundas. **Quedan prohibidos los bordes blancos (`border-white`) o grises claros (`border-slate-200`) en modo oscuro**, ya que rompen la jerarquía de elevación con líneas estridentes.

### Tamaño Mínimo de Área Táctil

Todo control interactivo en dispositivos móviles debe cumplir con un área táctil mínima de **44 × 44px** (pauta WCAG 2.5.5). Esto aplica a botones de acción, enlaces de navegación e iconos de cierre, incluso si su representación visual gráfica es más compacta.

### Superposiciones en Móvil

Los cajones laterales (*drawers*) y la ventana del asistente virtual ocupan el **100% de la pantalla (`fixed inset-0`) en resoluciones menores a 640px**. Los botones de cierre (`X`) y minimizado deben permanecer fijos y accesibles en la parte superior sin ser ocultados por el teclado virtual del dispositivo.

### Hub Centralizado de Iconos

Todos los iconos deben importarse desde el archivo común `Icons`. No se permite la inclusión de SVGs en línea dentro de vistas ni la adición de librerías externas de iconos. La librería base es Lucide React.

### Política de Emojis

**Cero emojis decorativos en la interfaz.** No se admiten emojis (🚀, 🔥, ✨, 💻, etc.) en títulos, botones, tarjetas de producto ni fichas técnicas. Toda señalización visual se realiza mediante vectores SVG de Lucide.

---

## 9. Lista de Verificación de Accesibilidad (WCAG 2.1 AA)

- [x] Todo texto principal cumple un ratio de contraste mínimo de 4.5:1 frente a su fondo
- [x] El acento dorado (`#FFDE17`) sobre fondo oscuro supera un ratio de 14:1 (clasificación AAA)
- [x] Todos los modales y cajones laterales se cierran al pulsar la tecla `Escape`
- [x] Los carruseles de productos permiten navegación por teclado con flechas izquierda y derecha
- [x] Los estados de foco visual activo utilizan `focus-visible:ring-2 focus-visible:ring-[#FFDE17]`
- [x] Las migas de pan incluyen `aria-label="Ruta de navegación"` y `aria-current="page"`
- [x] Los modales declaran atributos semánticos `role="dialog"` y `aria-modal="true"`
- [x] Las cintas de texto continuo decorativo (*marquees*) contienen `aria-hidden="true"`
- [x] Área táctil interactiva mínima garantizada de 44 × 44px en entornos táctiles

---

## 10. Gobernanza y Mantenimiento

### Modificación de Tokens

Cualquier ajuste a colores, fuentes, escalas de espaciado o radios debe aplicarse simultáneamente en tres puntos:
1. El encabezado YAML de este documento (`DESIGN.md`).
2. Las variables CSS `:root` y `.dark` en `src/index.css`.
3. La configuración de `tailwind.config.js` (si el token está mapeado en la utilidad de Tailwind).

### Reglas para Nuevos Componentes

Todo nuevo componente introducido al proyecto debe:
1. Ubicarse en el subdirectorio de dominio correspondiente (`layout/`, `modals/`, `home/`, `feedback/`, `common/`).
2. Importar iconos exclusivamente desde `src/components/common/Icons.jsx`.
3. Soportar temas oscuro y claro mediante la prop `isDarkMode`.
4. Utilizar `useModalTransition` si el componente cuenta con animaciones de entrada y salida.
5. Incorporar pruebas unitarias en `tests/production.test.js` si ejecuta cálculos de precios, filtros o transformaciones de datos.
