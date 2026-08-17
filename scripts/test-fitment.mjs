// ---------------------------------------------------------------------------
// Compatibility-selector test.
//
// Drives the real product page in a real browser and asserts that every
// manufacturer / model / year combination in the catalogue behaves correctly,
// with particular attention to the Honda pairs, where two models share a
// nameplate but not a year range:
//
//   CRF450L   → 2019, 2020            (a 2021+ CRF450L does not exist)
//   CRF450RL  → 2021 … 2026           (a 2019 CRF450RL does not exist)
//
// The impossible combinations must be *unreachable*, not merely rejected —
// the year list is scoped to the chosen model, so they are never offered.
//
// DOM contract (src/components/rally/BikeSelector.tsx): each field is an
// ARIA 1.2 select-only combobox. For a field with id `X`:
//   #X-trigger   <button role="combobox" aria-disabled="true" when locked>
//   #X-list      <ul role="listbox">, ALWAYS mounted (visibility:hidden when
//                closed), so options can be read without opening anything.
//
// Usage:  node scripts/test-fitment.mjs
// ---------------------------------------------------------------------------

import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p))

const BASE = process.env.BASE ?? 'http://localhost:5173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const range = (from, to) => {
  const out = []
  for (let y = to; y >= from; y--) out.push(y)
  return out
}

/** The catalogue, mirrored from src/data/rallyTower.ts. */
const EXPECTED = {
  KTM: {
    '450 EXC-F': range(2017, 2026),
    '500 EXC-F / EXC-W': range(2017, 2023),
    '500 EXC-F / XW-F': range(2024, 2026),
  },
  Husqvarna: {
    'FE 450': range(2017, 2026),
    'FE 501': range(2017, 2026),
  },
  Suzuki: {
    'DR-Z400S': range(2000, 2024),
    'DR-Z400SM': range(2005, 2024),
    'DR-Z4S': range(2025, 2026),
    'DR-Z4SM': range(2025, 2026),
  },
  Honda: {
    CRF450L: range(2019, 2020),
    CRF450RL: range(2021, 2026),
  },
}

/** Combinations that must never be offered. */
const FORBIDDEN = [
  ['Honda', 'CRF450L', 2021],
  ['Honda', 'CRF450L', 2022],
  ['Honda', 'CRF450L', 2023],
  ['Honda', 'CRF450L', 2024],
  ['Honda', 'CRF450L', 2025],
  ['Honda', 'CRF450L', 2026],
  ['Honda', 'CRF450RL', 2019],
  ['Honda', 'CRF450RL', 2020],
  ['Suzuki', 'DR-Z4S', 2024],
  ['Suzuki', 'DR-Z400S', 2025],
  ['KTM', '500 EXC-F / EXC-W', 2024],
  ['KTM', '500 EXC-F / XW-F', 2017],
]

let pass = 0
const failures = []
const ok = (cond, msg) => (cond ? pass++ : failures.push(msg))

/** Read a field's state without touching it. */
const fieldState = (page, id) =>
  page.evaluate((fid) => {
    const trigger = document.getElementById(`${fid}-trigger`)
    const list = document.getElementById(`${fid}-list`)
    if (!trigger) return { missing: true }
    return {
      locked: trigger.getAttribute('aria-disabled') === 'true',
      value: trigger.querySelector('.rt-sel__value')?.textContent.trim() ?? '',
      labels: list
        ? [...list.querySelectorAll('[role="option"]')].map((o) =>
            o.textContent.trim(),
          )
        : [],
    }
  }, id)

/** Open the field and commit an option by visible label (substring match). */
const choose = (page, id, label) =>
  page.evaluate(
    async (fid, want) => {
      const trigger = document.getElementById(`${fid}-trigger`)
      const list = document.getElementById(`${fid}-list`)
      if (!trigger || !list) return false
      if (trigger.getAttribute('aria-disabled') === 'true') return false
      trigger.click()
      await new Promise((r) => setTimeout(r, 100))
      const opt = [...list.querySelectorAll('[role="option"]')].find((o) =>
        o.textContent.trim().includes(String(want)),
      )
      if (!opt) {
        trigger.click()
        return false
      }
      opt.click()
      await new Promise((r) => setTimeout(r, 180))
      return true
    },
    id,
    label,
  )

const addButton = (page) =>
  page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      /add to/i.test(b.textContent || ''),
    )
    if (!btn) return { missing: true }
    return {
      enabled: btn.getAttribute('aria-disabled') !== 'true' && !btn.disabled,
      text: btn.textContent.trim(),
    }
  })

/**
 * Start every case from a genuinely cold app.
 *
 * `page.goto` to a URL that differs only by its hash is a SAME-DOCUMENT
 * navigation: localStorage is cleared but React never unmounts, so the previous
 * case's selection survives in memory and the next case silently tests the
 * wrong state. `page.reload()` is what actually rebuilds the app.
 */
async function reload(page) {
  await page.evaluate(() => {
    localStorage.removeItem('karoo-bike-selection-v1')
    localStorage.removeItem('karoo-cart-v3')
    localStorage.removeItem('karoo-shopify-cart-id')
  })
  await page.goto(`${BASE}/#/product`, { waitUntil: 'networkidle0' })
  await page.reload({ waitUntil: 'networkidle0' })
  await sleep(420)
}

async function run() {
  if (!EDGE) throw new Error('No Chromium-based browser found')
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  await page.goto(`${BASE}/#/product`, { waitUntil: 'networkidle0' })
  await sleep(700)

  // --- 1. the gate ---------------------------------------------------------
  await reload(page)
  const cold = await addButton(page)
  ok(!cold.missing, 'the Add to cart button should exist')
  ok(cold.enabled === false, 'Add to cart must be blocked with nothing selected')

  const m0 = await fieldState(page, 'rt-sel-model')
  const y0 = await fieldState(page, 'rt-sel-year')
  ok(m0.locked === true, 'model must be locked before a brand is chosen')
  ok(y0.locked === true, 'year must be locked before a model is chosen')

  // --- 2. every brand is offered -------------------------------------------
  const brands = await fieldState(page, 'rt-sel-brand')
  ok(brands.locked === false, 'brand must never be locked')
  for (const brand of Object.keys(EXPECTED)) {
    ok(
      brands.labels.some((l) => l.includes(brand)),
      `brand list is missing ${brand} — got: ${brands.labels.join(', ')}`,
    )
  }

  // --- 3. models and years are scoped --------------------------------------
  for (const [brand, models] of Object.entries(EXPECTED)) {
    await reload(page)
    ok(await choose(page, 'rt-sel-brand', brand), `could not choose brand ${brand}`)

    const modelList = await fieldState(page, 'rt-sel-model')
    ok(modelList.locked === false, `${brand}: model should unlock once a brand is set`)
    ok(
      modelList.labels.length === Object.keys(models).length,
      `${brand}: expected ${Object.keys(models).length} models, got ${modelList.labels.length} (${modelList.labels.join(' | ')})`,
    )
    for (const model of Object.keys(models)) {
      ok(
        modelList.labels.some((l) => l.includes(model)),
        `${brand}: model list is missing ${model} — got: ${modelList.labels.join(' | ')}`,
      )
    }

    for (const [model, years] of Object.entries(models)) {
      await reload(page)
      await choose(page, 'rt-sel-brand', brand)
      ok(
        await choose(page, 'rt-sel-model', model),
        `${brand} ${model}: could not select model`,
      )

      const yearList = await fieldState(page, 'rt-sel-year')
      ok(yearList.locked === false, `${brand} ${model}: year should unlock`)
      const got = yearList.labels.map(Number).sort((a, b) => a - b)
      const want = [...years].sort((a, b) => a - b)
      ok(
        JSON.stringify(got) === JSON.stringify(want),
        `${brand} ${model}: year list mismatch\n      want ${want.join(',')}\n      got  ${got.join(',')}`,
      )
    }
  }

  // --- 4. forbidden combinations are unreachable ---------------------------
  for (const [brand, model, year] of FORBIDDEN) {
    await reload(page)
    await choose(page, 'rt-sel-brand', brand)
    await choose(page, 'rt-sel-model', model)
    const yearList = await fieldState(page, 'rt-sel-year')
    ok(
      !yearList.labels.map(Number).includes(year),
      `FORBIDDEN ${brand} ${model} ${year} is offered in the year dropdown`,
    )
  }

  // --- 5. changing an upstream field clears everything below ---------------
  await reload(page)
  await choose(page, 'rt-sel-brand', 'Honda')
  await choose(page, 'rt-sel-model', 'CRF450RL')
  await choose(page, 'rt-sel-year', '2023')
  ok((await addButton(page)).enabled === true, 'Honda CRF450RL 2023 should be addable')
  await choose(page, 'rt-sel-brand', 'KTM')
  const afterBrandChange = await fieldState(page, 'rt-sel-year')
  ok(
    afterBrandChange.locked === true,
    'changing brand must clear and relock the year field',
  )
  ok(
    (await addButton(page)).enabled === false,
    'changing brand must re-block Add to cart',
  )

  // --- 6. valid Honda configurations complete and write the right line -----
  for (const [model, year] of [
    ['CRF450L', 2019],
    ['CRF450L', 2020],
    ['CRF450RL', 2021],
    ['CRF450RL', 2026],
  ]) {
    await reload(page)
    await choose(page, 'rt-sel-brand', 'Honda')
    await choose(page, 'rt-sel-model', model)

    ok(
      (await addButton(page)).enabled === false,
      `Honda ${model}: add must stay blocked until a year is chosen`,
    )
    ok(
      await choose(page, 'rt-sel-year', String(year)),
      `Honda ${model} ${year}: could not choose year`,
    )
    ok(
      (await addButton(page)).enabled === true,
      `Honda ${model} ${year}: add should be enabled once complete`,
    )

    await page.evaluate(async () => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        /add to/i.test(b.textContent || ''),
      )
      btn?.click()
      await new Promise((r) => setTimeout(r, 400))
    })
    await sleep(450)

    const line = await page.evaluate(() => {
      const raw = localStorage.getItem('karoo-cart-v3')
      if (!raw) return null
      const lines = JSON.parse(raw)
      return lines[lines.length - 1] ?? null
    })
    ok(line !== null, `Honda ${model} ${year}: nothing was written to the cart`)
    ok(
      line?.properties?.Motorcycle === `Honda ${model} · ${year}`,
      `Honda ${model} ${year}: cart Motorcycle is "${line?.properties?.Motorcycle}"`,
    )
    ok(
      Boolean(line?.properties?.['Mounting kit']),
      `Honda ${model} ${year}: cart line carries no Mounting kit property`,
    )
  }

  // --- 7. the configuration survives a reload and reaches the cart page ----
  const before = await page.evaluate(
    () => JSON.parse(localStorage.getItem('karoo-cart-v3') ?? '[]').length,
  )
  await page.goto(`${BASE}/#/cart`, { waitUntil: 'networkidle0' })
  await sleep(600)
  const shown = await page.evaluate(() => document.body.innerText)
  ok(before > 0, 'the cart should have at least one line by now')
  ok(
    /Honda\s+CRF450RL/.test(shown),
    'the cart page should display the configured motorcycle',
  )
  ok(/KM-RT-MK/.test(shown), 'the cart page should display the mounting kit code')

  await browser.close()

  console.log(`\n${pass} assertions passed, ${failures.length} failed`)
  if (errors.length) {
    console.log(`\n${errors.length} console/page errors:`)
    ;[...new Set(errors)].slice(0, 8).forEach((e) => console.log('  ' + e))
  }
  if (failures.length) {
    console.log('\nFAILURES:')
    failures.forEach((f) => console.log('  x ' + f))
    process.exit(1)
  }
  console.log('All compatibility combinations behave correctly.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
