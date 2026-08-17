// ---------------------------------------------------------------------------
// KarooMoto Rally Tower — single source of truth for the flagship product page.
//
// Everything the Rally Tower page renders (copy, features, fitment, trust,
// legal) lives here so the page composition stays presentational and the
// content can be swapped for a CMS / Shopify metafield payload later.
//
// Fitment is modelled as Brand → Model → Year → Platform. A "platform" is a
// concrete generation of a motorcycle with its own mounting hardware, so
// model-specific brackets, looms and configuration options can be attached to
// a platform later without touching the selector UI.
// ---------------------------------------------------------------------------

export type BrandId = 'ktm' | 'husqvarna' | 'suzuki' | 'honda'

/** A future model-specific add-on (bracket, loom, OEM connector kit, …). */
export interface PlatformOption {
  id: string
  label: string
  /** Price delta in USD. 0 = included. */
  priceDelta: number
  /** `false` keeps it visible but non-selectable ("coming soon"). */
  available: boolean
  note?: string
}

/** One concrete generation of one model — the unit the tower is built for. */
export interface Platform {
  id: string
  /** Human label for the generation, e.g. "2017–2023". */
  generation: string
  years: number[]
  /**
   * Which part of the front end the model-specific kit clamps to.
   * NOTE: these per-platform values are provisional and are deliberately NOT
   * surfaced as a product claim in the UI — verify against production tooling
   * before displaying them. The page states the general triple-clamp / fork-tube
   * principle instead.
   */
  mount: 'Triple clamp' | 'Fork tube'
  /** SKU suffix for the model-specific mounting kit. */
  kit: string
  /** Reserved: model-specific hardware/config offered per platform. */
  options: PlatformOption[]
  note?: string
}

export interface BikeModel {
  id: string
  brand: BrandId
  /** Model name without the brand, e.g. "450 EXC-F". */
  name: string
  platforms: Platform[]
}

export interface Brand {
  id: BrandId
  name: string
  /** Short line shown under the brand tile in the selector. */
  blurb: string
}

// --- Brands -----------------------------------------------------------------

export const BRANDS: Brand[] = [
  { id: 'ktm', name: 'KTM', blurb: 'EXC-F enduro platform' },
  { id: 'husqvarna', name: 'Husqvarna', blurb: 'FE enduro platform' },
  { id: 'suzuki', name: 'Suzuki', blurb: 'DR-Z dual-sport platform' },
  { id: 'honda', name: 'Honda', blurb: 'CRF dual-sport platform' },
]

const years = (from: number, to: number): number[] => {
  const out: number[] = []
  for (let y = to; y >= from; y--) out.push(y)
  return out
}

/** Placeholder for the OEM connector kits currently in development. */
const oemKit = (label: string): PlatformOption[] => [
  {
    id: 'oem-connector',
    label,
    priceDelta: 0,
    available: false,
    note: 'In development — offered separately as it becomes available.',
  },
]

// --- Models -----------------------------------------------------------------

export const MODELS: BikeModel[] = [
  {
    id: 'ktm-450-excf',
    brand: 'ktm',
    name: '450 EXC-F',
    platforms: [
      {
        id: 'ktm-450-excf-2017',
        generation: '2017–2023',
        years: years(2017, 2023),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-KTM17',
        options: oemKit('KTM 2017–2023 OEM connector kit'),
      },
      {
        id: 'ktm-450-excf-2024',
        generation: '2024–2026',
        years: years(2024, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-KTM24',
        options: oemKit('KTM 2024–2026 OEM connector kit'),
      },
    ],
  },
  {
    id: 'ktm-500-excf',
    brand: 'ktm',
    name: '500 EXC-F / EXC-W',
    platforms: [
      {
        id: 'ktm-500-excf-2017',
        generation: '2017–2023',
        years: years(2017, 2023),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-KTM17',
        options: oemKit('KTM 2017–2023 OEM connector kit'),
      },
    ],
  },
  {
    id: 'ktm-500-excf-xwf',
    brand: 'ktm',
    name: '500 EXC-F / XW-F',
    platforms: [
      {
        id: 'ktm-500-excf-xwf-2024',
        generation: '2024–2026',
        years: years(2024, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-KTM24',
        options: oemKit('KTM 2024–2026 OEM connector kit'),
      },
    ],
  },
  {
    id: 'husqvarna-fe-450',
    brand: 'husqvarna',
    name: 'FE 450',
    platforms: [
      {
        id: 'husqvarna-fe-450-2017',
        generation: '2017–2023',
        years: years(2017, 2023),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-HQV17',
        options: oemKit('Husqvarna 2017–2023 OEM connector kit'),
      },
      {
        id: 'husqvarna-fe-450-2024',
        generation: '2024–2026',
        years: years(2024, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-HQV24',
        options: oemKit('Husqvarna 2024–2026 OEM connector kit'),
      },
    ],
  },
  {
    id: 'husqvarna-fe-501',
    brand: 'husqvarna',
    name: 'FE 501',
    platforms: [
      {
        id: 'husqvarna-fe-501-2017',
        generation: '2017–2023',
        years: years(2017, 2023),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-HQV17',
        options: oemKit('Husqvarna 2017–2023 OEM connector kit'),
      },
      {
        id: 'husqvarna-fe-501-2024',
        generation: '2024–2026',
        years: years(2024, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-HQV24',
        options: oemKit('Husqvarna 2024–2026 OEM connector kit'),
      },
    ],
  },
  {
    id: 'suzuki-drz400s',
    brand: 'suzuki',
    name: 'DR-Z400S',
    platforms: [
      {
        id: 'suzuki-drz400s',
        generation: '2000–2024',
        years: years(2000, 2024),
        mount: 'Fork tube',
        kit: 'KM-RT-MK-DRZ400',
        options: oemKit('Suzuki DR-Z400 OEM connector kit'),
      },
    ],
  },
  {
    id: 'suzuki-drz400sm',
    brand: 'suzuki',
    name: 'DR-Z400SM',
    platforms: [
      {
        id: 'suzuki-drz400sm',
        generation: '2005–2024',
        years: years(2005, 2024),
        mount: 'Fork tube',
        kit: 'KM-RT-MK-DRZ400',
        options: oemKit('Suzuki DR-Z400 OEM connector kit'),
      },
    ],
  },
  {
    id: 'suzuki-drz4s',
    brand: 'suzuki',
    name: 'DR-Z4S',
    platforms: [
      {
        id: 'suzuki-drz4s',
        generation: '2025–2026 · New generation',
        years: years(2025, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-DRZ4',
        options: oemKit('Suzuki DR-Z4 OEM connector kit'),
      },
    ],
  },
  {
    id: 'suzuki-drz4sm',
    brand: 'suzuki',
    name: 'DR-Z4SM',
    platforms: [
      {
        id: 'suzuki-drz4sm',
        generation: '2025–2026 · New generation',
        years: years(2025, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-DRZ4',
        options: oemKit('Suzuki DR-Z4 OEM connector kit'),
      },
    ],
  },
{
    id: 'honda-crf450l',
    brand: 'honda',
    name: 'CRF450L',
    platforms: [
      {
        id: 'honda-crf450l-2019',
        generation: '2019–2020',
        years: years(2019, 2020),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-CRF450L',
        options: oemKit('Honda CRF450L OEM connector kit'),
      },
    ],
  },
  {
    id: 'honda-crf450rl',
    brand: 'honda',
    name: 'CRF450RL',
    platforms: [
      {
        id: 'honda-crf450rl-2021',
        generation: '2021–2026',
        years: years(2021, 2026),
        mount: 'Triple clamp',
        kit: 'KM-RT-MK-CRF450RL',
        options: oemKit('Honda CRF450RL OEM connector kit'),
      },
    ],
  },
]

// --- Fitment selectors ------------------------------------------------------

export const modelsForBrand = (brand: BrandId): BikeModel[] =>
  MODELS.filter((m) => m.brand === brand)

export const brandById = (id: BrandId): Brand =>
  BRANDS.find((b) => b.id === id) as Brand

export const modelById = (id: string): BikeModel | undefined =>
  MODELS.find((m) => m.id === id)

/** All selectable years for a model, newest first, de-duplicated. */
export const yearsForModel = (modelId: string): number[] => {
  const model = modelById(modelId)
  if (!model) return []
  const set = new Set<number>()
  model.platforms.forEach((p) => p.years.forEach((y) => set.add(y)))
  return Array.from(set).sort((a, b) => b - a)
}

/** Resolve a Brand → Model → Year selection to the platform that fits it. */
export const platformFor = (
  modelId: string,
  year: number,
): Platform | undefined =>
  modelById(modelId)?.platforms.find((p) => p.years.includes(year))

export interface FitmentSelection {
  brand: BrandId
  modelId: string
  year: number
  platform: Platform
}

/**
 * Selectable variants for a resolved platform.
 *
 * Most platforms have exactly one configuration, in which case the selector
 * skips the step entirely. A platform that later needs a trim, a bar-clamp
 * size or a loom option just declares them here and the fourth dropdown
 * appears on its own — no selector logic changes.
 */
export const variantsFor = (platform: Platform): PlatformOption[] =>
  platform.options.filter((o) => o.available)

export const needsVariant = (platform: Platform): boolean =>
  variantsFor(platform).length > 1

/** Options shown but not selectable — the OEM connector kits in development. */
export const pendingOptions = (platform: Platform): PlatformOption[] =>
  platform.options.filter((o) => !o.available)

/**
 * Is this exact combination buildable?
 *
 * The dropdowns filter downwards so an impossible pair should be unreachable,
 * but this is the guard the purchase path actually checks — a 2025 CRF450L or
 * a 2019 CRF450RL resolves to no platform and must never reach the cart.
 */
export const isCompatible = (modelId: string, year: number): boolean =>
  platformFor(modelId, year) !== undefined

/** The label written onto the cart line / order so KarooMoto knows the bike. */
export const fitmentLabel = (sel: FitmentSelection): string =>
  `${brandById(sel.brand).name} ${modelById(sel.modelId)?.name ?? ''} · ${sel.year}`

/** Compact year-range summary per model, e.g. "2017–2026". */
export const yearRangeLabel = (model: BikeModel): string => {
  const all = model.platforms.flatMap((p) => p.years)
  return `${Math.min(...all)}–${Math.max(...all)}`
}

// --- Product ----------------------------------------------------------------

export const RALLY_TOWER = {
  slug: 'karoo-rally-tower',
  name: 'Rally Tower',
  fullName: 'KarooMoto Rally Tower',
  sku: 'KM-RT-01',
  /** USD. Carried over from the existing catalog entry — update in one place. */
  price: 749,
  currency: 'USD' as const,
  tagline: 'Built for riders who demand durability without unnecessary weight.',
  intro:
    'The KarooMoto Rally Tower is engineered for demanding off-road, dual-sport, rally and adventure riding. Designed and tested in Africa, the tower combines rugged construction, integrated high-output lighting, navigation mounting, charging capability and a lightweight design into one complete package.',
  construction:
    'Constructed using CNC-routed engineering-grade plastics, an ultra-durable 4 mm polycarbonate screen and precision laser-cut metal components, every detail has been designed around strength, flexibility, functionality and long-term reliability.',
  weight: '1.7 kg',
  weightImperial: '3.75 lb',
  /** Maximum units of one configuration, per line and per add. */
  maxQty: 9,
  ctaLabel: 'Pre-order',
  availability: 'Pre-order · Built to order in South Africa',
}

// --- Section copy -----------------------------------------------------------
// Every heading, lede and paragraph on the page comes from here. Sections are
// presentational; nothing writes its own marketing copy.

export const HERO = {
  brandLine: 'KarooMoto',
  eyebrow: 'Rally Tower · Engineered in South Africa',
  title: ['Rally', 'Tower'],
  tagline: RALLY_TOWER.tagline,
  lede: 'Rugged construction, integrated high-output lighting, navigation mounting and charging capability — in one complete package that weighs 1.7 kg.',
  primaryCta: 'Pre-order',
  secondaryCta: 'Check your fitment',
  scrollCue: 'Scroll',
}

export const PROOF = {
  id: 'proof',
  eyebrow: 'Proven in Africa',
  title: 'Built to be used.',
  lede: 'This isn’t a tower designed only on a computer or tested around the block.',
  body: [
    'The KarooMoto Rally Tower has been tested across multiple countries in Africa and over thousands of miles of real-world riding — through rough terrain, dust, vibration, long-distance travel and demanding off-road conditions.',
  ],
  markers: [
    { value: 'Multiple', label: 'Countries ridden' },
    { value: 'Thousands', label: 'Of miles tested' },
    { value: 'Field', label: 'Not just CAD' },
  ],
  caption: 'KTM 500 EXC-F · Rally Tower fitted, dust light lit',
}

export const RIDER_FOCUSED = {
  id: 'design',
  eyebrow: 'Rider-focused design',
  title: 'The light goes where you steer.',
  body: [
    'Depending on the motorcycle model, the KarooMoto Rally Tower mounts to the triple clamps or fork tubes and turns with the handlebars.',
    'That means the lighting turns with the front end of the motorcycle, helping illuminate the direction you’re steering rather than remaining fixed straight ahead — a major advantage when navigating trails and technical terrain after dark.',
  ],
  /** Labels for the two beams in the steering diagram. */
  diagram: {
    turning: 'Tower-mounted — beam follows the steering',
    fixed: 'Frame-mounted — beam stays straight ahead',
    hint: 'Scroll to steer',
    staticHint: 'Bars turned right · beam follows',
  },
}

export const FEATURES_SECTION = {
  eyebrow: 'Features',
  title: 'One tower. The whole cockpit.',
  lede: 'Lighting, navigation, charging and control — designed together instead of bolted on one bracket at a time.',
  supportingTitle: 'Also built in',
  materialsTitle: 'Materials & hardware',
}

export const GALLERY = {
  eyebrow: 'The object',
  title: 'Machined, not moulded.',
  lede: 'Every surface, edge and fastener on the Rally Tower is there for a reason.',
  /* Order matters: the four studio shots (same light grey wall) run first as
     one set, then the two in-situ shots. Mixing them made the rail flick
     between two lighting conditions on every step. */
  shots: [
    {
      src: 'tower-studio-01',
      caption: 'Complete tower — screen, lighting, switches and mounting plate',
      alt: 'The KarooMoto Rally Tower photographed from three-quarter front, showing the polycarbonate screen, white riding light, yellow dust light pod and the waterproof switches set into the side of the tower body.',
    },
    {
      src: 'tower-detail-lights',
      caption: 'Quad-optic dust light behind the 4 mm screen',
      alt: 'Close-up of the yellow dust light’s four optics behind the polycarbonate screen, with the KarooMoto springbok mark etched into the tower body alongside it.',
    },
    {
      src: 'tower-detail-mount',
      caption: 'Laser-cut top plate and machined stainless hardware',
      alt: 'Close-up of the laser-cut navigation mounting plate on top of the tower, held by machined stainless steel bolts and washers.',
    },
    {
      src: 'tower-detail-plate',
      caption: 'Etched springbok mark and 8.8-grade stainless fasteners',
      alt: 'Extreme close-up of the tower’s engineering-grade plastic body showing the etched KarooMoto springbok mark and the stainless steel bolt heads.',
    },
    {
      src: 'tower-on-bike-night',
      caption: 'Fitted and lit — white riding light and yellow dust light',
      alt: 'The Rally Tower fitted to a KTM enduro in a workshop with both the white riding light and the yellow dust light switched on.',
    },
    {
      src: 'tower-on-bike-full',
      caption: 'Complete installation on a KTM EXC-F',
      alt: 'A KTM EXC-F enduro motorcycle on a stand with the KarooMoto Rally Tower fitted to the front end, the yellow dust light lit.',
    },
  ],
} as const

export const FITMENT_SECTION = {
  id: 'fitment',
  eyebrow: 'Motorcycle compatibility',
  title: 'Find your bike.',
  lede: 'The Rally Tower ships with a model-specific mounting system. Tell us what you ride and we build it to fit.',
  /* "Manufacturer" throughout — the step rail said Brand while the field said
     Manufacturer, which is the same control named two ways on one screen. */
  steps: [
    { n: '01', label: 'Manufacturer' },
    { n: '02', label: 'Model' },
    { n: '03', label: 'Year' },
  ],
  prompts: {
    brand: 'Choose a manufacturer',
    model: 'Choose a model',
    year: 'Choose a year',
    modelLocked: 'Choose a manufacturer first',
    yearLocked: 'Choose a model first',
  },
  result: {
    fits: 'Direct fit confirmed',
    fitsBody:
      'Your Rally Tower will be supplied with the mounting kit for this motorcycle.',
    kitLabel: 'Mounting kit',
    changeLabel: 'Change motorcycle',
    addLabel: 'Add to pre-order',
  },
  missing: {
    title: 'Not seeing your motorcycle?',
    body: 'New platforms are added as tooling is completed. Tell us what you ride and we will let you know when it is supported.',
    /**
     * TODO: point this at a real destination before launch — a contact route,
     * a mailto:, or a Shopify form. It is deliberately absent rather than
     * aimed at `/contact`, which no longer exists and would 404. The selector
     * renders the body copy without a link while `to` is undefined.
     */
    cta: 'Request a platform',
    to: undefined as string | undefined,
  },
  prompt: 'Select your motorcycle to continue',
}

export const PREORDER = {
  id: 'preorder',
  eyebrow: 'Pre-order',
  title: 'Built to order, for your motorcycle.',
  lede: 'Every tower is assembled in South Africa with the mounting hardware for the bike you selected.',
  qtyLabel: 'Quantity',
  selectPrompt: 'Select your motorcycle',
  /* Compact form for the purchase bar on a phone, where the full string
     truncates mid-word. */
  selectPromptShort: 'Select your bike',
  selectedLabel: 'Building for',
  changeLabel: 'Change',
  inTheBoxTitle: 'In the box',
  inTheBox: [
    'Rally Tower assembly with 4 mm polycarbonate screen',
    'Integrated white riding light & yellow dust light',
    'Complete lighting wiring loom',
    'Waterproof tower-mounted lighting switches',
    '2× USB charging points & integrated voltage indicator',
    'Fuse box relocation kit & battery charging point',
    'Phone / GPS mounting brackets',
    'Model-specific mounting system',
    '8.8-grade stainless-steel bolts & washers',
    'Installation guidance',
  ],
  assurances: [
    { icon: 'shield' as const, label: '45-Day Satisfaction Guarantee' },
    { icon: 'check' as const, label: '12-Month Limited Warranty' },
    { icon: 'weight' as const, label: '1.7 kg complete · 3.75 lb' },
  ],
}

/** Section links used by the page navigation and its scroll-spy. */
export const NAV_SECTIONS = [
  { id: 'proof', label: 'Proven' },
  { id: 'design', label: 'Design' },
  { id: 'wiring', label: 'Wiring' },
  { id: 'warranty', label: 'Warranty' },
] as const

/** Headline stats used in the hero rail and the closing spec strip. */
export const KEY_STATS = [
  { value: '1.7', unit: 'kg', label: 'Complete tower weight' },
  { value: '4', unit: 'mm', label: 'Polycarbonate screen' },
  { value: '2×', unit: '', label: 'USB charging points' },
  { value: '9', unit: '', label: 'Supported platforms' },
] as const

// --- Features ---------------------------------------------------------------

export type FeatureIcon =
  | 'beam'
  | 'dust'
  | 'usb'
  | 'gps'
  | 'volt'
  | 'switch'
  | 'fuse'
  | 'loom'
  | 'mount'
  | 'screen'
  | 'cnc'
  | 'coat'
  | 'bolt'
  | 'weight'

export interface Feature {
  id: string
  title: string
  body: string
  icon: FeatureIcon
  /** 1 = hero feature (large card), 2 = supporting card, 3 = materials strip. */
  tier: 1 | 2 | 3
  /** Optional short technical read-out shown in mono. */
  spec?: string
}

export const FEATURES: Feature[] = [
  {
    id: 'lighting',
    title: 'Integrated white riding light & yellow dust light',
    body: 'High-output lighting built into the tower body — a white beam for open speed and a yellow dust light that cuts through the haze thrown up by the rider in front of you.',
    icon: 'beam',
    tier: 1,
    spec: 'White + yellow · tower-integrated',
  },
  {
    id: 'steering',
    title: 'Lighting that turns with the front end',
    body: 'Mounted to the triple clamps or fork tubes, the tower turns with the handlebars — so the beam follows the line you are steering instead of staring straight ahead.',
    icon: 'mount',
    tier: 1,
    spec: 'Triple clamp / fork-tube mount',
  },
  {
    id: 'screen',
    title: '4 mm polycarbonate screen',
    body: 'An ultra-durable screen that flexes instead of shattering, shaped to push wind and roost over the cockpit without adding bulk.',
    icon: 'screen',
    tier: 1,
    spec: '4 mm polycarbonate',
  },
  {
    id: 'weight',
    title: 'Just 1.7 kg (3.75 lb)',
    body: 'A complete lighting, navigation and charging cockpit that adds less weight to the front end than most bare light bars.',
    icon: 'weight',
    tier: 1,
    spec: '1.7 kg / 3.75 lb',
  },
  {
    id: 'usb',
    title: '2× USB charging points',
    body: 'Keep a GPS, phone and tracker alive through long transit days.',
    icon: 'usb',
    tier: 2,
    spec: '2× USB',
  },
  {
    id: 'gps',
    title: 'Phone & GPS mounting brackets',
    body: 'Dedicated mounting positions built into the tower plate — no bar clutter, no aftermarket clamps.',
    icon: 'gps',
    tier: 2,
  },
  {
    id: 'volt',
    title: 'Integrated voltage indicator',
    body: 'Battery condition at a glance, in your line of sight.',
    icon: 'volt',
    tier: 2,
  },
  {
    id: 'switch',
    title: 'Waterproof tower-mounted switches',
    body: 'Sealed lighting switches set into the side of the tower, within reach with gloves on.',
    icon: 'switch',
    tier: 2,
  },
  {
    id: 'fuse',
    title: 'Fuse box relocation & battery charging point',
    body: 'Relocates the fuse box and adds a dedicated battery charging point for tenders and accessories.',
    icon: 'fuse',
    tier: 2,
  },
  {
    id: 'loom',
    title: 'Complete wiring loom',
    body: 'A full lighting loom, terminated and ready for a direct battery connection.',
    icon: 'loom',
    tier: 2,
  },
  {
    id: 'cnc',
    title: 'CNC-routed engineering-grade plastics',
    body: 'Machined, not moulded — impact-tolerant and repairable in the field.',
    icon: 'cnc',
    tier: 3,
  },
  {
    id: 'coat',
    title: 'Powder-coated aluminium & steel',
    body: 'Laser-cut metal components, powder-coated for corrosion resistance.',
    icon: 'coat',
    tier: 3,
  },
  {
    id: 'bolt',
    title: '8.8-grade stainless bolts & washers',
    body: 'Every fastener specified for vibration and long-term service.',
    icon: 'bolt',
    tier: 3,
  },
]

export const heroFeatures = (): Feature[] => FEATURES.filter((f) => f.tier === 1)
export const supportFeatures = (): Feature[] =>
  FEATURES.filter((f) => f.tier === 2)
export const materialFeatures = (): Feature[] =>
  FEATURES.filter((f) => f.tier === 3)

// --- Lighting & wiring ------------------------------------------------------

export const WIRING = {
  id: 'wiring',
  eyebrow: 'Lighting & wiring',
  title: 'Wired to be lived with.',
  lede: 'The tower is supplied with a complete lighting wiring loom designed for direct battery connection. Two ways to run it — pick the one that suits your bike.',
  paths: [
    {
      id: 'direct',
      badge: 'Supplied configuration',
      title: 'Direct to battery',
      body: 'Connect the supplied loom straight to the battery. White and yellow lighting is then controlled through the waterproof switches integrated into the side of the tower.',
      points: [
        'Complete loom included',
        'Tower-mounted waterproof switches',
        'No cutting into factory wiring',
      ],
      ready: true,
    },
    {
      id: 'oem',
      badge: 'Optional integration',
      title: 'Through the factory controls',
      body: 'Prefer to run the lighting from your existing handlebar switchgear? The system can be integrated into the factory lighting harness instead.',
      points: [
        'Runs from factory handlebar controls',
        'Currently requires splicing into the appropriate factory wiring',
        'Model-specific OEM connectors are not included',
      ],
      ready: false,
    },
  ],
  footnote:
    'Model-specific plug-and-play OEM connector kits are currently in development and will be offered separately as they become available.',
}

// --- Trust ------------------------------------------------------------------

export const TRUST = {
  id: 'warranty',
  eyebrow: 'Buy it. Install it. Ride it.',
  title: 'Ride it for 45 days before you decide.',
  lede: 'We would rather you fit the tower to your own motorcycle and ride it than judge it from photographs.',
  guarantee: {
    badge: '45 days',
    title: '45-Day Satisfaction Guarantee',
    body: 'Every KarooMoto Rally Tower includes a 45-Day Satisfaction Guarantee — install the tower, ride with it and experience it on your motorcycle. If you are not satisfied, contact KarooMoto within 45 days of delivery to arrange a return.',
    highlight:
      'Normal installation — including the wiring connections or splicing required to fit it — does not automatically make the product ineligible for return.',
    linkLabel: 'Read the Return & Refund Policy',
    linkTo: '/policies/returns',
  },
  warranty: {
    badge: '12 months',
    title: '12-Month Limited Warranty',
    body: 'Every tower is backed by a 12-Month Limited Warranty against defects in materials and workmanship, honoured directly by KarooMoto.',
    highlight:
      'Engineered, assembled and supported from South Africa — you deal with the people who built it.',
    linkLabel: 'Read the Limited Warranty',
    linkTo: '/policies/warranty',
  },
}

// --- Important information --------------------------------------------------

export const IMPORTANT_INFO = {
  title: 'Important information',
  body: [
    'The supplied high-output lighting is designed primarily for adventure, rally, competition and off-road applications and is not currently represented as DOT-certified.',
    'Requirements for on-road lighting vary by jurisdiction.',
    'Purchase, installation and use are subject to the KarooMoto Terms & Conditions, 45-Day Satisfaction Guarantee and 12-Month Limited Warranty.',
  ],
  links: [
    { label: 'Terms & Conditions', to: '/policies/terms' },
    { label: '45-Day Satisfaction Guarantee', to: '/policies/returns' },
    { label: '12-Month Limited Warranty', to: '/policies/warranty' },
  ],
}

// --- Closing ----------------------------------------------------------------

export const CLOSING = {
  lines: ['Strong where it matters.', 'Lightweight where it counts.'],
  emphasis: 'Built for Adventure.',
  signoff: 'KarooMoto — Engineered in South Africa.',
  coords: '25.3340° S · 27.8916° E',
}
