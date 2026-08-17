# Karoo Moto — Storefront

Premium South African adventure-motorcycle hardware — rally towers, navigation
systems, protection, lighting, luggage and billet components — brought to the
American market under the **Karoo Moto** brand.

> **Engineered in South Africa. Built for Adventure.**

**Live site:** https://karoo-moto.vercel.app

This repository is the **storefront front end** — a fast, responsive React app
built to the Karoo Moto brand identity. It is fully browsable today. Payments and
live inventory (via Shopify) are the next milestone and are **not wired up yet**;
the cart and forms are realistic placeholders.

---

## Who should read what

- **Running the business (non-technical)?** → Read [For the business owner](#for-the-business-owner).
  It explains what's live, what isn't, how products/inventory will be managed, and
  what things cost.
- **A developer?** → Jump to [For developers](#for-developers) for setup,
  architecture and deployment.

---

## For the business owner

### What this is

A custom-designed online store for Karoo Moto. It's already live on the internet
at **https://karoo-moto.vercel.app** and works on phones, tablets and desktop.
Anyone can browse the whole catalogue, filter by motorcycle, and read full product
specs. It looks and reads like a premium engineering brand — not a generic parts
template.

### What's live vs. still to come

| Area | Status |
| --- | --- |
| Full website design & all pages | ✅ Live |
| Product browsing, search, filters, fitment finder | ✅ Live |
| Shopping cart | ✅ Live (saves in the browser) |
| **Checkout / taking payment** | 🔲 Not yet — planned via Shopify |
| **Live inventory / stock levels** | 🔲 Not yet — planned via Shopify |
| Contact / dealer / newsletter forms | 🔲 Look real, don't send yet |
| Real product photos | 🔲 Using branded placeholder illustrations |

### How products & inventory are managed

**Today:** product details (names, prices, specs, fitment) live inside the code, in
one file (`src/data/products.ts`). Changing them is a small developer task.

**The plan (headless Shopify):** you'll manage everything — products, prices,
**inventory counts**, orders and shipping — from the **Shopify admin dashboard**
(and their phone app). The website stays exactly as designed but pulls live data
from Shopify, and checkout is handled securely by Shopify. When a sale happens,
stock counts go down automatically.

To make that switch fast, this repo already includes a ready-to-import file of the
whole catalogue: **`shopify/karoo-moto-products.csv`**. In Shopify admin, go to
**Products → Import** and upload it — it creates all products with their variants
(each finish), SKUs, prices and starting stock. Then you set real inventory numbers
and add photos. See [Shopify integration](#shopify-headless-integration-planned)
for the developer side.

### What it costs to run

- **Website hosting (Vercel):** currently on the free tier — $0 while traffic is
  modest.
- **Shopify (when checkout goes live):** roughly $39/month for the Basic plan (check
  current pricing) plus payment-processing fees. This is what gives you the
  inventory dashboard and secure checkout.
- **Custom domain (optional):** ~$10–20/year for something like `karoomoto.com`,
  pointed at the site.
- A **Shopify development store** is free for building/testing, but **can't take
  real customer payments** until it's on a paid plan.

### Requesting changes

A developer updates the site from this repository. Good things to hand them:
new product photos, price/spec changes, new motorcycle platforms to support, or
copy edits. Once the Shopify switch is done, day-to-day product and inventory
changes become self-service in Shopify — no developer needed.

### Brand assets

The logo variants (`src/assets/*.webp`) were produced from your master brand mark.
Per the brand guide: don't stretch, skew, recolor or redraw the Africa silhouette,
and keep clear space around the mark.

---

## For developers

### Tech stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | React 18 + TypeScript                         |
| Build tool | Vite 5                                         |
| Routing    | React Router 6 (**HashRouter**)               |
| Styling    | Hand-written CSS with design tokens (no framework) |
| State      | React Context (cart, persisted to `localStorage`) |
| Fonts      | Barlow Condensed · Inter · IBM Plex Mono — **embedded** as base64 (no CDN) |
| Hosting    | Vercel                                        |

There is intentionally **no CSS framework**. The look is driven entirely by brand
tokens in `src/styles/tokens.css`, so it stays on-brand and easy to tune.

### Quick start

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Scripts:

```bash
npm run dev              # Vite dev server
npm run build            # type-check + production build → dist/
npm run preview          # preview the production build locally
npm run lint             # TypeScript type-check only
npm run build -- --mode artifact   # single self-contained index.html (see below)
```

### Project structure

```
karoo-moto/
├─ index.html                 # app shell (fonts are embedded via CSS, not linked)
├─ public/                    # favicons (copied as-is)
├─ shopify/
│  └─ karoo-moto-products.csv # catalogue exported for Shopify import
├─ scripts/
│  └─ export-shopify-csv.ts   # regenerates that CSV from src/data
└─ src/
   ├─ main.tsx                # entry — HashRouter + CartProvider
   ├─ App.tsx                 # routes
   ├─ assets/                 # logo variants (.webp)
   ├─ context/CartContext.tsx # cart state + localStorage
   ├─ components/
   │  ├─ Header, Footer, ProductCard, FitmentFinder, Newsletter, Toast, Icon…
   │  └─ art/                 # self-contained SVG art (hero, product, scenes, topo)
   ├─ data/                   # ← the content lives here
   │  ├─ products.ts          # product catalogue + selectors
   │  ├─ bikes.ts             # makes / models / years for the fitment finder
   │  ├─ categories.ts        # category definitions
   │  └─ types.ts             # shared data model
   ├─ pages/                  # Home, Shop, ProductDetail, Fitment, About, Support,
   │                          # Dealers, Journal, Contact, Cart, Policy, NotFound
   └─ styles/
      ├─ tokens.css           # brand palette, type, spacing (start here to restyle)
      ├─ global.css           # base + all component styles
      └─ fonts-embedded.css   # base64 @font-face (generated; do not hand-edit)
```

### Editing content

The site is data-driven — you rarely touch a component to change the catalogue:

- **Products** → `src/data/products.ts`. Add an object to `PRODUCTS` and it appears
  in Shop, category pages, the fitment finder and related-product lists
  automatically. Fields cover price, SKU, fitment, finishes, material, weight,
  dimensions, included parts, install difficulty/time/tools, warranty and related
  products.
- **Bikes / fitment** → `src/data/bikes.ts` (drives the fitment finder and the
  "Shop by Motorcycle" row).
- **Categories** → `src/data/categories.ts`.
- **Brand colors / type / spacing** → `src/styles/tokens.css`.

### Imagery (important)

This build ships with **no stock photos**. All hero, product and lifestyle visuals
are self-contained, on-brand **SVG illustrations** (`src/components/art/`) so the
site looks polished out of the box and loads instantly:

- `HeroArt.tsx` — Karoo dawn mountain-pass scene
- `ProductArt.tsx` — blueprint-style product renders (one per product `art` kind)
- `SceneArt.tsx` — landscape scenes for builds/journal
- `TopoPattern.tsx` — topographic texture

**Before launch,** replace these with real photography: studio product shots,
a South African adventure hero image, and authentic customer builds. Drop images
into `public/` (or `src/assets/`) and swap the `<ProductArt />` / `<HeroArt />` /
`<SceneArt />` elements for `<img>` tags. Search the code for `Art` to find every
insertion point.

### Routing

Uses **HashRouter** (URLs look like `/#/shop`). This makes the SPA work on any
static host, from `file://`, and inside a single-file build with **zero rewrite
config**. If you later move to `BrowserRouter` (cleaner URLs, better SEO), add a
catch-all rewrite to `index.html` on the host.

### Deployment (Vercel)

The site is deployed as a Vercel **CLI** project (not yet linked to git):

```bash
npx vercel@latest --prod --yes      # from this directory
```

- Production URL: https://karoo-moto.vercel.app
- Vercel auto-detects Vite and runs `npm run build`.
- **To enable auto-deploy on push:** push this repo to GitHub, then "Import" it in
  the Vercel dashboard and connect the repo. After that, every push to the main
  branch deploys automatically.

### Shopify (headless) integration — planned

The chosen commerce model is **headless**: keep this custom storefront, use Shopify
as the backend for products, inventory, orders and checkout via the **Storefront
API**. What's already done and what remains:

- ✅ `shopify/karoo-moto-products.csv` — importable catalogue (run
  `npx tsx scripts/export-shopify-csv.ts` to regenerate from `src/data`).
- 🔲 Get a **Storefront API access token** (Shopify admin → add the **Headless**
  channel, or Develop apps → custom app → Storefront API).
- 🔲 Add a Storefront API client (`src/lib/shopify.ts`) and read products/inventory
  live instead of from `products.ts`; hand the cart to Shopify's hosted checkout.
- 🔲 Configure env vars (planned names):

  ```
  VITE_SHOPIFY_DOMAIN=karoo-moto.myshopify.com
  VITE_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

  The Storefront token is the public, read-only storefront token (safe in a browser
  app) — **not** an Admin API key. Set it in Vercel → Project → Settings →
  Environment Variables. Never commit `.env` (it's git-ignored).

With Shopify handling checkout, a separate Stripe integration is generally **not**
needed — Shopify processes payments.

### Advanced: single-file / shareable build

`npm run build -- --mode artifact` uses `vite-plugin-singlefile` plus embedded
fonts and inlined images to emit **one self-contained `dist/index.html`** (no
external requests). Handy for sharing a preview link or hosting on the simplest
possible static host.

### Conventions & accessibility

- Mobile-first; 16px minimum body text; buttons ≥ 44px tall.
- Visible keyboard focus states; `prefers-reduced-motion` respected; motion kept to
  150–250ms per the brand guide.
- Corners mostly square / lightly rounded (4–8px); bronze is an accent, not a
  background.

### Brand-claim review (before publishing)

Product specs, lead times and stock counts in `src/data/products.ts` are
**representative placeholders**. Verify every engineering, testing and origin claim
with the manufacturer before going live. Do not publish invented certifications or
test claims.

---

## Roadmap

- [ ] Wire Shopify Storefront API (live products, inventory, checkout)
- [ ] Replace placeholder illustrations with real photography
- [ ] Connect contact / dealer / newsletter forms to a real endpoint
- [ ] Link the GitHub repo to Vercel for auto-deploys
- [ ] Add a custom domain
- [ ] Add more supported motorcycle platforms

## Ownership

© Karoo Moto. All rights reserved. This is a private, proprietary project — not
licensed for redistribution.

---

## Going live

**[docs/GOING-LIVE.md](docs/GOING-LIVE.md)** — everything needed to start
selling: creating and publishing the Shopify product, Storefront API access,
connecting the site, payments/shipping/tax, and hosting on a GoDaddy domain.

## Architecture (current)

Three pages, one flow:

```
Rally Tower landing (/)  →  Product (/product)  →  Cart (/cart)  →  Shopify checkout
```

- `/` — the cinematic Rally Tower landing page. Sells; does not transact.
  Every CTA leads to `/product`.
- `/product` — product card, image gallery, dependent bike-compatibility
  selector (Brand → Model → Year → Variant), Add to Cart, Go to Cart.
- `/cart` — line items with the selected motorcycle, quantities, subtotal,
  and the hand-off to Shopify's hosted checkout.
- `/policies/:doc` — the legal text the guarantee and warranty link to.

Chrome (`RallyNav`, `SiteFooter`) and the configurator state
(`TowerConfigProvider`) are app-level, so the motorcycle chosen on the product
page is the same selection the cart and the landing CTAs read.

### Design system

Everything visual comes from `src/styles/rally/` — `tokens.css` (the only place
colours, type scale, spacing, easing and durations are defined) and `base.css`
(the shared primitives: buttons, cards, eyebrows, rules, chips, scrims, reveals).
`docs/rally-tower-brief.md` is the contract every contributor builds against.

### Commerce

Shopify is the backend: catalog, pricing, cart, checkout, payment, shipping,
taxes and orders. `src/lib/shopify.ts` wraps the Storefront API; the selected
motorcycle travels as **cart line attributes** so it appears on the order in the
Shopify admin.

Copy `.env.example` to `.env.local` and fill in the store domain, Storefront API
token and the Rally Tower variant GID. **Without them the site still runs** —
the cart falls back to local state and the checkout button says the store is not
connected rather than pretending otherwise.

### Development

```bash
npm install
npm run dev        # http://localhost:5173/
npm run lint       # tsc --noEmit
npm run build

node scripts/shoot.mjs --sections     # screenshot 7 viewports, report overflow
python scripts/check_rally.py         # static QA on tokens, classes, weights
```
