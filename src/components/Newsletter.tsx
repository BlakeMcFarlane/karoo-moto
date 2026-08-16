import { useState } from 'react'
import Icon from './Icon'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    setEmail('')
  }

  return (
    <div className="newsletter">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Field Notes
      </div>
      <h2>New fitments. New builds. No noise.</h2>
      <p className="lede" style={{ maxWidth: '48ch', margin: '12px auto 0' }}>
        Get notified when we add bike platforms, restock rally towers and publish
        install guides. A few emails a month — nothing more.
      </p>

      {done ? (
        <div
          className="mono"
          style={{
            marginTop: 24,
            color: 'var(--copper)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon name="check" size={18} /> You're on the list. Watch your inbox.
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="rider@example.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Subscribe
          </button>
        </form>
      )}
      <p className="newsletter-note">We respect your inbox. Unsubscribe anytime.</p>
    </div>
  )
}
