import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from '../Icon'
import { useCart } from '../../context/CartContext'
import { useTowerConfig } from './TowerConfig'
import { clamp, usePrefersReducedMotion, useScrollY } from '../../lib/motion'
import { NAV_SECTIONS, RALLY_TOWER } from '../../data/rallyTower'
import badge from '../../assets/rally/logo-badge-320.jpg'

/** Dead-band around the solid/transparent trigger, in px, so a jittery
 *  trackpad can't flicker the whole chrome on and off. */
const HYSTERESIS = 40

/** Off the landing page the rail becomes plain route links: the product, and
 *  the brand behind it. Kept short — the nav should not imply more site than
 *  there is. */
const ROUTE_LINKS = [
  { to: '/', label: RALLY_TOWER.name },
  { to: '/product', label: 'Product' },
  { to: '/about', label: 'About' },
] as const

interface NavSection {
  id: string
  label: string
  /** True when `id` is a route path rather than an in-page anchor. */
  route?: boolean
}

interface ScrollDriverProps {
  navRef: RefObject<HTMLElement>
  onSolid: (solid: boolean) => void
}

/**
 * Renders nothing. It exists so the per-frame scroll value never reaches the
 * nav's own render: the progress bar is written straight onto the nav element
 * as a custom property, and the parent is only told about the solid state when
 * it actually flips. The nav therefore re-renders on state changes, not pixels.
 *
 * Mounted on the landing page only — it is the hero that makes the nav
 * transparent in the first place, and measuring the document on every other
 * route would be work nobody can see.
 */
function NavScrollDriver({ navRef, onSolid }: ScrollDriverProps) {
  const y = useScrollY()
  const [metrics, setMetrics] = useState({ max: 1, trigger: 1 })
  const solidRef = useRef(false)

  // Page height changes as lazy images resolve, so the progress denominator is
  // observed rather than measured once.
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight || 1
      const max = document.documentElement.scrollHeight - vh
      setMetrics({ max: max > 0 ? max : 1, trigger: vh * 0.7 })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const edge = solidRef.current
      ? metrics.trigger - HYSTERESIS
      : metrics.trigger + HYSTERESIS
    const next = y > edge
    if (next === solidRef.current) return
    solidRef.current = next
    onSolid(next)
  }, [y, metrics.trigger, onSolid])

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    el.style.setProperty('--rt-nav-p', String(clamp(y / metrics.max)))
  }, [y, metrics.max, navRef])

  return null
}

/**
 * Site chrome — one header for every route.
 *
 * On the landing page it behaves as it always has: transparent over the hero,
 * an ink plate with a hairline edge once the customer has committed, and a
 * scroll-spy rail over the section ids with an ember progress hairline.
 *
 * Everywhere else there is no hero to be transparent over and no sections to
 * spy on, so the rail becomes two quiet route links and the plate is there
 * from the first frame. Below 1100px both versions collapse into the same
 * full-screen overlay.
 */
export default function RallyNav() {
  const navRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pendingScroll = useRef<string | null>(null)

  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  const isProduct = pathname === '/product'

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [sections, setSections] = useState<NavSection[]>([])

  const { count } = useCart()
  const { isComplete, bikeLabel } = useTowerConfig()
  const reduced = usePrefersReducedMotion()
  const menuId = useId()

  // Off the landing page there is nothing behind the chrome, so it is opaque
  // immediately — a transparent bar over an ordinary dark document reads as a
  // rendering fault, not as restraint.
  const solid = !isLanding || scrolled

  // --- Scroll-spy ---------------------------------------------------------
  // One observer over every section that is ACTUALLY in the document. The data
  // module still lists sections that moved to /product, and a rail link that
  // scrolls nowhere is worse than no link. The margins bias the "current"
  // section towards the upper third, which is where the eye is while reading.
  useEffect(() => {
    if (!isLanding) {
      setSections([])
      setActiveId('')
      return
    }

    const targets: HTMLElement[] = []
    const present: NavSection[] = []
    NAV_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id)
      if (!el) return
      targets.push(el)
      present.push({ id: section.id, label: section.label })
    })
    setSections(present)
    if (!targets.length) return

    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) ratios.set(entry.target.id, entry.intersectionRatio)
          else ratios.delete(entry.target.id)
        })
        let best = ''
        let bestRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        setActiveId(best)
      },
      {
        rootMargin: '-18% 0px -55% 0px',
        threshold: [0, 0.2, 0.5, 0.8, 1],
      },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isLanding])

  // Leaving the landing page unmounts the scroll driver, so the scrolled flag
  // has to be dropped with it or the nav comes back to the hero already solid.
  useEffect(() => {
    if (!isLanding) setScrolled(false)
  }, [isLanding])

  // A route change closes the overlay. NavLinks to the CURRENT route don't
  // change the path, so those close themselves on click as well.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return
      const offset = navRef.current?.offsetHeight ?? 0
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduced ? 'auto' : 'smooth',
      })
    },
    [reduced],
  )

  // --- Overlay ------------------------------------------------------------
  // Declared before the deferred-scroll effect so its cleanup releases the
  // scroll lock in the same flush, before we try to scroll anywhere.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen || !pendingScroll.current) return
    const id = pendingScroll.current
    pendingScroll.current = null
    scrollToSection(id)
  }, [menuOpen, scrollToSection])

  useEffect(() => {
    if (!menuOpen) return
    const panel = overlayRef.current
    if (!panel) return
    const restoreTo = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      restoreTo?.focus()
    }
  }, [menuOpen])

  // Rotating to landscape past the desktop breakpoint would otherwise leave an
  // invisible overlay holding the scroll lock.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const goToSection = useCallback((id: string) => {
    pendingScroll.current = id
    setMenuOpen(false)
  }, [])

  const cartLabel = `Cart, ${count} ${count === 1 ? 'item' : 'items'}`

  // The tower is built to order, so the motorcycle the customer has already
  // chosen belongs in the CTA's accessible name — the button is a different
  // promise once a bike is attached to it.
  const ctaLabel =
    isComplete && bikeLabel
      ? `${RALLY_TOWER.ctaLabel} the ${RALLY_TOWER.name} for ${bikeLabel}`
      : `${RALLY_TOWER.ctaLabel} the ${RALLY_TOWER.name}`

  // No "go to the page you are on" button: on /product the cart is the only
  // forward action left in the chrome.
  const showCta = !isProduct

  // The overlay mirrors the rail. On the landing page that means the in-page
  // sections plus About, which is a route rather than an anchor — flagged so
  // the overlay knows to navigate instead of scroll.
  const overlayItems: NavSection[] = isLanding
    ? [...sections, { id: '/about', label: 'About', route: true }]
    : ROUTE_LINKS.map((link) => ({ id: link.to, label: link.label, route: true }))

  return (
    <>
      {/* Explicit role: this renders inside App's <main>, and a scoped
          <header> maps to `generic`, not `banner` — so without it the page has
          no banner landmark at all. */}
      <header
        ref={navRef}
        role="banner"
        className={`rt-nav ${isLanding ? '' : 'rt-nav--plain'} ${solid ? 'is-solid' : ''}`}
      >
        {isLanding && <NavScrollDriver navRef={navRef} onSolid={setScrolled} />}

        <div className="rt-container rt-nav__inner">
          <div className="rt-nav__brand">
            <Link to="/" className="rt-nav__home">
              <img
                className="rt-nav__badge"
                src={badge}
                alt=""
                width={34}
                height={34}
                decoding="async"
              />
              <span className="rt-nav__wordmark">KarooMoto</span>
            </Link>
            <span className="rt-nav__hairline" aria-hidden="true" />
            <span className="rt-nav__product">{RALLY_TOWER.name}</span>
          </div>

          {isLanding ? (
            <nav className="rt-nav__sections" aria-label="Rally Tower sections">
              {sections.map((section) => {
                const active = activeId === section.id
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`rt-nav__link ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <span className="rt-nav__dot" aria-hidden="true" />
                    {section.label}
                  </button>
                )
              })}
              {/* A route, not an anchor: About is a page, and it has to be
                  reachable from the navigation here too, not only off the
                  landing page. */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `rt-nav__link rt-nav__link--route ${isActive ? 'is-active' : ''}`
                }
              >
                <span className="rt-nav__dot" aria-hidden="true" />
                About
              </NavLink>
            </nav>
          ) : (
            <nav className="rt-nav__sections" aria-label="Main">
              {ROUTE_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `rt-nav__link rt-nav__link--route ${isActive ? 'is-active' : ''}`
                  }
                >
                  <span className="rt-nav__dot" aria-hidden="true" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="rt-nav__actions">
            {showCta && (
              <Link
                to="/product"
                // Outline, not filled: the purchase panel and the persistent
                // buy bar carry the one filled ember CTA. Two competing filled
                // CTAs in the same viewport make neither of them primary.
                className="rt-btn rt-btn--secondary rt-btn--sm rt-nav__cta"
                aria-label={ctaLabel}
              >
                {RALLY_TOWER.ctaLabel}
              </Link>
            )}

            <Link to="/cart" className="rt-nav__cart" aria-label={cartLabel}>
              <Icon name="cart" size={20} />
              {count > 0 && (
                <span className="rt-nav__count" aria-hidden="true">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="rt-nav__burger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
            >
              <span className="rt-nav__burger-line" aria-hidden="true" />
              <span className="rt-nav__burger-line" aria-hidden="true" />
            </button>
          </div>
        </div>

        {isLanding && <span className="rt-nav__progress" aria-hidden="true" />}
      </header>

      <div
        id={menuId}
        ref={overlayRef}
        className={`rt-nav__overlay ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${RALLY_TOWER.name} menu`}
      >
        <div className="rt-nav__overlay-head">
          <img
            className="rt-nav__badge"
            src={badge}
            alt=""
            width={34}
            height={34}
            decoding="async"
          />
          <button
            ref={closeRef}
            type="button"
            className="rt-nav__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav
          className="rt-nav__menu"
          aria-label={isLanding ? 'Rally Tower sections' : 'Main'}
        >
          {overlayItems.map((item, i) => {
            const index = (
              <span className="rt-nav__menu-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            )
            const style = { '--rt-i': i } as CSSProperties

            // Sections scroll the page they are already on; routes navigate.
            // On the landing page the list is mostly anchors with About at the
            // end, so the decision is per item, not per page.
            return isLanding && !item.route ? (
              <button
                key={item.id}
                type="button"
                className={`rt-nav__menu-link ${activeId === item.id ? 'is-active' : ''}`}
                aria-current={activeId === item.id ? 'true' : undefined}
                style={style}
                onClick={() => goToSection(item.id)}
              >
                {index}
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.id}
                to={item.id}
                end
                className={({ isActive }) =>
                  `rt-nav__menu-link ${isActive ? 'is-active' : ''}`
                }
                style={style}
                onClick={() => setMenuOpen(false)}
              >
                {index}
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="rt-nav__overlay-foot">
          <Link
            to="/cart"
            className="rt-nav__overlay-cart"
            aria-label={cartLabel}
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="cart" size={18} />
            <span>Cart</span>
            {count > 0 && <span className="rt-nav__count" aria-hidden="true">{count}</span>}
          </Link>
          {showCta && (
            <Link
              to="/product"
              className="rt-btn rt-btn--secondary rt-btn--sm rt-nav__overlay-cta"
              aria-label={ctaLabel}
              onClick={() => setMenuOpen(false)}
            >
              {RALLY_TOWER.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
