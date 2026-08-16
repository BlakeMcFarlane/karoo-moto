import type { Product, CategoryId } from './types'

// Fitment shorthands reused across products.
const KTM500 = { make: 'KTM', model: '500 EXC-F / XCF-W', years: '2017–2024' }
const HQV501 = { make: 'Husqvarna', model: 'FE 501', years: '2017–2024' }
const GG500 = { make: 'GasGas', model: 'ES 500', years: '2021–2024' }
const KTM690 = { make: 'KTM', model: '690 Enduro R', years: '2019–2024' }
const HQV701 = { make: 'Husqvarna', model: '701 Enduro', years: '2019–2024' }

// ---------------------------------------------------------------------------
// Placeholder catalog. Prices, SKUs, weights and fitment are representative
// and must be verified against the manufacturer's data before publishing.
// ---------------------------------------------------------------------------

export const PRODUCTS: Product[] = [
  {
    slug: 'karoo-rally-tower-pro',
    name: 'Karoo Rally Tower Pro',
    sku: 'KM-RT-500-PRO',
    category: 'rally-towers',
    tagline: 'The flagship navigation tower for lightweight rally builds.',
    description:
      'A rigid, purpose-built cockpit that keeps navigation, communication and controls exactly where you need them. Laser-cut, folded and welded in South Africa, then powder-coated for the long haul. Integrated mounting points for roadbook, GPS, switch panels and auxiliary lighting mean one clean tower does the work of a shelf full of brackets.',
    price: 749,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500],
    finishes: ['Satin Black', 'Raw Brushed', 'Bronze Anodised'],
    material: '3CR12 stainless, laser-cut & TIG-welded',
    weight: '2.4 kg (5.3 lb)',
    dimensions: '310 × 240 × 180 mm',
    includes: [
      'Rally tower main structure',
      'Stainless mounting hardware kit',
      'Anti-vibration bushings',
      'Roadbook & GPS mounting plate',
      'Fitment & torque guide',
    ],
    install: {
      difficulty: 'Intermediate',
      time: '60–90 min',
      tools: ['T-handle hex set', 'Torque wrench', '10/13 mm sockets'],
    },
    warranty: '3-year structural warranty',
    featured: true,
    bestSeller: true,
    art: 'tower',
    related: ['karoo-dash', 'karoo-skid-plate-hd', 'karoo-tower-light-bar'],
  },
  {
    slug: 'karoo-dash',
    name: 'Karoo Dash',
    sku: 'KM-NAV-DASH',
    category: 'navigation',
    tagline:
      'Designed for riders who demand factory-quality navigation solutions.',
    description:
      'A billet-framed navigation dash that carries roadbook, GPS and a phone or rally computer on one vibration-isolated platform. Machined mounting slots let you set your own layout, and integrated cable channels keep the wiring clean and serviceable. Built to read like it came from the factory floor — because ours did.',
    price: 519,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black', 'Bronze Anodised'],
    material: '6082-T6 billet aluminium frame',
    weight: '1.1 kg (2.4 lb)',
    dimensions: '220 × 160 × 70 mm',
    includes: [
      'Karoo Dash billet frame',
      'Vibration-isolation mounts',
      'Universal device rails',
      'Cable-routing clips',
      'Fitment guide',
    ],
    install: {
      difficulty: 'Bolt-on',
      time: '30–45 min',
      tools: ['Hex set', 'Torque wrench'],
    },
    warranty: '3-year warranty',
    featured: true,
    bestSeller: true,
    art: 'dash',
    related: [
      'karoo-rally-tower-pro',
      'karoo-switch-panel',
      'karoo-tower-light-bar',
    ],
  },
  {
    slug: 'karoo-skid-plate-hd',
    name: 'Karoo HD Skid Plate',
    sku: 'KM-PRO-SKID-HD',
    category: 'protection',
    tagline: 'Takes the hit so your cases and water pump do not.',
    description:
      'A 4 mm formed aluminium skid plate with linkage protection and integrated drainage. Rubber-isolated mounting keeps engine noise down and prevents cracking on hard landings. Cut for service access so oil changes do not mean pulling the plate.',
    price: 289,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500],
    finishes: ['Raw', 'Satin Black'],
    material: '4 mm 5052 aluminium',
    weight: '1.8 kg (4.0 lb)',
    dimensions: '430 × 300 × 120 mm',
    includes: ['Skid plate', 'Isolation-mount kit', 'Stainless hardware'],
    install: {
      difficulty: 'Bolt-on',
      time: '30 min',
      tools: ['Hex set', 'Torque wrench'],
    },
    warranty: '2-year warranty',
    featured: true,
    art: 'skidplate',
    related: ['karoo-rally-tower-pro', 'karoo-radiator-guards', 'karoo-bash-plate'],
  },
  {
    slug: 'karoo-tower-light-bar',
    name: 'Tower LED Light Bar',
    sku: 'KM-LGT-BAR-40',
    category: 'lighting',
    tagline: 'Tower-mounted auxiliary light for long, dark transits.',
    description:
      'A compact dual-row LED bar that bolts directly to the Karoo Rally Tower or any 22 mm bar. Deutsch-connectorised harness with an inline relay and handlebar switch included. Aimed spill-and-spot optics throw a usable pool of light without blinding oncoming traffic.',
    price: 199,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black'],
    material: 'Die-cast aluminium housing, hardened lens',
    weight: '0.6 kg (1.3 lb)',
    dimensions: '210 × 55 × 60 mm',
    includes: [
      'LED light bar',
      'Deutsch-connectorised harness',
      'Inline relay & fuse',
      'Handlebar switch',
      'Mounting hardware',
    ],
    install: {
      difficulty: 'Intermediate',
      time: '45–60 min',
      tools: ['Hex set', 'Test light', 'Zip ties'],
    },
    warranty: '2-year warranty',
    art: 'light',
    related: ['karoo-rally-tower-pro', 'karoo-dash', 'karoo-switch-panel'],
  },
  {
    slug: 'karoo-rear-rack',
    name: 'Adventure Rear Rack',
    sku: 'KM-LUG-RACK-R',
    category: 'luggage',
    tagline: 'Billet-mounted load platform for real touring weight.',
    description:
      'A tubular rear rack with a machined billet mounting interface that spreads load into the subframe instead of hanging off the fender. Flat top plate accepts a top case or soft dry bag, with tie-down points positioned for a stable pack.',
    price: 259,
    currency: 'USD',
    stockStatus: 'made-to-order',
    leadTime: 'Made to order — 2–3 weeks',
    fitment: [KTM690, HQV701],
    finishes: ['Satin Black', 'Raw Brushed'],
    material: 'CrMo tube with 6082 billet mounts',
    weight: '1.5 kg (3.3 lb)',
    dimensions: '360 × 300 × 90 mm',
    includes: ['Rear rack', 'Billet subframe mounts', 'Stainless hardware'],
    install: {
      difficulty: 'Intermediate',
      time: '45 min',
      tools: ['Hex set', 'Torque wrench', 'Thread locker'],
    },
    warranty: '3-year structural warranty',
    art: 'rack',
    related: ['karoo-side-carriers', 'karoo-rally-tower-pro', 'karoo-skid-plate-hd'],
  },
  {
    slug: 'karoo-switch-panel',
    name: 'Billet Switch Panel',
    sku: 'KM-CKP-SW-4',
    category: 'cockpit',
    tagline: 'Four-circuit control at your left thumb.',
    description:
      'A machined four-switch panel that clamps to the bar or tower and gives you labelled, waterproof control of lighting, heated grips, aux power and comms. Pre-wired pigtails and a fused distribution block make the install tidy and repeatable.',
    price: 149,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black', 'Bronze Anodised'],
    material: '6082-T6 billet aluminium',
    weight: '0.3 kg (0.7 lb)',
    dimensions: '95 × 45 × 30 mm',
    includes: [
      'Switch panel',
      'Fused distribution block',
      'Pre-wired pigtails',
      'Bar & tower clamps',
    ],
    install: {
      difficulty: 'Intermediate',
      time: '45 min',
      tools: ['Hex set', 'Crimp tool', 'Test light'],
    },
    warranty: '2-year warranty',
    art: 'mount',
    related: ['karoo-dash', 'karoo-tower-light-bar', 'karoo-bar-risers'],
  },
  {
    slug: 'karoo-radiator-guards',
    name: 'Radiator Guards',
    sku: 'KM-PRO-RAD',
    category: 'protection',
    tagline: 'Louvred billet guards that keep cores intact.',
    description:
      'CNC-machined radiator guards with a louvred face that shields the cores from roost and branches while preserving airflow. A must for rocky single-track and bushveld two-track alike.',
    price: 179,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500],
    finishes: ['Satin Black', 'Raw Brushed'],
    material: '6082-T6 billet aluminium',
    weight: '0.5 kg (1.1 lb)',
    dimensions: 'Model-specific',
    includes: ['Left & right guards', 'Stainless hardware', 'Fitment guide'],
    install: {
      difficulty: 'Bolt-on',
      time: '30 min',
      tools: ['Hex set'],
    },
    warranty: '2-year warranty',
    art: 'billet',
    related: ['karoo-skid-plate-hd', 'karoo-bash-plate', 'karoo-rally-tower-pro'],
  },
  {
    slug: 'karoo-bash-plate',
    name: 'Front Bash Plate',
    sku: 'KM-PRO-BASH',
    category: 'protection',
    tagline: 'Front-end armour for the big singles.',
    description:
      'An extended front bash plate for the 690/701 platform that protects the header and lower frame rails on ledges and rock gardens, with quick-drain cutouts and service access retained.',
    price: 229,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM690, HQV701],
    finishes: ['Raw', 'Satin Black'],
    material: '4 mm 5052 aluminium',
    weight: '1.6 kg (3.5 lb)',
    dimensions: '410 × 290 × 130 mm',
    includes: ['Bash plate', 'Isolation mounts', 'Stainless hardware'],
    install: {
      difficulty: 'Bolt-on',
      time: '30 min',
      tools: ['Hex set', 'Torque wrench'],
    },
    warranty: '2-year warranty',
    art: 'skidplate',
    related: ['karoo-skid-plate-hd', 'karoo-radiator-guards', 'karoo-rear-rack'],
  },
  {
    slug: 'karoo-side-carriers',
    name: 'Side Carrier Set',
    sku: 'KM-LUG-SIDE',
    category: 'luggage',
    tagline: 'Symmetrical soft-luggage carriers that stay put.',
    description:
      'A pair of tucked-in side carriers designed for soft panniers, keeping the load narrow and close to the bike. Laser-cut mounts index off the subframe and rear pegs for a rattle-free fit.',
    price: 319,
    currency: 'USD',
    stockStatus: 'made-to-order',
    leadTime: 'Made to order — 2–3 weeks',
    fitment: [KTM690, HQV701],
    finishes: ['Satin Black'],
    material: '3CR12 stainless',
    weight: '2.1 kg (4.6 lb)',
    dimensions: 'Model-specific',
    includes: ['Left & right carriers', 'Mounting kit', 'Fitment guide'],
    install: {
      difficulty: 'Intermediate',
      time: '60 min',
      tools: ['Hex set', 'Torque wrench'],
    },
    warranty: '3-year structural warranty',
    art: 'rack',
    related: ['karoo-rear-rack', 'karoo-rally-tower-pro', 'karoo-bash-plate'],
  },
  {
    slug: 'karoo-bar-risers',
    name: 'Billet Bar Risers',
    sku: 'KM-CKP-RISE',
    category: 'cockpit',
    tagline: 'Stand-up ergonomics in 20 or 30 mm.',
    description:
      'Machined bar risers that lift and pull the bars back for a natural standing position, with a clean clamp face and captive hardware. Available for 22 mm and 28.6 mm bars.',
    price: 119,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black', 'Bronze Anodised', 'Raw Brushed'],
    material: '6082-T6 billet aluminium',
    weight: '0.4 kg (0.9 lb)',
    dimensions: '20 mm or 30 mm rise',
    includes: ['Riser pair', 'Stainless bolts', 'Fitment guide'],
    install: {
      difficulty: 'Bolt-on',
      time: '20 min',
      tools: ['Hex set', 'Torque wrench'],
    },
    warranty: '2-year warranty',
    art: 'billet',
    related: ['karoo-switch-panel', 'karoo-dash', 'karoo-rally-tower-pro'],
  },
  {
    slug: 'karoo-gps-mount',
    name: 'GPS Quick Mount',
    sku: 'KM-NAV-GPS-Q',
    category: 'navigation',
    tagline: 'Tool-free device mount with a locking cradle.',
    description:
      'An anti-vibration GPS mount with a quarter-turn locking interface that drops onto the Karoo Dash or any 22–28 mm bar. Sprung retention keeps units seated over corrugations.',
    price: 89,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black'],
    material: 'Billet aluminium & glass-filled nylon',
    weight: '0.2 kg (0.4 lb)',
    dimensions: '80 × 60 × 55 mm',
    includes: ['GPS mount', 'Bar & dash adapters', 'Hardware'],
    install: {
      difficulty: 'Bolt-on',
      time: '15 min',
      tools: ['Hex set'],
    },
    warranty: '2-year warranty',
    art: 'mount',
    related: ['karoo-dash', 'karoo-rally-tower-pro', 'karoo-switch-panel'],
  },
  {
    slug: 'karoo-radio-mount',
    name: 'Radio & Comms Mount',
    sku: 'KM-NAV-RADIO',
    category: 'navigation',
    tagline: 'Secure mounting for two-way radio and rally comms.',
    description:
      'A billet cradle and bracket set that mounts a handheld or fixed two-way radio to the tower within easy reach, with strain-relief for the antenna and mic leads. Built for group rides and remote travel where comms are not optional.',
    price: 129,
    currency: 'USD',
    stockStatus: 'in-stock',
    leadTime: 'Ships in 2–3 business days',
    fitment: [KTM500, HQV501, GG500, KTM690, HQV701],
    finishes: ['Satin Black', 'Bronze Anodised'],
    material: '6082-T6 billet aluminium',
    weight: '0.3 kg (0.7 lb)',
    dimensions: '110 × 70 × 60 mm',
    includes: ['Radio cradle', 'Tower bracket', 'Strain-relief clips', 'Hardware'],
    install: {
      difficulty: 'Bolt-on',
      time: '25 min',
      tools: ['Hex set'],
    },
    warranty: '2-year warranty',
    art: 'mount',
    related: ['karoo-rally-tower-pro', 'karoo-dash', 'karoo-switch-panel'],
  },
]

// --- selectors --------------------------------------------------------------

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug)

export const productsByCategory = (cat: CategoryId): Product[] =>
  PRODUCTS.filter((p) => p.category === cat)

export const featuredProducts = (): Product[] =>
  PRODUCTS.filter((p) => p.featured)

export const relatedProducts = (p: Product): Product[] =>
  p.related.map(productBySlug).filter((x): x is Product => Boolean(x))

/** Products that fit a given make/model (year-agnostic for the demo). */
export const productsForBike = (make: string, model: string): Product[] =>
  PRODUCTS.filter((p) =>
    p.fitment.some((f) => f.make === make && f.model === model),
  )

export const formatPrice = (value: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
