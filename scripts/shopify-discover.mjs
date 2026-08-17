// ---------------------------------------------------------------------------
// Shopify Storefront connection check + variant discovery.
//
// Verifies the store domain and PUBLIC Storefront token actually work, then
// lists every product and variant with its GID so `VITE_SHOPIFY_VARIANT_RALLY`
// can be filled in without digging through the admin.
//
// Reads .env.local. Uses ONLY the public Storefront token — never the Admin
// (shpat_) token, which must not touch anything that runs in a browser.
//
// Usage:  npm run shopify:discover
// ---------------------------------------------------------------------------

import { readFileSync, existsSync } from 'node:fs'

const API_VERSION = '2024-10'

function loadEnv(file) {
  if (!existsSync(file)) return {}
  const out = {}
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].trim()
  }
  return out
}

const env = { ...loadEnv('.env.local'), ...process.env }
const domain = (env.VITE_SHOPIFY_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
const token = env.VITE_SHOPIFY_STOREFRONT_TOKEN

const die = (msg) => {
  console.error(`\n${msg}\n`)
  process.exit(1)
}

if (!domain) {
  die(`VITE_SHOPIFY_DOMAIN is not set in .env.local.

This is NOT a domain you buy. Every Shopify store is issued a permanent
*.myshopify.com address when it is created, whether or not you own a custom
domain, and customers never see it. Find it in your admin URL:

    admin.shopify.com/store/YOUR-STORE
                            ^^^^^^^^^^ this part

so the value is YOUR-STORE.myshopify.com. It is also listed under
Settings > Domains as the one you cannot remove.

A domain bought from GoDaddy points at your WEB HOST, not at Shopify, and is
not what goes here. See docs/GOING-LIVE.md section 1.4.`)
}
if (!token) die('VITE_SHOPIFY_STOREFRONT_TOKEN is not set in .env.local.')

if (token.startsWith('shpat_')) {
  die(
    'That is an ADMIN API token (shpat_...), not a Storefront token.\n' +
      'Admin tokens grant read/write access to the entire store and must never\n' +
      'be used from a browser. Create a public Storefront API access token\n' +
      'instead: Settings → Apps and sales channels → Develop apps → your app →\n' +
      'API credentials → Storefront API access token.',
  )
}

const QUERY = `
  query Discover {
    shop { name primaryDomain { url } }
    products(first: 25) {
      edges {
        node {
          title
          handle
          availableForSale
          variants(first: 25) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`

const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query: QUERY }),
}).catch((e) => die(`Could not reach https://${domain} — ${e.message}`))

if (res.status === 401 || res.status === 403) {
  die(
    `Shopify rejected the token (HTTP ${res.status}).\n` +
      'Check that it is a Storefront API access token for THIS store, and that\n' +
      'the app has unauthenticated_read_product_listings and\n' +
      'unauthenticated_write_checkouts scopes.',
  )
}
if (res.status === 404) {
  die(`No Storefront API at https://${domain} (404). Is the domain right?`)
}
if (!res.ok) die(`Storefront API returned HTTP ${res.status}.`)

const body = await res.json()
if (body.errors?.length) {
  die('Storefront API errors:\n  ' + body.errors.map((e) => e.message).join('\n  '))
}

const { shop, products } = body.data
console.log(`\nConnected to: ${shop.name}  (${shop.primaryDomain.url})`)

const edges = products.edges
if (!edges.length) {
  console.log(
    '\nNo products are published to this Storefront app.\n' +
      'In Shopify: Products → select the product → Publishing → add your\n' +
      'Storefront/headless sales channel. Until then the API returns nothing.',
  )
  process.exit(0)
}

console.log(`\n${edges.length} product(s) visible to the Storefront API:\n`)
let suggestion = null

for (const { node: p } of edges) {
  console.log(`  ${p.title}   (handle: ${p.handle}${p.availableForSale ? '' : ' — NOT available for sale'})`)
  for (const { node: v } of p.variants.edges) {
    const price = v.price ? `${v.price.amount} ${v.price.currencyCode}` : '—'
    console.log(`      ${v.id}`)
    console.log(`        variant: ${v.title}   sku: ${v.sku || '—'}   price: ${price}${v.availableForSale ? '' : '   (unavailable)'}`)
    if (!suggestion && /rally|tower/i.test(`${p.title} ${p.handle} ${v.sku ?? ''}`)) {
      suggestion = { id: v.id, label: `${p.title} / ${v.title}` }
    }
  }
  console.log('')
}

if (suggestion) {
  console.log(`Looks like the Rally Tower — ${suggestion.label}\n`)
  console.log('Add this line to .env.local, then restart the dev server:\n')
  console.log(`  VITE_SHOPIFY_VARIANT_RALLY=${suggestion.id}\n`)
} else {
  console.log(
    'No product matched "rally"/"tower". Copy the correct variant GID above\n' +
      'into VITE_SHOPIFY_VARIANT_RALLY in .env.local.\n',
  )
}
