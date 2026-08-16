// ---------------------------------------------------------------------------
// Karoo Moto — shared data model
// Reusable product fields per the brand guide's e-commerce data model.
// Replace placeholder values with real catalog data before launch.
// ---------------------------------------------------------------------------

export type CategoryId =
  | 'rally-towers'
  | 'navigation'
  | 'protection'
  | 'lighting'
  | 'luggage'
  | 'cockpit'
  | 'billet'

export type ArtKind =
  | 'tower'
  | 'dash'
  | 'skidplate'
  | 'rack'
  | 'light'
  | 'billet'
  | 'mount'

export interface Fitment {
  make: string
  model: string
  years: string // e.g. "2020–2024"
}

export interface Product {
  slug: string
  name: string
  sku: string
  category: CategoryId
  /** Short one-line positioning statement. */
  tagline: string
  /** Longer marketing description (confident, specific, rider-focused). */
  description: string
  price: number
  salePrice?: number
  currency: 'USD'
  stockStatus: 'in-stock' | 'made-to-order' | 'low-stock' | 'backorder'
  leadTime: string
  /** Which bikes this fits. */
  fitment: Fitment[]
  finishes: string[]
  material: string
  weight: string
  dimensions: string
  includes: string[]
  install: {
    difficulty: 'Bolt-on' | 'Intermediate' | 'Advanced'
    time: string
    tools: string[]
  }
  warranty: string
  featured?: boolean
  bestSeller?: boolean
  /** Which illustration to render for the placeholder gallery. */
  art: ArtKind
  related: string[] // slugs
}
