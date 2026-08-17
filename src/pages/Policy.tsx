import { Link, useParams } from 'react-router-dom'
import {
  TERMS_ACKNOWLEDGMENT,
  TERMS_PREAMBLE,
  TERMS_SECTIONS,
  TERMS_TITLE,
  TERMS_UPDATED,
} from '../data/terms'
import RallyIcon from '../components/rally/RallyIcon'
import NotFound from './NotFound'

interface DocSection {
  h: string
  body: string[]
  /** Bulleted items, where the supplied legal text uses them. */
  list?: string[]
  /** Prose that follows the list. */
  after?: string[]
}

interface Doc {
  title: string
  eyebrow: string
  intro: string
  sections: DocSection[]
}

const DOCS: Record<string, Doc> = {
  shipping: {
    title: 'Shipping',
    eyebrow: 'Policies',
    intro:
      'We ship premium hardware from South Africa to the United States and worldwide. Here is what to expect.',
    sections: [
      {
        h: 'Origin & destinations',
        body: [
          'Orders ship from our South African facility. We deliver to the United States and most international destinations.',
          'In-stock items typically dispatch within 2–3 business days. Made-to-order items list an estimated lead time on the product page.',
        ],
      },
      {
        h: 'Duties & taxes',
        body: [
          'International shipping available. Import duties and taxes may apply depending on your destination and are the responsibility of the recipient unless stated otherwise at checkout.',
          'Where available, estimated duties are shown before you complete your order.',
        ],
      },
      {
        h: 'Tracking',
        body: [
          'You will receive tracking details by email once your order dispatches. Transit times vary by destination and customs processing.',
        ],
      },
    ],
  },
  returns: {
    title: 'Return & Refund Policy',
    eyebrow: '45-Day Satisfaction Guarantee',
    intro:
      'Every KarooMoto Rally Tower includes a 45-Day Satisfaction Guarantee. Install it, ride with it, and experience it on your motorcycle before you decide.',
    sections: [
      {
        h: '45-Day Satisfaction Guarantee',
        body: [
          'Every KarooMoto Rally Tower includes a 45-Day Satisfaction Guarantee, giving you the opportunity to install the tower, ride with it, and experience it on your motorcycle.',
          'If you are not satisfied, contact KarooMoto within 45 days of delivery to arrange a return.',
        ],
      },
      {
        h: 'Installation does not void the guarantee',
        body: [
          'Normal installation, including the wiring connections or splicing required for installation, does not automatically make the product ineligible for return.',
          'We would rather you fitted the tower properly and formed a real opinion of it than left it in the box.',
        ],
      },
      {
        h: 'How to arrange a return',
        body: [
          'Contact us with your order number and a short description of why the tower is not working out for you. We will confirm the return address and the process before you ship anything.',
          'Return shipping is the responsibility of the customer unless the return is due to our error or a defective product.',
        ],
      },
      {
        h: 'Condition on return',
        body: [
          'Returned towers should be complete, with all supplied hardware and the wiring loom, and free of damage beyond the normal marks of installation and use.',
          'Damage from crashes, modification, or use outside the product’s intended application is not covered by the guarantee.',
        ],
      },
      {
        h: 'Damaged or incorrect items',
        body: [
          'If an item arrives damaged or incorrect, contact us within 7 days with photos and your order number. We will arrange a replacement or refund.',
        ],
      },
      {
        h: 'Other products',
        body: [
          'Products outside the Rally Tower range may be returned unused and uninstalled, in their original packaging, within 30 days of delivery.',
          'Products marked "Made to Order" are produced specifically for you and cannot be returned unless faulty.',
        ],
      },
    ],
  },
  warranty: {
    title: '12-Month Limited Warranty',
    eyebrow: 'Warranty',
    intro:
      'Every KarooMoto Rally Tower is backed by a 12-Month Limited Warranty against defects in materials and workmanship.',
    sections: [
      {
        h: 'What is covered',
        body: [
          'The KarooMoto Rally Tower is warranted against defects in materials and workmanship for 12 months from the date of delivery.',
          'Where a valid defect is confirmed, we will repair or replace the affected component at our discretion.',
        ],
      },
      {
        h: 'What is not covered',
        body: [
          'Crash damage, cosmetic wear, corrosion from neglect, improper installation, and modification are not covered.',
          'Follow the supplied installation guidance and torque values to keep your warranty valid.',
        ],
      },
      {
        h: 'Lighting and electrical',
        body: [
          'The supplied high-output lighting is designed primarily for adventure, rally, competition, and off-road applications and is not currently represented as DOT-certified. Requirements for on-road lighting vary by jurisdiction.',
          'Damage caused by incorrect wiring, reverse polarity, or connection to an unsuitable supply is not covered.',
        ],
      },
      {
        h: 'Making a claim',
        body: [
          'Contact us with your order number, photos, and a description of the issue. We will assess and, where valid, repair or replace the part.',
        ],
      },
      {
        h: 'Other products',
        body: [
          'Structural components outside the Rally Tower range carry a 3-year warranty; electronic components and finishes carry 2 years against manufacturing defects.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    eyebrow: 'Legal',
    intro:
      'We collect only what we need to process your order and support your build. We do not sell your data.',
    sections: [
      {
        h: 'What we collect',
        body: [
          'Contact and shipping details you provide at checkout, and basic analytics that help us improve the store.',
        ],
      },
      {
        h: 'How we use it',
        body: [
          'To fulfil orders, provide support, and send updates you have opted into. You can unsubscribe from marketing at any time.',
        ],
      },
      {
        h: 'Your rights',
        body: [
          'You can request access to, correction of, or deletion of your personal data by contacting us.',
        ],
      },
    ],
  },
  /* The supplied Terms & Conditions are the authority. They live in
     `src/data/terms.ts` and are rendered here from that single source, so the
     acceptance modal above the checkout button and this page can never drift
     apart. The placeholder terms that used to sit here have been replaced. */
  terms: {
    title: TERMS_TITLE,
    eyebrow: TERMS_UPDATED,
    intro: TERMS_PREAMBLE,
    sections: [
      ...TERMS_SECTIONS.map((s) => ({
        h: `${s.n}. ${s.title}`,
        body: s.body,
        list: s.list,
        after: s.after,
      })),
      { h: TERMS_ACKNOWLEDGMENT.title, body: TERMS_ACKNOWLEDGMENT.body },
    ],
  },
}

/**
 * Reading order for the cross-links at the foot of every document. Derived
 * from DOCS rather than hand-listed per page, so a policy can never link to a
 * route that does not exist.
 */
const DOC_ORDER = ['returns', 'warranty', 'terms', 'shipping', 'privacy']

/**
 * The policy documents — /policies/:doc.
 *
 * These are the legal texts the Rally Tower's 45-day guarantee and 12-month
 * warranty link to, so they are set as a document rather than a section of the
 * landing page: one narrow prose column, hairline-ruled clauses, no imagery
 * and no scroll choreography. The copy is unchanged; only the setting is.
 */
export default function Policy() {
  const { doc } = useParams<{ doc: string }>()
  const data = doc ? DOCS[doc] : undefined
  if (!data) return <NotFound />

  const related = DOC_ORDER.filter((key) => key !== doc)

  return (
    <div className="rt-doc rt-doc--policy">
      <div className="rt-container rt-container--narrow">
        <header className="rt-head rt-doc__head">
          <nav className="rt-mono rt-doc__crumbs" aria-label="Breadcrumb">
            <Link to="/" className="rt-doc__crumb-link">
              Home
            </Link>
            <span className="rt-doc__crumb-sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{data.title}</span>
          </nav>

          <p className="rt-eyebrow">{data.eyebrow}</p>
          <h1 className="rt-h1 rt-doc__title">{data.title}</h1>
          <p className="rt-lede rt-doc__lede">{data.intro}</p>
        </header>

        <div className="rt-doc__prose rt-stack-ruled">
          {data.sections.map((s) => (
            <section key={s.h} className="rt-doc__clause">
              <h2 className="rt-h3 rt-doc__clause-title">{s.h}</h2>
              {s.body.map((p) => (
                <p key={p} className="rt-body-copy rt-doc__para">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="rt-doc__list">
                  {s.list.map((item) => (
                    <li key={item} className="rt-body-copy rt-doc__list-item">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p) => (
                <p key={p} className="rt-body-copy rt-doc__para">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <footer className="rt-doc__foot">
          {/* No contact route exists on the three-page site, so the foot hands
              the reader the rest of the policy set instead of a dead address. */}
          <p className="rt-mono rt-doc__foot-label">The rest of the policy set</p>
          <ul className="rt-divided rt-doc__links">
            {related.map((key) => (
              <li key={key}>
                <Link className="rt-link" to={`/policies/${key}`}>
                  {DOCS[key].title}
                  <RallyIcon name="arrow" size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  )
}
