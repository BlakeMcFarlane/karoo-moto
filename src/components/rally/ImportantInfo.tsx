import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { IMPORTANT_INFO } from '../../data/rallyTower'

/**
 * Important information — the disclosure.
 *
 * The quietest block on the page, and the last thing before the closing brand
 * moment. It still has to be read, so the copy sits at --rt-text-2 on a
 * comfortable measure rather than being greyed away — but it gets no display
 * type, no panel and no alert styling. The heading is an <h2> for document
 * structure and a margin note visually. One fade, no stagger.
 */
export default function ImportantInfo() {
  return (
    <section
      id="info"
      className="rt-section rt-section--sm rt-info"
      aria-labelledby="info-title"
    >
      <div className="rt-container rt-container--narrow">
        <Reveal variant="fade">
          <hr className="rt-rule rt-info__rule" />

          <div className="rt-info__grid">
            <h2 id="info-title" className="rt-mono rt-info__title">
              {IMPORTANT_INFO.title}
            </h2>

            <div className="rt-info__body">
              {IMPORTANT_INFO.body.map((paragraph) => (
                <p key={paragraph} className="rt-body-copy rt-info__para">
                  {paragraph}
                </p>
              ))}

              <ul className="rt-info__links" aria-label="Policy documents">
                {IMPORTANT_INFO.links.map((link) => (
                  <li key={link.to} className="rt-info__links-item">
                    <Link to={link.to} className="rt-link rt-info__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
