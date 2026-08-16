import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { useCart } from '../context/CartContext'
import logoLockup from '../assets/logo-lockup.webp'
import logoEmblem from '../assets/logo-emblem.webp'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop/rally-towers', label: 'Rally Towers' },
  { to: '/fitment', label: 'Find Your Bike' },
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },
  { to: '/journal', label: 'Journal' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const { count } = useCart()
  const { pathname } = useLocation()

  // Home has a full-bleed hero → transparent header until scroll.
  const overHero = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawer(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const solid = scrolled || !overHero

  return (
    <>
      <div className="announce">
        Free US shipping over <strong>$450</strong> · International shipping
        available · <strong>Engineered in South Africa</strong>
      </div>

      <header className={`site-header ${solid ? 'solid' : 'transparent'}`}>
        <div className="container header-inner">
          <Link to="/" className="brand-link" aria-label="Karoo Moto — home">
            <img src={logoLockup} alt="Karoo Moto" width={690} height={406} />
          </Link>

          <nav className="main-nav" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                end={n.to === '/shop'}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/shop" className="icon-btn" aria-label="Search products">
              <Icon name="search" size={21} />
            </Link>
            <Link to="/dealers" className="icon-btn" aria-label="Dealer login">
              <Icon name="user" size={21} />
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
              <Icon name="cart" size={21} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button
              className="icon-btn nav-toggle"
              aria-label="Open menu"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`mobile-drawer ${drawer ? 'open' : ''}`}
        onClick={() => setDrawer(false)}
      >
        <div
          className="mobile-drawer-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Menu"
        >
          <div className="mobile-drawer-head">
            <img
              src={logoEmblem}
              alt="Karoo Moto"
              width={60}
              height={47}
              style={{ height: 40, width: 'auto' }}
            />
            <button
              className="icon-btn"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
            >
              <Icon name="close" size={24} />
            </button>
          </div>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={n.to === '/shop'}
            >
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/dealers">Dealers / Wholesale</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </div>
    </>
  )
}
