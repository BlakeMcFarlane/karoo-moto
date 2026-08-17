import { Routes, Route } from 'react-router-dom'
import Toast from './components/Toast'
import ScrollToTop from './components/ScrollToTop'
import RallyNav from './components/rally/RallyNav'
import SiteFooter from './components/rally/SiteFooter'
import { TowerConfigProvider } from './components/rally/TowerConfig'

import RallyTower from './pages/RallyTower'
import Product from './pages/Product'
import About from './pages/About'
import Cart from './pages/Cart'
import Policy from './pages/Policy'
import NotFound from './pages/NotFound'

/**
 * The commerce flow is three pages:
 *
 *   Rally Tower landing (/)  →  Product (/product)  →  Cart (/cart)  →  Shopify
 *
 * Everything shares one chrome (RallyNav + SiteFooter) and one configurator
 * state (TowerConfigProvider), so the motorcycle a customer picks on the
 * product page is the same selection the landing page CTAs and the cart see.
 *
 * `/policies/:doc` is not a fourth "page" so much as the legal text the Rally
 * Tower's 45-day guarantee and 12-month warranty link to — deleting it would
 * break the trust section's links.
 */
export default function App() {
  return (
    <TowerConfigProvider>
      <ScrollToTop />
      {/* The app runs on a HashRouter, so a bare `href="#main"` REPLACES the
          route hash and lands on the 404. Focus is moved manually instead. */}
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          const main = document.getElementById('main')
          if (!main) return
          main.focus()
          main.scrollIntoView({ block: 'start' })
        }}
      >
        Skip to content
      </a>

      <RallyNav />

      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<RallyTower />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies/:doc" element={<Policy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <SiteFooter />
      <Toast />
    </TowerConfigProvider>
  )
}
