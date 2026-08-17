import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  shopify,
  createCart,
  addLine as shopifyAddLine,
  updateLineQuantity,
  removeLine as shopifyRemoveLine,
  fetchCart,
  ShopifyError,
  type ShopifyCart,
} from '../lib/shopify'

/**
 * Cart state.
 *
 * Shopify is the source of truth whenever it is configured: every mutation goes
 * to the Storefront API and the returned cart is what we render, so quantities,
 * pricing and the checkout URL are always Shopify's, never ours.
 *
 * When it is NOT configured the same interface is served from local state so
 * the whole flow — product → configure → cart → checkout hand-off — can be
 * built, demoed and tested without a store. `usingShopify` says which mode is
 * live, and the cart page tells the customer plainly rather than pretending.
 */

/** What the customer configured. Becomes Shopify cart line attributes. */
export type LineProperties = Record<string, string>

export interface CartLine {
  /** Shopify cart line id, or a deterministic local id in fallback mode. */
  id: string
  /** Product identity for links back into the site. */
  slug: string
  name: string
  sku: string
  /** Unit price in the cart currency. */
  price: number
  currency: string
  qty: number
  image?: string
  properties: LineProperties
  href?: string
}

export interface NewCartLine {
  slug: string
  name: string
  sku: string
  price: number
  currency?: string
  qty?: number
  /** Ceiling for this line. Adds that would exceed it are clamped, not stacked. */
  maxQty?: number
  image?: string
  properties?: LineProperties
  href?: string
  /** Shopify variant GID. Required for a real Shopify cart. */
  merchandiseId?: string
}

interface CartState {
  lines: CartLine[]
  count: number
  subtotal: number
  currency: string
  /** True when mutations are in flight against Shopify. */
  busy: boolean
  /** Set when Shopify rejected something; surfaced in the cart UI. */
  error: string | null
  /** False when running on local fallback state. */
  usingShopify: boolean
  /** Shopify-hosted checkout URL; null until there is a Shopify cart. */
  checkoutUrl: string | null
  toast: string | null
  /** Resolves false if the store rejected the add — see `error`. */
  addLine: (line: NewCartLine) => Promise<boolean>
  setQty: (id: string, qty: number) => Promise<void>
  remove: (id: string) => Promise<void>
  clear: () => void
  dismissError: () => void
}

const CartContext = createContext<CartState | null>(null)

const LINES_KEY = 'karoo-cart-v3'
const CART_ID_KEY = 'karoo-shopify-cart-id'

const attrsFrom = (props: LineProperties) =>
  Object.entries(props).map(([key, value]) => ({ key, value }))

/** Deterministic id so the same configuration merges instead of duplicating. */
const localId = (slug: string, props: LineProperties): string =>
  `${slug}::${Object.keys(props)
    .sort()
    .map((k) => `${k}=${props[k]}`)
    .join('|')}`

const fromShopify = (cart: ShopifyCart): CartLine[] =>
  cart.lines.map((l) => ({
    id: l.id,
    slug: 'rally-tower',
    name: l.title,
    sku: l.variantTitle ?? '',
    price: Number(l.unitPrice.amount),
    currency: l.unitPrice.currencyCode,
    qty: l.quantity,
    image: l.image,
    properties: Object.fromEntries(l.attributes.map((a) => [a.key, a.value])),
    href: '/product',
  }))

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(LINES_KEY)
      return raw ? (JSON.parse(raw) as CartLine[]) : []
    } catch {
      return []
    }
  })
  const [cartId, setCartId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CART_ID_KEY)
    } catch {
      return null
    }
  })
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')

  const usingShopify = shopify.configured

  // Local mirror. In Shopify mode this is a cache so the cart renders instantly
  // on reload while the authoritative copy is re-fetched.
  useEffect(() => {
    try {
      localStorage.setItem(LINES_KEY, JSON.stringify(lines))
    } catch {
      /* quota / privacy mode */
    }
  }, [lines])

  useEffect(() => {
    try {
      if (cartId) localStorage.setItem(CART_ID_KEY, cartId)
      else localStorage.removeItem(CART_ID_KEY)
    } catch {
      /* ignore */
    }
  }, [cartId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const applyCart = useCallback((cart: ShopifyCart) => {
    setCartId(cart.id)
    setCheckoutUrl(cart.checkoutUrl)
    setCurrency(cart.subtotal.currencyCode)
    setLines(fromShopify(cart))
  }, [])

  // Rehydrate the Shopify cart on load: quantities may have changed elsewhere,
  // and a cart can be completed or expired server-side.
  useEffect(() => {
    if (!usingShopify || !cartId) return
    let cancelled = false
    fetchCart(cartId)
      .then((cart) => {
        if (cancelled) return
        if (cart) applyCart(cart)
        else {
          setCartId(null)
          setLines([])
        }
      })
      .catch(() => {
        /* keep the cached lines; the next mutation will surface any error */
      })
    return () => {
      cancelled = true
    }
    // Runs once for the cart we were given at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingShopify])

  const fail = (e: unknown) => {
    const message =
      e instanceof ShopifyError
        ? e.message
        : 'Something went wrong talking to the store. Please try again.'
    setError(message)
  }

  const addLine: CartState['addLine'] = useCallback(
    async (line) => {
      const props = line.properties ?? {}
      const qty = line.qty ?? 1
      setError(null)

      if (usingShopify && line.merchandiseId) {
        setBusy(true)
        try {
          const cart = cartId
            ? await shopifyAddLine(cartId, line.merchandiseId, qty, attrsFrom(props))
            : await createCart(line.merchandiseId, qty, attrsFrom(props))
          applyCart(cart)
          setToast(`${line.name} added to cart`)
          return true
        } catch (e) {
          fail(e)
          return false
        } finally {
          setBusy(false)
        }
      }

      // Local fallback — same merge semantics Shopify applies.
      setLines((prev) => {
        const id = localId(line.slug, props)
        const existing = prev.find((l) => l.id === id)
        if (existing) {
          // Clamped: adding 9 twice must not build an 18-unit line the cart
          // page then refuses to decrement.
          const ceiling = line.maxQty ?? Number.MAX_SAFE_INTEGER
          return prev.map((l) =>
            l.id === id ? { ...l, qty: Math.min(ceiling, l.qty + qty) } : l,
          )
        }
        return [
          ...prev,
          {
            id,
            slug: line.slug,
            name: line.name,
            sku: line.sku,
            price: line.price,
            currency: line.currency ?? 'USD',
            qty,
            image: line.image,
            properties: props,
            href: line.href,
          },
        ]
      })
      setToast(`${line.name} added to cart`)
      return true
    },
    [usingShopify, cartId, applyCart],
  )

  const setQty: CartState['setQty'] = useCallback(
    async (id, qty) => {
      const next = Math.max(0, qty)
      setError(null)

      if (usingShopify && cartId) {
        setBusy(true)
        try {
          applyCart(await updateLineQuantity(cartId, id, next))
        } catch (e) {
          fail(e)
        } finally {
          setBusy(false)
        }
        return
      }

      setLines((prev) =>
        prev.map((l) => (l.id === id ? { ...l, qty: next } : l)).filter((l) => l.qty > 0),
      )
    },
    [usingShopify, cartId, applyCart],
  )

  const remove: CartState['remove'] = useCallback(
    async (id) => {
      setError(null)

      if (usingShopify && cartId) {
        setBusy(true)
        try {
          applyCart(await shopifyRemoveLine(cartId, id))
        } catch (e) {
          fail(e)
        } finally {
          setBusy(false)
        }
        return
      }

      setLines((prev) => prev.filter((l) => l.id !== id))
    },
    [usingShopify, cartId, applyCart],
  )

  const clear = useCallback(() => {
    setLines([])
    setCartId(null)
    setCheckoutUrl(null)
  }, [])

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0)
    return {
      lines,
      count,
      subtotal,
      currency,
      busy,
      error,
      usingShopify,
      checkoutUrl,
      toast,
      addLine,
      setQty,
      remove,
      clear,
      dismissError: () => setError(null),
    }
  }, [
    lines,
    currency,
    busy,
    error,
    usingShopify,
    checkoutUrl,
    toast,
    addLine,
    setQty,
    remove,
    clear,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/** Currency formatter shared by every price on the site. */
export const money = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
