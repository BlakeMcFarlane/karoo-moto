import { Link, useParams } from 'react-router-dom'
import TopoPattern from '../components/art/TopoPattern'
import NotFound from './NotFound'

interface Doc {
  title: string
  eyebrow: string
  intro: string
  sections: { h: string; body: string[] }[]
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
    title: 'Returns',
    eyebrow: 'Policies',
    intro:
      'Unused parts in original condition can be returned within 30 days. Made-to-order items are non-returnable.',
    sections: [
      {
        h: '30-day returns',
        body: [
          'Return unused, uninstalled products in their original packaging within 30 days of delivery for a refund of the item price.',
          'Return shipping is the responsibility of the customer unless the return is due to our error.',
        ],
      },
      {
        h: 'Made-to-order items',
        body: [
          'Products marked "Made to Order" are produced specifically for you and cannot be returned unless faulty.',
        ],
      },
      {
        h: 'Damaged or incorrect items',
        body: [
          'If an item arrives damaged or incorrect, contact us within 7 days with photos and your order number. We will arrange a replacement or refund.',
        ],
      },
    ],
  },
  warranty: {
    title: 'Warranty',
    eyebrow: 'Policies',
    intro:
      'We stand behind our fabrication. Structural components carry a 3-year warranty; electronics and finish items carry 2 years.',
    sections: [
      {
        h: 'What is covered',
        body: [
          'Structural failure of towers, racks and mounts under normal use is covered for 3 years from purchase.',
          'Electronic components and finishes are covered for 2 years against manufacturing defects.',
        ],
      },
      {
        h: 'What is not covered',
        body: [
          'Crash damage, cosmetic wear, corrosion from neglect, improper installation and modification are not covered.',
          'Follow the supplied torque values and installation guidance to keep your warranty valid.',
        ],
      },
      {
        h: 'Making a claim',
        body: [
          'Contact us with your order number, photos and a description of the issue. We will assess and, where valid, repair or replace the part.',
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
  terms: {
    title: 'Terms',
    eyebrow: 'Legal',
    intro:
      'By using this site and placing an order you agree to the following terms.',
    sections: [
      {
        h: 'Products & fitment',
        body: [
          'We work hard to keep fitment and specification data accurate. Confirm compatibility with the fitment finder before ordering; contact us if you are unsure.',
          'Product images in this build are placeholders and will be replaced with photography of the actual products.',
        ],
      },
      {
        h: 'Pricing & orders',
        body: [
          'Prices are shown in USD and may change without notice. We reserve the right to cancel orders in cases of pricing error or stock issues.',
        ],
      },
      {
        h: 'Liability',
        body: [
          'Products must be installed according to our guidance. We are not liable for damage or injury arising from improper installation or use.',
        ],
      },
    ],
  },
}

export default function Policy() {
  const { doc } = useParams<{ doc: string }>()
  const data = doc ? DOCS[doc] : undefined
  if (!data) return <NotFound />

  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>{data.title}</span>
          </div>
          <span className="eyebrow">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            {data.sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
            <p className="mono muted" style={{ fontSize: '0.8rem', marginTop: 'var(--sp-7)' }}>
              This is placeholder policy copy for a front-end build. Have it
              reviewed before publishing. Questions?{' '}
              <Link to="/contact" style={{ color: 'var(--copper)' }}>
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
