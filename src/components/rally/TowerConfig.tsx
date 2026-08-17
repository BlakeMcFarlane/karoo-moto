import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from '../../context/CartContext'
import { shopify } from '../../lib/shopify'
import {
  RALLY_TOWER,
  brandById,
  modelById,
  platformFor,
  variantsFor,
  needsVariant,
  type BrandId,
  type Platform,
  type PlatformOption,
} from '../../data/rallyTower'

/**
 * The bike configuration, shared across the whole site.
 *
 * It is deliberately app-level rather than page-level: the landing page's CTAs
 * need to know whether a bike is already chosen, the product page owns the
 * selector, and the cart shows the result. The selection also survives a
 * reload, so a customer who comes back to the cart still sees the motorcycle
 * they configured.
 *
 * Compatibility is enforced here, not in the UI. `isComplete` is the single
 * gate the Add to Cart button reads, and it is false unless brand, model and
 * year resolve to a real platform — so an impossible pair such as a 2025
 * CRF450L can never reach the cart even if a selector were to offer it.
 */

export interface Selection {
  brand?: BrandId
  modelId?: string
  year?: number
  /** Only used by platforms that declare more than one selectable variant. */
  variantId?: string
}

interface TowerConfigValue {
  selection: Selection
  platform: Platform | undefined
  /** The variants this platform offers, if any. */
  variants: PlatformOption[]
  variant: PlatformOption | undefined
  /** True only when the whole configuration is valid and buildable. */
  isComplete: boolean
  /** Brand + model + year chosen, but the combination does not exist. */
  isIncompatible: boolean
  /** e.g. "Honda CRF450RL · 2023" */
  bikeLabel: string | undefined
  setBrand: (brand: BrandId) => void
  setModel: (modelId: string) => void
  setYear: (year: number) => void
  setVariant: (variantId: string) => void
  reset: () => void
  qty: number
  setQty: (qty: number) => void
  /** Adds the configured tower to the cart. Resolves false if not configured. */
  addToCart: () => Promise<boolean>
}

const TowerConfigContext = createContext<TowerConfigValue | null>(null)

const STORAGE_KEY = 'karoo-bike-selection-v1'

export function TowerConfigProvider({ children }: { children: ReactNode }) {
  const { addLine } = useCart()

  const [selection, setSelection] = useState<Selection>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Selection) : {}
    } catch {
      return {}
    }
  })
  const [qty, setQtyState] = useState(1)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    } catch {
      /* ignore */
    }
  }, [selection])

  const platform =
    selection.modelId && selection.year
      ? platformFor(selection.modelId, selection.year)
      : undefined

  const variants = platform ? variantsFor(platform) : []
  const variant =
    variants.find((v) => v.id === selection.variantId) ??
    (variants.length === 1 ? variants[0] : undefined)

  const variantSatisfied = !platform || !needsVariant(platform) || Boolean(variant)

  const isComplete = Boolean(
    selection.brand && selection.modelId && selection.year && platform && variantSatisfied,
  )

  // Everything picked, but the combination resolves to no platform — the
  // "2019 CRF450RL" case. Distinct from "not finished choosing yet".
  const isIncompatible = Boolean(
    selection.brand && selection.modelId && selection.year && !platform,
  )

  const bikeLabel = useMemo(() => {
    if (!selection.brand || !selection.modelId || !selection.year) return undefined
    const model = modelById(selection.modelId)
    if (!model) return undefined
    return `${brandById(selection.brand).name} ${model.name} · ${selection.year}`
  }, [selection])

  // Each level invalidates everything below it, so a stale year can never
  // survive a model change.
  const setBrand = useCallback((brand: BrandId) => {
    setSelection((prev) => (prev.brand === brand ? prev : { brand }))
  }, [])

  const setModel = useCallback((modelId: string) => {
    setSelection((prev) =>
      prev.modelId === modelId ? prev : { brand: prev.brand, modelId },
    )
  }, [])

  const setYear = useCallback((year: number) => {
    setSelection((prev) => ({ ...prev, year, variantId: undefined }))
  }, [])

  const setVariant = useCallback((variantId: string) => {
    setSelection((prev) => ({ ...prev, variantId }))
  }, [])

  const reset = useCallback(() => setSelection({}), [])

  const setQty = useCallback((next: number) => {
    setQtyState(Math.min(RALLY_TOWER.maxQty, Math.max(1, next)))
  }, [])

  const addToCart = useCallback(async (): Promise<boolean> => {
    if (!isComplete || !bikeLabel || !platform) return false

    const properties: Record<string, string> = {
      Motorcycle: bikeLabel,
      'Mounting kit': platform.kit,
    }
    if (variant) properties.Configuration = variant.label

    // Propagated, not assumed: `addLine` turns a Shopify failure into `error`
    // state, and returning true regardless would flash "added to your cart"
    // over a line that never made it.
    return addLine({
      slug: RALLY_TOWER.slug,
      name: RALLY_TOWER.fullName,
      sku: `${RALLY_TOWER.sku}-${platform.kit.split('-').pop()}`,
      price: RALLY_TOWER.price,
      currency: RALLY_TOWER.currency,
      qty,
      maxQty: RALLY_TOWER.maxQty,
      href: '/product',
      properties,
      merchandiseId: shopify.variantForRallyTower,
    })
  }, [isComplete, bikeLabel, platform, variant, qty, addLine])

  const value = useMemo<TowerConfigValue>(
    () => ({
      selection,
      platform,
      variants,
      variant,
      isComplete,
      isIncompatible,
      bikeLabel,
      setBrand,
      setModel,
      setYear,
      setVariant,
      reset,
      qty,
      setQty,
      addToCart,
    }),
    [
      selection,
      platform,
      variants,
      variant,
      isComplete,
      isIncompatible,
      bikeLabel,
      setBrand,
      setModel,
      setYear,
      setVariant,
      reset,
      qty,
      setQty,
      addToCart,
    ],
  )

  return (
    <TowerConfigContext.Provider value={value}>
      {children}
    </TowerConfigContext.Provider>
  )
}

export function useTowerConfig(): TowerConfigValue {
  const ctx = useContext(TowerConfigContext)
  if (!ctx)
    throw new Error('useTowerConfig must be used within TowerConfigProvider')
  return ctx
}
