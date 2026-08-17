// ---------------------------------------------------------------------------
// Fixed-chrome overlap test.
//
// The navigation is fixed and `body` carries a matching top offset. A page that
// opts into `.rt-page--bleed` deliberately sits UNDER the nav so its hero runs
// edge to edge — but any page that does so by accident hides its own first line
// of text behind the chrome, which is exactly the bug this guards against.
//
// Asserts that on every route, at every audited viewport, no visible text in
// <main> intersects the navigation bar while the page is scrolled to the top.
//
// Usage:  node scripts/test-chrome-overlap.mjs
// ---------------------------------------------------------------------------

import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p))

const BASE = process.env.BASE ?? 'http://localhost:5173'

const ROUTES = ['', 'product', 'about', 'cart', 'policies/returns', 'policies/terms', 'no-such-route']
const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1280, 720],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 568],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  if (!EDGE) throw new Error('No Chromium-based browser found')
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new' })
  const failures = []
  let checked = 0

  for (const [w, h] of VIEWPORTS) {
    for (const route of ROUTES) {
      const page = await browser.newPage()
      await page.setViewport({
        width: w,
        height: h,
        deviceScaleFactor: 1,
        isMobile: w <= 480,
        hasTouch: w <= 900,
      })
      await page.goto(`${BASE}/#/${route}`, { waitUntil: 'networkidle0' })
      await sleep(800)
      // Measure at the top of the document: a scrolled page legitimately has
      // content behind the chrome, which would be a false positive.
      await page.evaluate(() => window.scrollTo(0, 0))
      await sleep(320)

      const hits = await page.evaluate(() => {
        const nav = document.querySelector('.rt-nav')
        if (!nav) return ['no .rt-nav found']
        const n = nav.getBoundingClientRect()
        const out = []
        document.querySelectorAll('main *').forEach((el) => {
          if (!el.textContent?.trim() || el.children.length) return
          const r = el.getBoundingClientRect()
          if (!r.width || !r.height) return
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.opacity === '0') return
          if (r.top < n.bottom && r.bottom > n.top && r.right > n.left && r.left < n.right) {
            out.push(
              `${el.tagName} "${el.textContent.trim().slice(0, 30)}" top=${Math.round(r.top)} navBottom=${Math.round(n.bottom)}`,
            )
          }
        })
        return out.slice(0, 4)
      })

      checked++
      if (hits.length) {
        failures.push(`${w}x${h} /${route || '(landing)'}\n     ` + hits.join('\n     '))
      }
      await page.close()
    }
  }

  await browser.close()

  console.log(`\n${checked} route x viewport combinations checked, ${failures.length} with overlap`)
  if (failures.length) {
    console.log('\nOVERLAPS:')
    failures.forEach((f) => console.log('  x ' + f))
    process.exit(1)
  }
  console.log('No text sits under the fixed navigation on any route or viewport.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
