---
name: "Spartan Games Web"
description: "Design system for a high-performance gaming hardware e-commerce SPA. Tactical, premium, dark-first aesthetic inspired by aerospace and competitive gaming interfaces."
version: "2.5.0"
status: "production"
last_updated: "2026-09-17"

colors:
  # --- Brand ---
  primary: "#FFDE17"
  primary-hover: "#E5C713"
  primary-glow: "rgba(255, 222, 23, 0.18)"

  # --- Semantic ---
  danger: "#FF334B"
  success: "#25D366"
  info: "#38BDF8"

  # --- Surfaces (Dark) ---
  canvas-dark: "#07090D"
  surface-dark: "#0B0E14"
  card-dark: "#111620"
  card-hover-dark: "#18202F"
  border-dark: "rgba(31, 41, 55, 0.8)"
  border-subtle-dark: "rgba(55, 65, 81, 0.5)"
  text-primary-dark: "#F1F5F9"
  text-muted-dark: "#94A3B8"

  # --- Surfaces (Light) ---
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

Design system specification for **Spartan Games Web**.
This document defines the visual language, design tokens, component constraints, and interaction patterns.

For the software architecture (modules, data flow, invariants), see `docs/ARCHITECTURE.md`.

---

## 1. Brand Essence

### Voice

Spartan Games is a physical gaming hardware store in Arequipa, Peru. The brand communicates with a **tactical, direct tone**: precise technical specifications, transparent pricing in soles (S/.), and zero decorative filler. Every element exists to help the customer evaluate hardware and make a purchasing decision.

### Visual Identity

The visual system draws from two sources: **aerospace instrument panels** (high contrast, information-dense, functional layouts) and **competitive gaming interfaces** (dark backgrounds, accent-driven highlights, clean typography). The result is an interface that feels premium without being opulent.

### Target Audience

| Segment | Expectations |
|:---|:---|
| Competitive Gamers | Latest-gen GPUs, CPU benchmarks, clear stock counts, fast navigation |
| Content Creators & 3D Professionals | High-frequency RAM, NVMe Gen4/Gen5, assembly services, thermal testing data |
| Local Customers (Arequipa / Southern Peru) | Physical stock confirmation, local payment methods (Yape, Plin), store pickup at Compuplaza |

---

## 2. Color System

### Design Decisions

- **Gold (`#FFDE17`) is the single accent color.** It carries all calls-to-action, active states, and price highlights. This constraint prevents visual noise from competing accent colors.
- **Dark mode is the primary theme.** Light mode exists as an accessibility alternative, but the entire palette was designed dark-first.
- **Red is reserved for urgency.** Flash sales, low stock warnings, and discount badges. Never for decorative emphasis.
- **Green is reserved for WhatsApp and availability.** Stock indicators and WhatsApp buttons. Never for success toasts or generic confirmations.

### Contrast Ratios (WCAG 2.1 AA)

| Token | Value | Contrast vs `canvas-dark` | Rating |
|:---|:---:|:---:|:---:|
| `primary` | `#FFDE17` | 14.2:1 | AAA |
| `primary-hover` | `#E5C713` | 11.8:1 | AAA |
| `danger` | `#FF334B` | 5.8:1 | AA |
| `success` | `#25D366` | 8.6:1 | AAA |
| `info` | `#38BDF8` | 9.4:1 | AAA |

### Surface Elevation (Dark Mode)

Depth is communicated through incremental lightening of background colors, not through drop shadows alone:

| Level | Token | Hex | Usage |
|:---|:---|:---:|:---|
| 0 — Canvas | `canvas-dark` | `#07090D` | Page background |
| 1 — Surface | `surface-dark` | `#0B0E14` | Navbar, Footer, Drawers |
| 2 — Card | `card-dark` | `#111620` | Product cards, panels |
| 3 — Hover | `card-hover-dark` | `#18202F` | Interactive hover state on cards |

---

## 3. Typography

### Font Pairing

- **Inter** (sans-serif) — All UI text: headings, body copy, buttons, labels. Chosen for its high legibility at small sizes on screens and its native tabular figures for price alignment.
- **Consolas** (monospace) — Technical values only: prices in soles, hardware specs (MHz, W, GB), SKU codes, and code snippets in the chatbot.

### Type Scale

| Role | Size Range | Weight | Tracking | Usage |
|:---|:---:|:---:|:---:|:---|
| Display H1 | 32–48px | 900 (Black) | -0.025em | Hero banner title, product name |
| Section H2 | 20–30px | 900 (Black) | 0.015em | Catalog headers, modal titles |
| Card H3 | 14–16px | 700 (Bold) | Normal | Product card title |
| Price | 20–24px | 900 (Black) | Normal | `S/. 1,450.00` — always monospace |
| Body | 13–14px | 500 (Medium) | Normal | Descriptions, FAQ answers |
| Specs | 11–12px | 600 (SemiBold) | Normal | MHz, Watts, VRAM — always monospace |
| Badge | 10–11px | 800 (ExtraBold) | 0.05em | Stock count, discount %, brand pill |

### Rules

- Prices are **always rendered in monospace** so digit columns align vertically in lists and tables.
- Hardware specifications (clock speeds, wattage, memory) use monospace to distinguish technical data from marketing copy.
- All heading weights are 900 (Black). Do not use lighter weights for `h1`–`h3`.

---

## 4. Spacing & Layout

### Grid

All spacing is based on a **4px / 8px grid**. Margins, padding, and gaps must be multiples of 4px. The standard progression is: `4, 8, 12, 16, 24, 32, 48, 64`.

### Container

The maximum content width is **1720px**, centered with auto margins. This accommodates ultra-wide monitors (common among hardware enthusiasts) while maintaining readable line lengths.

### Responsive Breakpoints

| Breakpoint | Width | Target |
|:---|:---:|:---|
| `sm` | 640px | Phones in landscape, phablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktop 1080p |
| `2xl` | 1536px | 2K / QHD monitors |

### Border Radius Scale

| Token | Value | Usage |
|:---|:---:|:---|
| `sm` | 6px | Badges, pagination buttons, tech chips |
| `md` | 12px | Text inputs, standard buttons, thumbnails |
| `lg` | 16px | Product cards, secondary containers |
| `xl` | 24px | Modals, hero banner, navigation drawers |
| `full` | 9999px | AI chat button, avatars, status pills |

---

## 5. Elevation & Z-Index

### Shadow Strategy

Dark mode shadows use `shadow-black/40` to `shadow-black/90`. Light mode shadows use standard Tailwind defaults. Elevated components always pair a shadow with a subtle border (`border-gray-800/80` in dark mode) to maintain edge definition.

### Stacking Order

| Z-Index | Layer | Elements |
|:---:|:---|:---|
| `0` | Canvas | Page content, sections |
| `10` | Elevated cards | Product cards on hover |
| `40` | Sticky nav | Topbar, Navbar with backdrop blur |
| `50` | Overlays | All modals, drawers, toasts, chat bubble |
| `60` | Lightbox | Fullscreen image viewer |

### Rule

**No z-index above 60.** If a new overlay needs to appear above the lightbox, the lightbox must be dismissed first. This prevents z-index inflation.

---

## 6. Motion

### Easing

All animations use a single easing curve: `cubic-bezier(0.16, 1, 0.3, 1)` — a decelerating curve inspired by macOS spring physics. This gives entrances a natural "settling" feel.

### Animation Catalog

All animation classes are defined in `index.css` with the `animate-spartan-*` prefix:

| Class | Effect | Duration | Properties |
|:---|:---|:---:|:---|
| `animate-spartan-fade-in` | Opacity 0 → 1 | 240ms | `opacity` |
| `animate-spartan-modal` | Scale 0.93 → 1 + Y 18px → 0 | 280ms | `transform, opacity` |
| `animate-spartan-drawer-right` | X 100% → 0 | 300ms | `transform` |
| `animate-spartan-drawer-left` | X -100% → 0 | 300ms | `transform` |
| `animate-spartan-chat` | Scale 0.84 → 1 + Y 28px → 0 | 280ms | `transform, opacity` |
| `animate-spartan-message` | Y 10px → 0 | 220ms | `transform, opacity` |
| `animate-spartan-glow` | Pulsing gold box-shadow | 2.5s loop | `box-shadow` |

Every entrance animation has a corresponding exit (`*-exit`) with symmetric timing to prevent flash-on-unmount.

### Rules

- Animations only touch `transform` and `opacity`. Animating `width`, `height`, `top`, `left`, or `margin` is forbidden — these trigger layout recalculation and destroy 60fps performance.
- The `useModalTransition` hook must coordinate all mount/unmount cycles. Direct conditional rendering (`{isOpen && <Modal/>}`) without the hook is forbidden because it skips exit animations.

---

## 7. Payment Icons

All payment method icons are hand-crafted SVG vectors centralized in the `Icons` component. Raster images (PNG/JPG) of payment logos are forbidden because they degrade at non-standard DPI and violate brand guidelines.

| Provider | Primary Color | Secondary Color |
|:---|:---:|:---:|
| Yape (BCP) | `#742284` | `#00D9C0` |
| Plin (Interbank/BBVA/Scotiabank) | `#00DFB6` | `#FF2E93` |
| Culqi | `#FF7800` | — |
| Visa | `#1434CB` | — |

---

## 8. Component Constraints

These rules apply to every component in the system. They exist to prevent the most common visual regressions:

### Dark Mode Borders

In dark mode, containers use `border-gray-800/80` or `border-0` paired with deep shadows. **`border-white` and `border-slate-200` are forbidden in dark mode** — they create a harsh, out-of-place glow that breaks the surface elevation hierarchy.

### Touch Targets

All interactive elements on mobile must have a minimum touch area of **44 × 44px** (WCAG 2.5.5). This applies to buttons, links, and icon toggles, even if the visible element is smaller than 44px.

### Mobile Overlays

Drawers and the chat interface occupy **100% of the viewport** on screens below `640px`. This prevents half-visible modals and ensures ergonomic one-handed use. The close button (`X`) and minimize controls must remain accessible above the mobile keyboard at all times.

### Icon Usage

All icons are imported from the centralized `Icons` component. Inline SVG strings and external icon libraries (FontAwesome, Material Icons) are forbidden. Lucide React is the base icon set; custom vectors are only added for Peruvian payment providers.

### Emoji Policy

**Zero decorative emojis in the UI.** No rocket, fire, sparkle, or computer emojis in headings, buttons, badges, or product cards. All visual indicators use Lucide SVG icons. This is a brand constraint, not a suggestion.

---

## 9. Accessibility Checklist (WCAG 2.1 AA)

- [x] All text passes 4.5:1 contrast ratio against its background
- [x] Gold accent on dark canvas exceeds 14:1 (AAA)
- [x] All modals and drawers close on `Escape` keypress
- [x] Carousels support left/right arrow key navigation
- [x] Focus rings use `focus-visible:ring-2 focus-visible:ring-[#FFDE17]`
- [x] Breadcrumbs include `aria-label="Ruta de navegación"` and `aria-current="page"`
- [x] Modals include `role="dialog"` and `aria-modal="true"`
- [x] Decorative marquees include `aria-hidden="true"`
- [x] Minimum touch target size: 44 × 44px on mobile

---

## 10. Governance

### Modifying Tokens

Any change to colors, typography, spacing, or radii must be updated simultaneously in:
1. The YAML front-matter of this document
2. The `:root` / `.dark` variables in `index.css`
3. `tailwind.config.js` (if the token is extended there)

Changing a token in only one location creates visual drift that is difficult to debug.

### Adding Components

New components must:
1. Be placed in the correct subdirectory (`layout/`, `modals/`, `home/`, `feedback/`, `common/`)
2. Import all icons exclusively from `Icons`
3. Support both dark and light themes via the `isDarkMode` prop
4. Use `useModalTransition` if the component mounts/unmounts with animation
5. Include unit tests in `tests/production.test.js` if the component performs calculations (prices, filters, parsing)
