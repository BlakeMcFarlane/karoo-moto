# Going live — Shopify + your GoDaddy domain

Everything here is a task for **you** in a browser, not code. The site is built
and waiting; it needs a store to talk to and somewhere to live.

Work through it in order. Section 1 gets you selling. Section 2 puts the site on
your domain.

---

## Before anything else: revoke the Admin token

An Admin API token (`shpat_…`) was shared in plaintext during development.
Admin tokens grant read/write access to orders, customers and products.

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. Open the app → **API credentials** → revoke / uninstall
3. Reinstall to get a fresh token, and keep it server-side only

It was never used in this project and appears nowhere in the code — but treat
it as compromised.

**Why it can't be used here:** this site talks to Shopify from the customer's
browser. Anything the browser can send, a customer can read. Only the **public
Storefront API token** is safe in a browser, and that is what the site uses.

---

# 1. Shopify — what's needed to start selling

## 1.1 Create the product

Products → **Add product**.

| Field | Value |
| --- | --- |
| Title | `Rally Tower` |
| Price | `749.00` (or whatever you're actually charging) |
| Inventory | Untick **Track quantity**, or set stock. If tracking is on and stock is 0, the API reports it unavailable and checkout fails. |
| Shipping | Tick **This is a physical product**, and set the weight — **1.7 kg** plus packaging. Shopify uses this to calculate live shipping rates. |

**Variants:** leave it single-variant. The motorcycle the customer picks is
**not** a Shopify variant — it travels as a line-item property (see 1.5). If you
add colour/finish variants later, the site needs a small change to pick the
right variant ID.

## 1.2 Publish it to the headless channel

This is the step people miss. A product can exist, be active, and still be
invisible to the API.

On the product page → **Publishing** → make sure your Storefront/headless app is
listed. If it isn't, the API will authenticate perfectly and return an empty
catalogue.

## 1.3 Storefront API access

Settings → Apps and sales channels → **Develop apps** → your app →
**Configuration → Storefront API**. Enable these scopes:

- `unauthenticated_read_product_listings`
- `unauthenticated_write_checkouts`

Then **API credentials** → copy the **Storefront API access token** (a 32-character
hex string — *not* the `shpat_…` one).

## 1.4 Connect it to the site

Create `.env.local` in the project root (it's gitignored — never commit it):

```
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your32charhextoken
VITE_SHOPIFY_VARIANT_RALLY=gid://shopify/ProductVariant/000000000000
```

### Finding `VITE_SHOPIFY_DOMAIN`

**This is not a domain you buy.** Every Shopify store is issued a permanent
`.myshopify.com` address when it's created. It exists whether or not you own a
custom domain, it can't be removed, and customers never see it.

Look at your Shopify admin URL:

```
admin.shopify.com/store/karoomoto-xyz
                        ^^^^^^^^^^^^^ this part
```

So the value is `karoomoto-xyz.myshopify.com`. You'll also find it under
**Settings → Domains**, listed as the one you can't delete.

Use this even after you connect a custom domain — it stays the API address
permanently.

### The two domains do different jobs

This trips people up, so to be explicit:

| Domain | Points at | Who sees it |
| --- | --- | --- |
| `you.myshopify.com` | Shopify's servers | Nobody. It's the API address this site calls behind the scenes. |
| Your **GoDaddy** domain | Your **web host** (Vercel/Netlify) | Customers. This is the address they type. |

**Your GoDaddy domain does not point at Shopify.** In this setup Shopify is the
commerce backend, not the website host — so the domain points at whoever serves
the site, and Shopify only appears at the final checkout step. Section 2 covers
that DNS setup.

You do *not* need to buy a domain from Shopify, transfer your GoDaddy domain to
Shopify, or connect the domain inside Shopify at all — with one optional
exception in 2.4, if you want the checkout page on a `shop.` subdomain.

To find the variant ID, run:

```bash
npm run shopify:discover
```

It verifies the connection and prints every product and variant with its ID, then
tells you the exact line to paste in. It also names the specific problem if
something's wrong — bad domain, rejected token, an Admin token by mistake, or
products not published to the channel.

Restart the dev server after editing `.env.local`. Vite only reads env at startup.

**Until all three values are set the site runs in local-cart mode:** everything
works, nothing is charged, and the Checkout button says so plainly rather than
pretending.

## 1.5 The motorcycle selection on your orders

When a customer picks Brand → Model → Year, the site attaches that to the cart
line as Shopify **line-item properties**:

- `Motorcycle` — e.g. `Honda CRF450RL · 2024`
- `Mounting kit` — e.g. `KM-RT-MK-CRF450RL`

These show on the order in the Shopify admin and on packing slips, so whoever
builds the tower can see which kit to fit. **Check this on your first real
order** — it's the one thing that would be expensive to get wrong.

## 1.6 Payments, tax, shipping

Shopify owns all of this; the site never touches it.

- **Payments** — Settings → Payments → activate Shopify Payments (or PayPal etc.).
  Requires your business details and a bank account.
- **Shipping** — Settings → Shipping and delivery. Set rates for the regions you
  ship to. The product weight from 1.1 drives carrier-calculated rates.
- **Tax** — Settings → Taxes and duties. For US sales this means registering
  where you have nexus. Get an accountant's view; don't guess.
- **Checkout** — Settings → Checkout. Brand it so the hand-off from this site
  doesn't feel like a different company: upload the KarooMoto logo, set the
  accent colour to the ember `#e2571e`, and the background to near-black.

## 1.7 Test before you announce

1. Settings → Payments → enable **Test mode** (or use Shopify's Bogus Gateway).
2. Buy a Rally Tower through the real site, end to end.
3. Confirm on the order: correct price, the `Motorcycle` and `Mounting kit`
   properties, shipping address, and tax.
4. Turn test mode off. **Turn test mode off.**

## 1.8 Policies

The site already carries the real Terms & Conditions, 45-Day Satisfaction
Guarantee, 12-Month Limited Warranty, Shipping and Privacy pages, and the cart
requires customers to accept the Terms before checkout.

Paste the same text into Settings → Policies in Shopify so the checkout pages
match the site. If the two ever disagree, that's a problem you don't want to
discover during a dispute.

---

# 2. Hosting, with a GoDaddy domain

## 2.1 First, a decision

This is a **Vite/React app**, not a Shopify theme. It cannot be uploaded into
Shopify's theme editor. Shopify is the commerce backend; the site is hosted
separately and hands off to Shopify's checkout at the end.

So you need somewhere to host static files. **Use Vercel or Netlify** — both are
free at this size, deploy from GitHub automatically on every push, and handle
HTTPS for you.

> Shopify's own "Oxygen" hosting only works for Hydrogen (their React framework).
> Porting this site to Hydrogen would be a rewrite, and buys you nothing you
> don't already have.

## 2.2 Deploy (Vercel, ~5 minutes)

1. Push this repo to GitHub (already done if you're reading this after the push).
2. [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project**
   → pick `karoo-moto`.
3. It detects Vite. Settings should be:
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Environment Variables** — add the same three from 1.4:
   `VITE_SHOPIFY_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`,
   `VITE_SHOPIFY_VARIANT_RALLY`. They must be set here too; `.env.local` is
   local-only and is not committed.
5. **Deploy.** You get a `something.vercel.app` URL.

Every push to `main` redeploys automatically from then on.

## 2.3 Point the GoDaddy domain at it

In Vercel: **Project → Settings → Domains → Add** → enter `karoomoto.com` (and
`www.karoomoto.com`). Vercel shows you the exact records to create.

Then in GoDaddy: **My Products → your domain → DNS → Manage DNS**.

Typical records — **use whatever Vercel actually shows you, not these from memory**:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Notes:
- Delete GoDaddy's default parking records for `@` and `www` first, or they'll conflict.
- Leave MX records alone if you use the domain for email.
- Propagation is usually minutes, occasionally up to 48 hours.
- Don't use GoDaddy's "Forwarding" feature — it breaks HTTPS and SEO. Use the
  DNS records.

Vercel issues the HTTPS certificate automatically once DNS resolves.

## 2.4 Point Shopify's checkout at the same brand

Shopify checkout runs on `checkout.shopify.com` (or `shop.karoomoto.com` if you
set up a subdomain in Shopify's domain settings). Customers *will* notice the
change of address at payment. Two things make it feel deliberate:

1. Brand the checkout (1.6).
2. Optionally add `shop.karoomoto.com` in Shopify → Settings → Domains, with the
   matching CNAME in GoDaddy.

## 2.5 If you're using GitHub Pages instead

It'll work, but it needs two changes this repo doesn't currently have:

- A GitHub Actions workflow to build and publish `dist/`
- `base: '/karoo-moto/'` in `vite.config.ts` for a project site (not needed for a
  custom domain at the root)

Ask and I'll add both. Vercel is genuinely less work.

---

# 3. Launch checklist

- [ ] Admin (`shpat_`) token revoked and rotated
- [ ] Product created, priced, weighed, **published to the headless channel**
- [ ] Storefront token created with both scopes
- [ ] Three env vars set **in the host**, not just locally
- [ ] `npm run shopify:discover` connects and finds the variant
- [ ] Test order placed end to end; `Motorcycle` + `Mounting kit` visible on it
- [ ] Payments live, test mode **off**
- [ ] Shipping rates and tax configured
- [ ] Checkout branded
- [ ] Policies pasted into Shopify
- [ ] Domain resolving over HTTPS, `www` and apex both working

---

# 4. Local commands

```bash
npm install
npm run dev               # http://localhost:5173/
npm run build             # typecheck + production build
npm test                  # nav-overlap + bike-compatibility suites
npm run shopify:discover  # verify Shopify connection, find variant IDs
```
