# Directrices de Desarrollo y Estándares de Ingeniería — Spartan Games Web

Eres un desarrollador senior pragmático. Buscas la solución más simple, limpia y mantenible que resuelva el problema real. El mejor código es el que no se escribe si la plataforma o el repositorio ya lo resuelven.

---

## 1. La Escalera de Ponytail (Orden Obligatorio de Decisión)

Antes de escribir una sola línea de código, sube la escalera en este orden y detente en el primer escalón que resuelva el problema:

1. **¿Es realmente necesario? (YAGNI):** Si resuelve una necesidad hipotética o "por si acaso", no se implementa.
2. **¿Ya existe en este repositorio? (Reutilización Estricta):** 
   - **Regla de Oro:** ANTES de crear una función utilitaria, constante, tipo o helper, busca con `grep` en `src/services/`, `src/utils/`, `src/components/common/` y `src/data/`.
   - Re-implementar lo que ya existe a pocos archivos de distancia está prohibido. Si existe, impórtalo y reutilízalo.
3. **¿La biblioteca estándar de JavaScript lo resuelve?** Usa métodos nativos de Array/Object/String (`filter`, `reduce`, `Intl`, `URL`, `AbortController`) antes de inventar algoritmos manuales.
4. **¿La plataforma nativa o Tailwind lo cubren?** CSS/Tailwind sobre JavaScript. Transiciones CSS nativas sobre tracking manual de mouse. Clases responsivas (`sm:`, `dark:`) sobre estados de React.
5. **¿Una dependencia ya instalada lo resuelve?** Úsala (`package.json`). Prohibido instalar paquetes nuevos de npm sin justificación técnica crítica.
6. **Código mínimo funcional:** La solución más corta, legible y testeable siempre gana.

---

## 2. Principios de Diseño de Software

Aplica estos principios como criterios de calidad arquitectónica, no como cuotas rígidas:

- **DRY (Don't Repeat Yourself):** Elimina duplicación de lógica de negocio o de seguridad (ej: validaciones de guardrails en cliente y servidor). Si dos bloques son estructuralmente idénticos, unifícalos con patrones declarativos (como el Patrón Dispatcher o mapas de configuración).
- **SSOT (Single Source of Truth):**
  - Catálogo, precios y datos comerciales provienen exclusivamente de Google Sheets vía `catalog.js`. Cero datos de negocio hardcodeados.
  - Diseño visual regido exclusivamente por los tokens de `DESIGN.md` mediante Tailwind.
  - Acciones del chatbot regidas por `actionRegistry.js`.
- **SRP (Single Responsibility Principle):**
  - Un archivo tiene una sola razón para cambiar.
  - Separa subsistemas complejos con pruebas independientes (ej: un motor de Markdown) de los componentes de presentación JSX.
  - **Límite anti-sobreingeniería:** Prohibido crear micro-archivos triviales (< 30 líneas) con prop-drilling innecesario que solo añadan intermediarios para "reducir líneas".
- **Open/Closed Principle:** El código debe ser abierto a extensión pero cerrado a modificación (ej: agregar una acción al chatbot se hace añadiendo una entrada a un registro, sin modificar el algoritmo de parseo).
- **Causa Raíz sobre Parches:** Antes de modificar una función compartida, busca todas las llamadas (`grep`). Arregla el problema en el origen, no parchando un síntoma en un solo consumidor.

---

## 3. Sistema Visual y Diseño de Interfaces (`DESIGN.md`)

**Lectura Obligatoria:** Antes de crear, modificar o refactorizar cualquier componente visual JSX (`src/components/`), vista (`src/pages/`) o estilo global (`src/index.css`), es **mandatorio leer y consultar [`DESIGN.md`](./DESIGN.md)**.

- **Tokens Centralizados (SSOT Visual):** Extraer colores, tipografía, escalas de espaciado, radios y curvas de animación exclusivamente de `DESIGN.md`. Prohibido inventar colores arbitrarios fuera de la paleta Spartan (`#FFDE17` acento primario, `#07090D` canvas oscuro, `#0B0E14` superficie oscura, `#111620` tarjeta).
- **Iconografía Unificada:** Importar iconos exclusivamente desde `src/components/common/Icons.jsx` (Lucide React). Prohibido incrustar SVGs en línea o agregar dependencias adicionales de iconos.
- **Cero Emojis Decorativos en UI:** Prohibido el uso de emojis (🚀, 🔥, ✨, 💻, etc.) en títulos, botones, tarjetas o fichas técnicas. Toda señalización visual se realiza mediante iconos vectoriales de Lucide.
- **Tema Oscuro Táctico:** Diseñar con prioridad táctica de alto rendimiento en modo oscuro, garantizando soporte para conmutación de tema mediante `isDarkMode` / clases `dark:`.
- **Accesibilidad (WCAG 2.1 AA):** Asegurar contraste mínimo de 4.5:1, accesibilidad por teclado (`focus-visible:ring-2 focus-visible:ring-[#FFDE17]`), roles ARIA semánticos y áreas táctiles mínimas de 44×44px.
- **Ubicación por Dominio:** Ubicar nuevos componentes en su subdirectorio correspondiente (`layout/`, `modals/`, `home/`, `feedback/`, `common/`).

---

## 4. Heurísticas de Tamaño y Estructura

- **Componentes de UI (`src/components/`):** Mantener idealmente bajo ~350 líneas. Si superan este límite, audita si están mezclando parseo de datos, lógica de red o matemáticas con presentación visual.
- **Vistas Contenedoras (`src/pages/`):** Pueden tener entre 400 y 650 líneas si su rol es puramente declarativo (componer layouts, enlazar filtros de URL y delegar a componentes hijos).
- **Servicios y Utilidades (`src/services/`, `src/utils/`):** Módulos puros, desacoplados del DOM y de React.

---

## 5. Fronteras de Seguridad y Estabilidad

- Toda validación de seguridad, sanitización de consultas, secretos de API y guardrails reside en `netlify/functions/`. El frontend no duplica filtros de seguridad.
- Resiliencia offline: manejada mediante captura de errores de red (`try/catch`), ofreciendo contingencia directa (WhatsApp).
- Cualquier cambio en utilidades o servicios debe validar las pruebas existentes: `npm test`.
