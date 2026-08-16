import type { CategoryId } from './types'

export interface Category {
  id: CategoryId
  name: string
  short: string
  blurb: string
  art: 'tower' | 'dash' | 'skidplate' | 'rack' | 'light' | 'billet' | 'mount'
}

// Ordered for the homepage "Featured Categories" grid.
export const CATEGORIES: Category[] = [
  {
    id: 'rally-towers',
    name: 'Rally Towers',
    short: 'Rally Towers',
    blurb:
      'Purpose-built cockpit towers that hold navigation, controls and comms exactly where you need them.',
    art: 'tower',
  },
  {
    id: 'navigation',
    name: 'Navigation Systems',
    short: 'Navigation',
    blurb:
      'Roadbook-ready dashes, GPS mounts and power distribution for confident routing off the grid.',
    art: 'dash',
  },
  {
    id: 'protection',
    name: 'Protection',
    short: 'Protection',
    blurb:
      'CNC skid plates, bash guards and radiator protection that take the hit so your engine does not.',
    art: 'skidplate',
  },
  {
    id: 'lighting',
    name: 'Lighting',
    short: 'Lighting',
    blurb:
      'Auxiliary LED pods and tower-mounted light bars wired for long, dark transits home.',
    art: 'light',
  },
  {
    id: 'luggage',
    name: 'Luggage',
    short: 'Luggage',
    blurb:
      'Billet-mounted rear racks and side carriers engineered for real load, real corrugations.',
    art: 'rack',
  },
  {
    id: 'cockpit',
    name: 'Cockpit Accessories',
    short: 'Cockpit',
    blurb:
      'Bar risers, phone mounts, switch panels and the small billet parts that finish a build.',
    art: 'mount',
  },
  {
    id: 'billet',
    name: 'Billet Components',
    short: 'Billet',
    blurb:
      'Machined levers, caps, guards and hardware — the details that read factory-quality up close.',
    art: 'billet',
  },
]

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>
