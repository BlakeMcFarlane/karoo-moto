# KarooMoto Rally Tower — build brief (read this before writing a line)

You are building **one part** of a single, cinematic, premium storefront:
a landing page, a product page and a cart, sharing one design system. Other
people are building the other parts in parallel. The only reason the result
will look like one designer made it is that everyone follows this document
exactly.

See **§10 Site architecture** for how the three pages fit together.

Reference standard: the VanMoof S6 product page — its pacing, restraint,
full-bleed imagery, scroll-reveal discipline and typographic confidence. Do not
copy VanMoof's branding, layout literally, or content. Match the **level**.

---

## 1. Non-negotiables

- **Never invent a colour, font size, spacing value, easing curve or duration.**
  Everything comes from `src/styles/rally/tokens.css`. If you catch yourself
  typing a hex code or a `ms` value, stop and use a token.
- **Never re-implement a button, card, eyebrow, rule, chip, icon plate or
  reveal.** They exist in `src/styles/rally/base.css`. Use them.
- **Only these font weights are embedded.** Anything else gets synthesised by
  the browser and looks cheap:
  - `Barlow Condensed` (`--rt-display`): **600, 700**
  - `Inter` (`--rt-body`): **400, 500, 600, 700**
  - `IBM Plex Mono` (`--rt-mono`): **500**
- **Every class you write is prefixed `rt-`** and namespaced to your section
  (e.g. `.rt-hero__title`, `.rt-fitment__year`). Never style a bare element
  selector outside your own block.
- **You own exactly two files.** Your component `.tsx` and your CSS partial.
  Do not edit `base.css`, `tokens.css`, `rally.css`, another section's files,
  or any shared file. If you genuinely need a new shared primitive, note it in
  your final report instead of adding it.
- **No new dependencies.** React 18 + react-router-dom only. No Framer Motion,
  no GSAP, no Tailwind. Motion is CSS + the hooks in `src/lib/motion.ts`.
- **No placeholder content, no lorem, no "TODO", no fake logos, no stock-photo
  URLs.** Every image is one of the six supplied product photographs or the two
  brand assets. Every word of copy comes from `src/data/rallyTower.ts`.

---

## 2. Brand & assets

The visual identity is derived from two supplied assets, both already
optimised and in `src/assets/rally/`:

| File | What it is | Use it for |
| --- | --- | --- |
| `backsplash.jpg` (1717×916) | Rider silhouetted against an orange Karoo sunset over layered mountains | The hero ground and the closing brand moment. It is the emotional anchor of the page. |
| `logo-badge-720.jpg` / `logo-badge-320.jpg` | The circular KarooMoto badge — teal sky, ember sun, acacia, rider, "CRADLE OF HUMANKIND", coordinates | Brand marks. **The badge is square with dark corners — you must clip it: `clip-path: circle(49.5% at 50% 50%)` or `border-radius: 50%`.** Use the 320 for anything under 160px rendered. |

Product photography (all shot against a light grey studio wall or in situ):

| File | Subject | Notes |
| --- | --- | --- |
| `tower-studio-01.jpeg` (1080×1430) | Full tower, three-quarter view, screen + lights + switches visible | The definitive product shot. Portrait. |
| `tower-detail-lights.jpeg` (1080×1350) | Close-up of the quad-optic light pod behind the polycarbonate screen, springbok mark etched | Portrait. Beautiful specular detail. |
| `tower-detail-mount.jpeg` (1080×1324) | Close-up of the laser-cut top plate and machined stainless hardware | Portrait. |
| `tower-detail-plate.jpeg` (940×1324) | Extreme close-up: etched springbok mark, bolt heads, plate edges | Portrait. Most abstract/texture-like. |
| `tower-on-bike-night.jpeg` (960×1280) | Tower fitted to a KTM in a workshop, **lights on** — white beam and yellow dust light both lit | Portrait. This is the proof shot for the lighting story. |
| `tower-on-bike-full.jpeg` (1200×1600) | Complete Red Bull-liveried KTM EXC-F on a stand, tower fitted, yellow light lit | Portrait. The "real bike" shot. |

**Every product photo is portrait.** Design around that: tall media columns,
portrait-cropped panels, `object-fit: cover` with deliberate `object-position`.
Do not letterbox a portrait photo into a wide box and leave grey bars.

The studio shots have a light grey background. When placing them on the near-black
page, either (a) crop in tight so the background barely reads, or (b) use a
soft mask/gradient so they don't sit as bright rectangles. Never drop a raw
light-grey rectangle onto the ink ground — it reads as a broken image.

**Colour discipline:** ~70% ink/graphite, ~18% bone/steel, ~9% ember, ~3% teal.
Ember (`--rt-ember`) is the action colour — primary CTAs, the eyebrow tick, the
active state. Teal (`--rt-teal-hi`) is the technical accent — diagram lines,
data read-outs, "compatible" confirmations. Never use them interchangeably, and
never use ember for two adjacent, competing things.

---

## 3. Content

**All copy lives in `src/data/rallyTower.ts`.** Import it. Do not retype it,
do not paraphrase it, do not write new marketing copy. Read the module before
you start — it exports `RALLY_TOWER`, `KEY_STATS`, `FEATURES` (+ the
`heroFeatures` / `supportFeatures` / `materialFeatures` selectors), `WIRING`,
`TRUST`, `IMPORTANT_INFO`, `CLOSING`, and the whole fitment tree.

You may write short connective microcopy (a button label, an aria-label, a
column header, a caption of a few words) where the data module doesn't provide
one — keep it in the brand's voice: plain, technical, confident, understated.
No exclamation marks. No "revolutionary", "game-changing", "unleash".
South African English (`aluminium`, `-ise`).

**Never state a fact that isn't in the data module.** No invented weights,
dimensions, lumen figures, prices, dates, testimonials, review counts, ratings,
customer numbers or certifications. If a section feels like it needs a number
you don't have, use the ones in `KEY_STATS`.

---

## 4. Motion

Import from `src/lib/motion.ts`:

```ts
usePrefersReducedMotion()                       // boolean
useInView<T>({threshold, rootMargin, once})     // [ref, inView]
useScrollProgress<T>({start, end, mode})        // [ref, 0..1]
useScrollY()                                    // number, rAF-throttled
lerp, clamp, mapRange, easeOut, easeInOut       // math helpers
```

And the wrapper component `src/components/rally/Reveal.tsx`:

```tsx
<Reveal variant="up|fade|clip|scale|blur|line" delay={120} className="...">
```

Rules:

- **Reveals**: use `<Reveal>`. Stagger siblings with `delay` in steps of
  **80–120ms**, never more than ~5 steps (600ms) or the last item feels broken.
- **Scroll-scrubbed scenes**: use `useScrollProgress` and write the value into a
  CSS custom property on the element (`style={{'--p': progress}}`), then do the
  actual animation in CSS with `calc()`. Do **not** set `transform` strings from
  React on every frame.
- **Only animate `transform`, `opacity`, `clip-path` and `filter`.** Never
  animate `width`, `height`, `top`, `left`, `margin` or `background-position` on
  scroll.
- **Durations**: `--rt-t-reveal` (1120ms) for entrances, `--rt-t-med` (380ms)
  for hover/interface, `--rt-t-tap` (120ms) for presses. Curves:
  `--rt-ease-out` for entrances and hovers, `--rt-ease-in-out` for scrubbed
  scenes.
- **Motion must mean something.** Every animation should either reveal
  information, direct attention to the product, or demonstrate a product
  feature. If it only exists because movement is nice, delete it.
- **`prefers-reduced-motion` must leave a complete, readable, correct page.**
  `base.css` neutralises the reveal classes globally, but any inline transform
  you drive from JS is yours to disable — check `usePrefersReducedMotion()`.
- **Never animate anything above the fold on a delay longer than 600ms.** The
  hero must feel instant.

---

## 5. Layout & rhythm

```
.rt-section              vertical rhythm — always wrap your section in this
.rt-section--sm          tighter rhythm for secondary sections
.rt-section--bone        light (bone paper) section; primitives adapt automatically
.rt-section--panel       slightly lifted dark panel
.rt-container            max 1360px + fluid gutter
.rt-container--narrow    max 880px, for text-led sections
.rt-container--wide      max 1620px, for full-bleed-ish media
.rt-head / --wide / --center     the section heading block
.rt-grid --2 --3 --4     responsive grids, already collapse at 1000px / 640px
```

- **Section rhythm is `--rt-section-y`.** Do not add ad-hoc `margin-top: 120px`.
- **Alternate.** The page must alternate dark → dark-panel → bone → full-bleed
  imagery so it never feels like a wall of the same block. Your section's
  assigned ground is listed in your task — respect it, the neighbours depend on
  it.
- **Text measure never exceeds `--rt-maxw-text` (62ch).** Ledes are shorter.
- **Headings are `text-wrap: balance`, body is `text-wrap: pretty`.** Already
  set on the primitives.
- **Optical alignment matters.** Eyebrow → heading → lede → action is the
  standard stack, all left-aligned to the same edge unless the section is
  explicitly centred.

---

## 6. Responsive

Test and design at all six of these. They are audited:

| Name | Width |
| --- | --- |
| Large desktop | 1920 |
| Laptop | 1440 |
| Small laptop | 1280 |
| Tablet landscape | 1024 |
| Tablet portrait | 768 |
| Mobile | 390 |
| Narrow mobile | 320 |

- **Mobile-first is not optional.** The 390px layout must be as considered as
  the 1440px one — not a squashed desktop.
- Breakpoints: use `max-width` queries at **1200px, 1000px, 768px, 560px** to
  stay in step with the rest of the page. Don't invent new ones unless your
  content genuinely breaks elsewhere.
- **Nothing may cause horizontal overflow.** Full-bleed elements use
  `width: 100%` + `overflow: clip`, never `100vw` (scrollbar gutter).
- **Touch targets ≥ 44×44px.** Buttons already satisfy this; your custom
  controls must too.
- Sticky elements must not stack up and eat a phone screen. Check yours against
  `--rt-header-h` and `--rt-buybar-h`.
- Scroll-scrubbed sticky scenes: on ≤768px, either shorten the scroll distance
  substantially or fall back to a static composition. A 300vh sticky scene on a
  phone is a trap.

---

## 7. Accessibility

- **Semantic landmarks**: your section is a `<section>` with an
  `aria-labelledby` pointing at its heading `id`. Headings descend properly —
  the page has exactly one `<h1>` (the hero). Yours is an `<h2>`, sub-heads are
  `<h3>`.
- **Decorative imagery gets `alt=""`.** Informative imagery gets a real
  description of what it shows.
- **Interactive elements are `<button>` or `<a>`** — never a `div` with
  `onClick`. Custom selectors need real keyboard support (arrow keys where it's
  a listbox/radiogroup, Enter/Space to activate) and correct ARIA
  (`role="radiogroup"` + `aria-checked`, or `aria-expanded` for disclosures).
- **Focus is always visible.** `:focus-visible` is styled globally — do not
  remove outlines. If your control has a custom shape, make sure the ring reads
  against your background.
- **Contrast**: body text on ink must be `--rt-text` or `--rt-text-2`.
  `--rt-text-3` is for large mono labels only, never for paragraphs. On bone,
  use `--rt-bone-ink` / `--rt-bone-ink-2`.
- Anything that changes as a result of user action must be announced —
  `aria-live="polite"` on fitment results, cart feedback, etc.
- Images need explicit `width`/`height` **or** an aspect-ratio container so the
  page doesn't shift as photos load. Use `loading="lazy"` + `decoding="async"`
  on everything except the hero image.

---

## 8. Performance

- Total page imagery is ~1.1MB and that is the budget — do not add more.
- `loading="lazy"` on every image below the fold. The hero image is
  `fetchpriority="high"` and eager.
- No layout thrash: never read `getBoundingClientRect()` outside the rAF
  callbacks the motion hooks already provide.
- `will-change` only on elements that actually animate on scroll, and never on
  more than a handful at once.
- No `backdrop-filter` on large, frequently-repainting surfaces (it's fine on
  the nav and the buy bar).

---

## 9. Code conventions

Match the existing codebase — read a neighbouring file before you start.

- TypeScript, `.tsx`, function components, named default export.
- Two-space indent, no semicolons, single quotes. (The repo has no Prettier
  config; follow what the existing files do.)
- Props typed with an `interface` above the component.
- Comments explain **why**, not what. The existing files are lightly but
  genuinely commented — match that density, don't over-annotate.
- `npm run lint` (`tsc --noEmit`) must pass. No `any`, no `@ts-ignore`, no
  unused imports — `noUnusedLocals` is on.
- Don't add `React` imports (the JSX transform is automatic).

---

## 10. Site architecture

The site is three pages and one flow:

```
Landing (/)  →  Product (/product)  →  Cart (/cart)  →  Shopify checkout
```

Chrome is app-level: `RallyNav` and `SiteFooter` render once in `App.tsx` on
every route, and `TowerConfigProvider` wraps the whole app so the motorcycle a
customer picks on the product page is the same selection the cart reads.

**Landing page sections and grounds** (it sells; it does not transact — every
CTA leads to `/product`):

| # | Component | Ground | Role |
| --- | --- | --- | --- |
| 1 | `Hero` | full-bleed backsplash | the promise |
| 2 | `ProvenInAfrica` | ink, full-bleed media | the proof |
| 3 | `RiderFocused` | panel, sticky diagram | the differentiator |
| 4 | `FeatureShowcase` | ink | what it does |
| 5 | `Gallery` | panel | what it is |
| 6 | `LightingWiring` | **bone** | how it installs |
| 7 | `Trust` | **bone** | why it's safe to buy |
| 8 | `ImportantInfo` | ink, low-key | the disclosure |
| 9 | `ClosingBrand` | full-bleed backsplash | the brand moment |
| 10 | `BuyBar` | fixed bottom | persistent CTA → `/product` |

**Product page** (`ProductGallery`, `BikeSelector`, `BuyPanel`) owns the
compatibility selector and Add to Cart. **Cart page** owns quantities, the line
configuration and the Shopify checkout hand-off.

**Commerce.** Shopify is the backend — catalog, pricing, cart, checkout,
payment, shipping, taxes, orders. `src/lib/shopify.ts` is the adapter;
`CartContext` falls back to local state when the store is unconfigured and says
so plainly rather than faking a checkout. The selected motorcycle travels as
Shopify **cart line attributes** so it appears on the order.

**Compatibility** is Brand → Model → Year → (Variant). Years are scoped to the
model, so a 2025 CRF450L or a 2019 CRF450RL is unreachable. `isComplete` in
`TowerConfig` is the single gate Add to Cart reads.

## 10a. Shared primitives added during the build

These were requested by section builders and now live in `base.css` / `tokens.css`.
Use them instead of re-implementing — several sections currently hand-roll
equivalents and should be migrated:

| Primitive | Replaces |
| --- | --- |
| `.rt-scrim` + `--bottom` `--left` `--top` `--vignette` `--veil` | hand-rolled ink gradients over photography. `--veil` reads `--rt-veil` so a scrubbed scene can lighten it. |
| `.rt-glass` (+ `--rt-glass-bg`, `--rt-glass-blur`) | the nav / buy-bar "ink + backdrop-blur + hairline" surface |
| `.rt-divided` | inline link rows with wrap-safe hairline separators; stacks under 560px |
| `.rt-stack-ruled` | `> * + * { border-top }` rows |
| `.rt-media--feather` (+ `--rt-feather`) | the radial alpha mask that dissolves a light-grey studio shot into the ink ground |
| `.rt-dot` / `.rt-dot--teal` | standalone status cues (`.rt-chip__dot` is chip-only and takes `currentColor`) |
| `.rt-link--hit` | a `.rt-link` that needs a 44px target without the underline detaching |
| `--rt-z-grain/sticky/buybar/nav/overlay` | guessed z-indexes |
| `--rt-fs-figure` | pulled-out numerals between h2 and h3 (price, "45", "12") |
| `--rt-block-lg` | the gap between sub-groups inside one section |
| `--rt-card-pad`, `--rt-hit`, `--rt-stagger` | re-typed `clamp()`s and magic numbers |
| `--rt-ink-rgb`, `--rt-on-ember`, `--rt-line-bone`, `--rt-bone-ink-3` | raw rgba/hex |
| `--rt-t-clip`, `--rt-t-line` | literal reveal durations |

**Bone sections**: `.rt-section--bone` now re-points `--rt-text`, `--rt-text-2`,
`--rt-text-3`, `--rt-line`, `--rt-line-2` and the shadows to their light-ground
equivalents. You no longer need bone-specific overrides for hairlines, card
hovers or link hovers — and a section that reaches for `--rt-text-2` on bone
now gets a readable colour rather than an invisible one.

## 11. The bar

Before you report done, look at your section and ask:

- Would this survive being placed next to the VanMoof S6 page?
- Is there a single value in my CSS that isn't a token?
- Does anything here look like a Shopify theme? (Rounded pill cards, drop
  shadows on everything, centred everything, generic icon + heading + paragraph
  triplets, gradient buttons, emoji.) Fix it.
- Does it hold up at 320px, 768px and 1920px, and with reduced motion on?
- Is every animation earning its place?
- Is the Rally Tower still the thing the eye lands on?

"It renders and it compiles" is not done.
