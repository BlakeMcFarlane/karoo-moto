import { Link } from 'react-router-dom'
import { CLOSING } from '../../data/rallyTower'
import badge from '../../assets/rally/logo-badge-320.jpg'

/**
 * The site footer — one strip under every route.
 *
 * It used to live at the bottom of ClosingBrand, where it only existed on the
 * landing page. Now it closes every document, so it carries the whole flow
 * (tower → cart) as well as the legal text the guarantee and warranty link to.
 *
 * Everything stays one hairline thick: the brand moment above it on the
 * landing page is the signature, and this is the small print underneath it.
 */

const FOOT_LINKS = [
  { to: '/product', label: 'Rally Tower' },
  { to: '/about', label: 'About' },
  { to: '/cart', label: 'Cart' },
  { to: '/policies/returns', label: '45-Day Guarantee' },
  { to: '/policies/warranty', label: '12-Month Warranty' },
  { to: '/policies/terms', label: 'Terms & Conditions' },
  { to: '/policies/shipping', label: 'Shipping Policy' },
  { to: '/policies/privacy', label: 'Privacy Policy' },
]

export default function SiteFooter() {
  return (
    /* Explicit role for the same reason as the nav's banner: a <footer> scoped
       inside App's <main> maps to `generic`, not `contentinfo`. */
    <footer role="contentinfo" className="rt-foot">
      <div className="rt-container rt-foot__inner">
        <div className="rt-foot__brand">
          <img
            className="rt-foot__badge"
            src={badge}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
          <div className="rt-foot__brand-text">
            <p className="rt-foot__signoff">{CLOSING.signoff}</p>
            <p className="rt-mono rt-foot__coords">{CLOSING.coords}</p>
          </div>
        </div>

        <nav className="rt-foot__nav" aria-label="Footer">
          <ul className="rt-divided rt-foot__links">
            {FOOT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="rt-foot__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="rt-container rt-foot__base">
        <hr className="rt-rule rt-foot__rule" />
        <p className="rt-mono rt-foot__legal">
          © {new Date().getFullYear()} KarooMoto. Engineered in South Africa.
        </p>
      </div>
    </footer>
  )
}
