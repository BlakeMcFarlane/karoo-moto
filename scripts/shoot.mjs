// ---------------------------------------------------------------------------
// Visual capture harness for the Rally Tower page.
//
// Drives headless Edge (Chromium) via puppeteer-core, scrolls the page so every
// scroll-triggered reveal has actually fired, then captures:
//   • a full-page screenshot per viewport
//   • a per-section screenshot per viewport (for close inspection)
//
// Usage:
//   node scripts/shoot.mjs                      # all viewports, default route
//   node scripts/shoot.mjs --only=mobile        # one viewport
//   node scripts/shoot.mjs --page=product      # a different route
//   node scripts/shoot.mjs --page=policies/returns
//   node scripts/shoot.mjs --sections           # also emit per-section shots
//   node scripts/shoot.mjs --motion=reduce      # emulate prefers-reduced-motion
// ---------------------------------------------------------------------------

import { mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
]

const VIEWPORTS = [
  { name: 'desktop-xl', width: 1920, height: 1080, dsf: 1 },
  { name: 'laptop', width: 1440, height: 900, dsf: 1 },
  { name: 'laptop-sm', width: 1280, height: 800, dsf: 1 },
  { name: 'tablet-land', width: 1024, height: 768, dsf: 1 },
  { name: 'tablet-port', width: 768, height: 1024, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2 },
  { name: 'mobile-narrow', width: 320, height: 568, dsf: 2 },
]

/* Landing-page anchors. The product and cart pages have no section ids — shoot
   those with `--route=/#/product --tag=product` and read the full-page image. */
const SECTIONS = [
  'proof',
  'design',
  'wiring',
  'warranty',
  'story',
]

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const BASE = args.base ?? 'http://localhost:5173'
// `--page=cart` rather than `--route=/#/cart`: Git Bash on Windows rewrites a
// leading-slash argument into a filesystem path (`/#/cart` becomes
// `C:/Program Files/Git/#/cart`), which produced a baffling "invalid URL".
const ROUTE =
  args.route ?? (typeof args.page === 'string' ? `/#/${args.page}` : '/#/')
const OUT = path.resolve('shots', args.tag ?? 'latest')
const REDUCE = args.motion === 'reduce'

const executablePath = EDGE_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chromium-based browser found. Checked:\n' + EDGE_CANDIDATES.join('\n'))
  process.exit(1)
}

console.log(`target ${BASE}${ROUTE}`)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Scroll the whole page in steps so IntersectionObserver reveals actually fire. */
async function primeReveals(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6)
    const total = document.body.scrollHeight
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, total)
    await new Promise((r) => setTimeout(r, 400))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 250))
  })
  // Let the final transitions settle.
  await sleep(1400)
}

/** Collect anything the page complained about while we were driving it. */
function attachDiagnostics(page, bag) {
  page.on('console', (msg) => {
    const type = msg.type()
    if (type === 'error' || type === 'warning') bag.console.push(`[${type}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => bag.pageErrors.push(String(err)))
  page.on('requestfailed', (req) =>
    bag.failedRequests.push(`${req.failure()?.errorText} ${req.url()}`),
  )
}

async function run() {
  if (existsSync(OUT)) await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--font-render-hinting=none'],
  })

  const targets = args.only
    ? VIEWPORTS.filter((v) => v.name === args.only)
    : VIEWPORTS

  const report = []

  for (const vp of targets) {
    const page = await browser.newPage()
    const bag = { console: [], pageErrors: [], failedRequests: [] }
    attachDiagnostics(page, bag)

    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      isMobile: vp.width <= 480,
      hasTouch: vp.width <= 900,
    })

    if (REDUCE) {
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ])
    }

    await page.goto(BASE + ROUTE, { waitUntil: 'networkidle0', timeout: 60000 })
    await sleep(1500) // hero entrance choreography
    await primeReveals(page)

    // Horizontal overflow is the single most common responsive defect — measure it.
    const metrics = await page.evaluate(() => {
      const de = document.documentElement
      const overflowing = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2)
        })
        .slice(0, 12)
        .map((el) => {
          const r = el.getBoundingClientRect()
          return `${el.tagName.toLowerCase()}.${String(el.className).split(' ').filter(Boolean).slice(0, 2).join('.')} → left:${Math.round(r.left)} right:${Math.round(r.right)}`
        })
      return {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        scrollHeight: de.scrollHeight,
        hasHorizontalScroll: de.scrollWidth > de.clientWidth + 1,
        overflowing,
      }
    })

    // Chromium's max texture is 16384px. A full-page shot beyond that silently
    // returns a periodic (tiled) image rather than failing, which makes the
    // capture look real while showing the same 8192 CSS px over and over — so
    // drop to 1x whenever height x scale would exceed the limit.
    const fullScale = metrics.scrollHeight * vp.dsf > 16000 ? 1 : vp.dsf
    if (fullScale !== vp.dsf) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: fullScale,
        isMobile: vp.width <= 480,
        hasTouch: vp.width <= 900,
      })
      await sleep(400)
    }
    if (metrics.scrollHeight > 16000) {
      console.log(
        `  note: ${vp.name} page is ${metrics.scrollHeight}px — full-page capture clamped to 1x`,
      )
    }

    await page.screenshot({
      path: path.join(OUT, `${vp.name}--full.png`),
      fullPage: true,
    })

    if (args.sections) {
      // Sections are captured by SCROLLING TO THEM and shooting the viewport,
      // never with elementHandle.screenshot(). Element capture returns a blank
      // image for tall elements on a page with sticky/fixed layers, which reads
      // as "this section renders nothing" and sends reviewers chasing bugs that
      // do not exist. Viewport capture is also simply what a person sees.
      for (const id of SECTIONS) {
        const found = await page.evaluate((sel) => {
          const el = document.getElementById(sel)
          if (!el) return null
          const top = window.scrollY + el.getBoundingClientRect().top
          window.scrollTo(0, top)
          return { top, height: el.getBoundingClientRect().height }
        }, id)
        if (!found) continue
        // Long enough for the slowest staggered reveal to settle. At 900ms the
        // closing statement's last line was still sliding up out of its mask
        // and every capture looked like a clipped-glyph bug.
        await sleep(1800)
        await page.screenshot({ path: path.join(OUT, `${vp.name}--${id}.png`) })

        // Tall sections need a second frame or the reviewer only ever sees
        // the top of them.
        if (found.height > vp.height * 1.6) {
          await page.evaluate((y) => window.scrollTo(0, y), found.top + vp.height * 0.92)
          await sleep(1100)
          await page.screenshot({
            path: path.join(OUT, `${vp.name}--${id}-b.png`),
          })
        }
      }
      // The hero has no id; capture the first viewport instead.
      await page.evaluate(() => window.scrollTo(0, 0))
      await sleep(500)
      await page.screenshot({ path: path.join(OUT, `${vp.name}--hero.png`) })
    }

    report.push({ viewport: vp.name, ...metrics, ...bag })
    await page.close()
    console.log(
      `${vp.name.padEnd(14)} ${metrics.scrollWidth}x${metrics.scrollHeight}` +
        (metrics.hasHorizontalScroll ? '  ⚠ HORIZONTAL OVERFLOW' : '') +
        (bag.pageErrors.length ? `  ⚠ ${bag.pageErrors.length} JS ERRORS` : ''),
    )
  }

  await browser.close()

  console.log('\n--- diagnostics ---')
  for (const r of report) {
    const issues = []
    if (r.hasHorizontalScroll)
      issues.push(`overflow ${r.scrollWidth}>${r.clientWidth}: ${r.overflowing.join(' | ')}`)
    if (r.pageErrors.length) issues.push(`errors: ${r.pageErrors.join(' | ')}`)
    if (r.failedRequests.length) issues.push(`failed: ${r.failedRequests.join(' | ')}`)
    if (r.console.length) issues.push(`console: ${r.console.slice(0, 6).join(' | ')}`)
    if (issues.length) console.log(`\n${r.viewport}:\n  ${issues.join('\n  ')}`)
  }

  const files = await readdir(OUT)
  console.log(`\n${files.length} images written to ${OUT}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
