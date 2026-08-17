# KarooMoto — Rally Tower storefront

A custom storefront for the KarooMoto Rally Tower. The site owns the entire
visual shopping experience; **Shopify is the commerce backend** and the customer
is only handed over at checkout.

```
Landing (/)  →  Product (/product)  →  Cart (/cart)  →  Shopify checkout
```

**Going live:** [`docs/GOING-LIVE.md`](docs/GOING-LIVE.md) — creating and
publishing the Shopify product, Storefront API access, payments, shipping, tax,
and hosting on a GoDaddy domain.

---

## Commands

```bash
npm install

npm run dev                # dev server → http://localhost:5173/
npm run build              # type-check + production build → dist/
npm run preview            # serve the production build locally
npm run lint               # type-check only (tsc --noEmit)
```

### Tests

Both suites drive the real site in a real browser (headless Edge/Chromium via
`puppeteer-core`). **The dev server must be running.**

```bash
npm test                   # both suites below

npm run test:chrome        # 49 route × viewport checks: no text hidden behind
                           # the fixed nav on any route or screen size
npm run test:fitment       # 107 assertions over the bike-compatibility selector:
                           # per-model year scoping, unreachable combinations,
                           # cascade clearing, and what lands on the cart line
```

### Audit tooling

```bash
npm run check              # static QA: design tokens, class/CSS parity,
                           # embedded font weights, 100vw, asset imports

npm run shoot              # screenshot all 7 viewports of the landing page,
                           # reporting horizontal overflow and console errors
```

`shoot` takes flags:

```bash
node scripts/shoot.mjs --only=mobile           # one viewport
node scripts/shoot.mjs --page=product          # another route (NOT --route=)
node scripts/shoot.mjs --page=policies/returns
node scripts/shoot.mjs --sections              # also capture each section
node scripts/shoot.mjs --motion=reduce         # emulate prefers-reduced-motion
node scripts/shoot.mjs --tag=before            # name the output folder
```

Output lands in `shots/<tag>/`, which is gitignored. Viewports are
`desktop-xl` 1920, `laptop` 1440, `laptop-sm` 1280, `tablet-land` 1024,
`tablet-port` 768, `mobile` 390, `mobile-narrow` 320.

> Use `--page=`, not `--route=`. Git Bash on Windows rewrites a leading-slash
> argument into a filesystem path, which produces a baffling "invalid URL".

### Shopify

```bash
npm run shopify:discover   # verify the Storefront connection and print every
                           # product/variant GID, including the line to paste
                           # into VITE_SHOPIFY_VARIANT_RALLY
```

It names the specific failure rather than dying silently — wrong domain,
rejected token, an Admin token pasted by mistake, or products not published to
the headless sales channel.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | The Rally Tower landing page. Sells; does not transact — every CTA leads to `/product`. |
| `/product` | Product card, image gallery, dependent Brand → Model → Year compatibility selector, Add to Cart. |
| `/cart` | Line items with the selected motorcycle, quantities, Terms acceptance, and the hand-off to Shopify. |
| `/about` | The founder's story. |
| `/policies/:doc` | `terms`, `returns`, `warranty`, `shipping`, `privacy`. |

Chrome (`RallyNav`, `SiteFooter`) and the configurator state
(`TowerConfigProvider`) are app-level, so the motorcycle chosen on the product
page is the same selection the cart and the landing CTAs read.

Routing is `HashRouter`, so deep links work on any static host with no server
rewrites.

---

## Project structure

```
src/
  data/            All copy and product data. Nothing is hard-coded in components.
    rallyTower.ts    Product, features, and the Brand → Model → Year fitment tree
    about.ts         The founder's story (verbatim)
    terms.ts         Terms & Conditions (verbatim, supplied legal text)
  lib/
    motion.ts        Scroll hooks: useInView, useScrollProgress, useScrollY
    shopify.ts       Storefront API adapter (cart, checkout hand-off)
  context/
    CartContext.tsx  Cart state — Shopify-backed, with a local fallback
  components/rally/  Every section and shared component
  styles/
    rally/tokens.css The ONLY place colour, type scale, spacing, easing and
                     duration are defined
    rally/base.css   Shared primitives: buttons, cards, eyebrows, rules, chips,
                     scrims, reveals
    app.css          Reset, document ground, skip link, toast
  pages/
```

`docs/rally-tower-brief.md` is the design contract every contributor builds
against — read it before changing anything visual.

---

## Content and legal text

Three modules are **transcribed verbatim** and must not be reworded,
summarised, reordered or "brand-voiced":

- `src/data/about.ts` — the founder's first-person story
- `src/data/terms.ts` — the supplied Terms & Conditions, all 21 sections
- The policy documents in `src/pages/Policy.tsx`

`/policies/terms` and the checkout acceptance modal both render `terms.ts`, so
they cannot drift apart.

---

## Imagery

Everything shipped lives in `src/assets/rally/`. The originals are in
`assets-source/` with a note on what each was derived into.

**Every product photograph is portrait**, and four of the six were shot against
a light grey studio wall. Placing one on the near-black ground without
feathering *and* dropping its exposure makes it read as a broken image — see
`.rt-media--feather` in `base.css` and how `product.css` and `cart.css` use it.

The circular badge is a **square** JPEG with dark corners; every use clips it
with `clip-path: circle(49.5% at 50% 50%)`.

---

## Commerce

Shopify owns catalog, pricing, cart, checkout, payment, shipping, taxes and
orders. The selected motorcycle travels as Shopify **cart line attributes**
(`Motorcycle`, `Mounting kit`), so it appears on the order in the admin.

Copy `.env.example` to `.env.local`:

```
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your32charhextoken
VITE_SHOPIFY_VARIANT_RALLY=gid://shopify/ProductVariant/000000000000
```

**Without these the site still runs end to end** — the cart falls back to local
state and the checkout button says the store is not connected rather than
pretending otherwise.

Only the **public Storefront token** belongs here. Anything prefixed `VITE_` is
compiled into the JavaScript bundle and readable by any visitor, so an Admin
API token (`shpat_…`) must never go in it.

When deploying, set the same three variables in the **host's** environment
settings — `.env.local` is local-only and is not committed.

---

## Conventions

- TypeScript, function components, two-space indent, no semicolons, single quotes
- No hard-coded hex colours, px font sizes or ms durations — use `var(--rt-*)`
- Only these font weights are embedded: Barlow Condensed 600/700,
  Inter 400/500/600/700, IBM Plex Mono 500
- Class names are prefixed `rt-` and namespaced to their section
- `npm run build` must pass; `noUnusedLocals` is on
- `prefers-reduced-motion` must leave every page complete and readable
