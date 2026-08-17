import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  TERMS_ACCEPT,
  TERMS_ACKNOWLEDGMENT,
  TERMS_PREAMBLE,
  TERMS_SECTIONS,
  TERMS_TITLE,
  TERMS_UPDATED,
} from '../../data/terms'

/**
 * The Terms & Conditions, read in place.
 *
 * The customer is being asked to agree to a document, so the document has to
 * be readable without leaving the cart they are halfway through — a link that
 * navigated away would cost them their place in the checkout and is exactly
 * the friction that makes people tick a box they never opened.
 *
 * Every word comes from `src/data/terms.ts`, the same module the
 * `/policies/terms` page renders, so the modal and the published document
 * cannot drift apart.
 *
 * Keyboard contract (the pattern is RallyNav's audited overlay):
 *   • focus moves to the close button on open
 *   • Tab and Shift+Tab cycle inside the panel and nowhere else
 *   • Escape closes
 *   • focus returns to whatever opened it
 *   • the scrolling region is itself focusable, so the document can be read
 *     with the keyboard alone
 */

/** Short connective microcopy — the data module supplies no footer strings. */
const SCROLL_HINT = 'Scroll to the end to accept'
const SCROLL_DONE = 'You have reached the end'

interface TermsModalProps {
  /** Reflects the cart's acceptance, so the footer offers the right action. */
  accepted: boolean
  /** True once the document has been read to its end. */
  read: boolean
  /** Fired the first time the end of the document is reached. */
  onRead: () => void
  /** Accepting from inside the document ticks the cart's checkbox. */
  onAccept: () => void
  onClose: () => void
}

export default function TermsModal({
  accepted,
  read,
  onRead,
  onAccept,
  onClose,
}: TermsModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // The page behind must not scroll while the document is open, or a wheel
  // gesture past the end of the terms quietly moves the cart underneath.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const restoreTo = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      // `[tabindex="0"]` catches the scroll region, which has to stay in the
      // cycle — it is the only way a keyboard user reaches the text itself.
      const items = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
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
  }, [onClose])

  /* "Read to the end" is observed, not calculated from scroll offsets. An
     IntersectionObserver on a sentinel at the foot of the document reports the
     end as reached however it got there — a wheel, PageDown, a swipe, an
     assistive technology moving its reading cursor, a resize, a zoom-out, or
     the document simply being shorter than the panel it is in. Scroll maths
     would only fire for input methods that emit scroll events, which is how a
     gate like this locks somebody out of their own checkout. */
  useEffect(() => {
    const root = scrollRef.current
    const end = endRef.current
    if (!root || !end) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        onRead()
      },
      { root, threshold: 0 },
    )
    observer.observe(end)
    return () => observer.disconnect()
  }, [onRead])

  return createPortal(
    <div className="rt-terms">
      {/* Click-outside. Decorative to assistive technology — Escape and the
          close button are the announced ways out. */}
      <div className="rt-terms__backdrop" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className="rt-terms__panel rt-glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="rt-terms__head">
          <div className="rt-terms__headings">
            <h2 id={titleId} className="rt-h3 rt-terms__title">
              {TERMS_TITLE}
            </h2>
            <p className="rt-mono rt-terms__updated">{TERMS_UPDATED}</p>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="rt-terms__close"
            aria-label={TERMS_ACCEPT.closeLabel}
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div
          ref={scrollRef}
          className="rt-terms__scroll"
          tabIndex={0}
          role="region"
          aria-labelledby={titleId}
        >
          <div className="rt-terms__doc">
            <p className="rt-terms__preamble">{TERMS_PREAMBLE}</p>

            <div className="rt-terms__clauses rt-stack-ruled">
              {TERMS_SECTIONS.map((section) => (
                <section className="rt-terms__clause" key={section.n}>
                  <h3 className="rt-h4 rt-terms__clause-title">
                    <span className="rt-terms__n">{section.n}.</span>{' '}
                    {section.title}
                  </h3>

                  {section.body.map((para) => (
                    <p className="rt-terms__para" key={para}>
                      {para}
                    </p>
                  ))}

                  {/* Driven by the data, not by which clause happens to have
                      a list today. */}
                  {section.list && (
                    <ul className="rt-terms__list">
                      {section.list.map((item) => (
                        <li className="rt-terms__list-item" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.after?.map((para) => (
                    <p className="rt-terms__para" key={para}>
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <section className="rt-terms__ack">
              <h3 className="rt-h4 rt-terms__clause-title">
                {TERMS_ACKNOWLEDGMENT.title}
              </h3>
              {TERMS_ACKNOWLEDGMENT.body.map((para) => (
                <p className="rt-terms__para" key={para}>
                  {para}
                </p>
              ))}
            </section>

            <div ref={endRef} className="rt-terms__end" aria-hidden="true" />
          </div>
        </div>

        <footer className="rt-terms__foot">
          <p
            className="rt-mono rt-terms__progress"
            data-read={read ? 'true' : 'false'}
            aria-live="polite"
          >
            {read ? SCROLL_DONE : SCROLL_HINT}
          </p>

          <div className="rt-terms__actions">
            <button
              type="button"
              className="rt-btn rt-btn--secondary rt-btn--sm"
              onClick={onClose}
            >
              Close
            </button>

            {/* A second route to the same acceptance: having just read the
                document is the moment to agree to it. Never automatic. */}
            {!accepted && (
              <button
                type="button"
                className="rt-btn rt-btn--primary rt-btn--sm"
                aria-disabled={!read || undefined}
                onClick={() => {
                  if (!read) return
                  onAccept()
                  onClose()
                }}
              >
                Accept
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
