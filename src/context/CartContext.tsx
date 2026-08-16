import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/types'

export interface CartLine {
  slug: string
  name: string
  sku: string
  price: number
  finish: string
  art: Product['art']
  qty: number
}

interface CartState {
  lines: CartLine[]
  count: number
  subtotal: number
  toast: string | null
  add: (product: Product, finish: string, qty?: number) => void
  remove: (slug: string, finish: string) => void
  setQty: (slug: string, finish: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartState | null>(null)
const STORAGE_KEY = 'karoo-cart-v1'

const lineKey = (slug: string, finish: string) => `${slug}::${finish}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartLine[]) : []
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const add: CartState['add'] = (product, finish, qty = 1) => {
    setLines((prev) => {
      const key = lineKey(product.slug, finish)
      const existing = prev.find((l) => lineKey(l.slug, l.finish) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l.slug, l.finish) === key ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          price: product.salePrice ?? product.price,
          finish,
          art: product.art,
          qty,
        },
      ]
    })
    setToast(`${product.name} added to cart`)
  }

  const remove: CartState['remove'] = (slug, finish) => {
    const key = lineKey(slug, finish)
    setLines((prev) => prev.filter((l) => lineKey(l.slug, l.finish) !== key))
  }

  const setQty: CartState['setQty'] = (slug, finish, qty) => {
    const key = lineKey(slug, finish)
    setLines((prev) =>
      prev
        .map((l) =>
          lineKey(l.slug, l.finish) === key
            ? { ...l, qty: Math.max(0, qty) }
            : l,
        )
        .filter((l) => l.qty > 0),
    )
  }

  const clear = () => setLines([])

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0)
    return { lines, count, subtotal, toast, add, remove, setQty, clear }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
