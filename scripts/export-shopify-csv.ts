// Exports the current catalogue (src/data/products.ts) to a Shopify product
// import CSV. Each product finish becomes a Shopify variant (Option1 = Finish).
// Run:  npx --yes tsx scripts/export-shopify-csv.ts
//
// Inventory quantities are seeded from stock status as sensible starting
// numbers — adjust them in Shopify admin after import. Add product photos in
// Shopify (Image Src left blank on purpose).

import { PRODUCTS } from '../src/data/products'
import { CATEGORY_MAP } from '../src/data/categories'
import type { Product } from '../src/data/types'
import { writeFileSync, mkdirSync } from 'node:fs'

const HEADERS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Image Src',
  'Status',
]

const csvCell = (v: string | number): string => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const gramsFromWeight = (w: string): number => {
  const m = w.match(/([\d.]+)\s*kg/i)
  return m ? Math.round(parseFloat(m[1]) * 1000) : 0
}

const startingQty = (status: Product['stockStatus']): number =>
  ({ 'in-stock': 12, 'low-stock': 4, 'made-to-order': 0, backorder: 0 }[status])

const inventoryPolicy = (status: Product['stockStatus']): string =>
  status === 'made-to-order' || status === 'backorder' ? 'continue' : 'deny'

const finishCode = (finish: string): string =>
  finish
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const bodyHtml = (p: Product): string => {
  const included = p.includes.map((i) => `<li>${i}</li>`).join('')
  const fits = p.fitment.map((f) => `${f.make} ${f.model} (${f.years})`).join('; ')
  return [
    `<p><em>${p.tagline}</em></p>`,
    `<p>${p.description}</p>`,
    `<h4>What's included</h4><ul>${included}</ul>`,
    `<h4>Specifications</h4><ul>`,
    `<li>Material: ${p.material}</li>`,
    `<li>Weight: ${p.weight}</li>`,
    `<li>Dimensions: ${p.dimensions}</li>`,
    `<li>Warranty: ${p.warranty}</li>`,
    `<li>Install: ${p.install.difficulty}, ${p.install.time}</li>`,
    `</ul>`,
    `<h4>Fitment</h4><p>${fits}</p>`,
  ].join('')
}

const rows: string[] = [HEADERS.join(',')]

for (const p of PRODUCTS) {
  const cat = CATEGORY_MAP[p.category].name
  const tags = [
    cat,
    p.bestSeller ? 'Best Seller' : '',
    p.featured ? 'Featured' : '',
    ...p.fitment.map((f) => `${f.make} ${f.model}`),
  ]
    .filter(Boolean)
    .join(', ')

  p.finishes.forEach((finish, idx) => {
    const first = idx === 0
    const price = p.salePrice ?? p.price
    const compareAt = p.salePrice ? p.price : ''
    const row = [
      p.slug, // Handle (same for every variant row)
      first ? p.name : '', // Title only on first row
      first ? bodyHtml(p) : '',
      first ? 'Karoo Moto' : '',
      first ? cat : '',
      first ? tags : '',
      first ? 'TRUE' : '',
      first ? 'Finish' : '', // Option1 Name only on first row
      finish, // Option1 Value on every variant row
      `${p.sku}-${finishCode(finish)}`,
      gramsFromWeight(p.weight),
      'shopify',
      startingQty(p.stockStatus),
      inventoryPolicy(p.stockStatus),
      'manual',
      price,
      compareAt,
      'TRUE',
      'TRUE',
      '', // Image Src — add photos in Shopify
      first ? 'active' : '',
    ]
    rows.push(row.map(csvCell).join(','))
  })
}

mkdirSync('shopify', { recursive: true })
const out = 'shopify/karoo-moto-products.csv'
writeFileSync(out, rows.join('\n') + '\n')
console.log(
  `Wrote ${out} — ${PRODUCTS.length} products, ${rows.length - 1} variant rows.`,
)
