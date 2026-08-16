import { Link } from 'react-router-dom'
import Icon from './Icon'
import logoFull from '../assets/logo-full.webp'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logoFull} alt="Karoo Moto" width={690} height={462} />
            <p>
              Premium South African adventure-motorcycle hardware. Rally towers,
              navigation and cockpit systems engineered for clean integration and
              harsh terrain.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop/rally-towers">Rally Towers</Link></li>
              <li><Link to="/shop/navigation">Navigation</Link></li>
              <li><Link to="/shop/protection">Protection</Link></li>
              <li><Link to="/shop/lighting">Lighting</Link></li>
              <li><Link to="/shop/luggage">Luggage</Link></li>
              <li><Link to="/shop">All Products</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/fitment">Bike Fitment Finder</Link></li>
              <li><Link to="/support">Installation & Support</Link></li>
              <li><Link to="/policies/shipping">Shipping</Link></li>
              <li><Link to="/policies/returns">Returns</Link></li>
              <li><Link to="/policies/warranty">Warranty</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">Made in South Africa</Link></li>
              <li><Link to="/journal">Journal / Builds</Link></li>
              <li><Link to="/dealers">Dealers / Wholesale</Link></li>
              <li><Link to="/policies/privacy">Privacy</Link></li>
              <li><Link to="/policies/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Karoo Moto. Engineered in South Africa.</p>
          <div className="footer-legal">
            <span
              className="mono"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon name="globe" size={14} /> International shipping · USD
            </span>
            <Link to="/policies/privacy">Privacy</Link>
            <Link to="/policies/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
