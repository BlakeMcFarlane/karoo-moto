import { Link, useLocation } from 'react-router-dom'
import RallyIcon from '../components/rally/RallyIcon'

/**
 * 404 — also the fallback for an unknown /policies/:doc.
 *
 * Three pages exist, so the useful thing a missing route can do is name the
 * address that failed and point at the two that matter. Same stack as every
 * other block on the site — mono read-out, rule, display heading, one line,
 * actions — left-aligned to a single edge and vertically centred in the
 * document ground.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="rt-doc rt-doc--missing">
      <div className="rt-container rt-container--narrow rt-doc__missing-inner">
        <p className="rt-mono rt-doc__code">
          <span className="rt-doc__code-key">Error 404</span>
          <span className="rt-doc__code-sep" aria-hidden="true">
            /
          </span>
          <span className="rt-doc__code-path">{pathname}</span>
        </p>

        <hr className="rt-rule rt-doc__code-rule" />

        <h1 className="rt-h1 rt-doc__title">Off the map</h1>

        <p className="rt-lede rt-doc__lede">
          Nothing is fitted to that address. The Rally Tower is this way.
        </p>

        <div className="rt-doc__actions">
          <Link to="/" className="rt-btn rt-btn--primary">
            Back to the Rally Tower
            <RallyIcon name="arrow" size={16} className="rt-btn__icon" />
          </Link>
          <Link to="/product" className="rt-btn rt-btn--secondary">
            View the product
          </Link>
        </div>
      </div>
    </div>
  )
}
