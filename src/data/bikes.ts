// ---------------------------------------------------------------------------
// Fitment finder data — the launch catalog focuses on a tight set of
// adventure / dual-sport platforms. Add makes, models and years here.
// ---------------------------------------------------------------------------

export interface BikeModel {
  make: string
  model: string
  /** Selectable model years, newest first. */
  years: number[]
  /** Short marketing label used on the homepage "Shop by Motorcycle" row. */
  label: string
  blurb: string
}

const range = (from: number, to: number): number[] => {
  const out: number[] = []
  for (let y = to; y >= from; y--) out.push(y)
  return out
}

export const BIKES: BikeModel[] = [
  {
    make: 'KTM',
    model: '500 EXC-F / XCF-W',
    years: range(2017, 2024),
    label: 'KTM 500 EXC-F / XCF-W',
    blurb: 'The benchmark lightweight rally platform. Our most complete fitment.',
  },
  {
    make: 'Husqvarna',
    model: 'FE 501',
    years: range(2017, 2024),
    label: 'Husqvarna FE 501',
    blurb: 'Shared architecture, its own cockpit geometry. Fully supported.',
  },
  {
    make: 'GasGas',
    model: 'ES 500',
    years: range(2021, 2024),
    label: 'GasGas ES 500',
    blurb: 'Rally-ready straight out of the crate. Towers in stock.',
  },
  {
    make: 'KTM',
    model: '690 Enduro R',
    years: range(2019, 2024),
    label: 'KTM 690',
    blurb: 'Big-single mile-eater. Reinforced towers for touring loads.',
  },
  {
    make: 'Husqvarna',
    model: '701 Enduro',
    years: range(2019, 2024),
    label: 'Husqvarna 701',
    blurb: 'Long-range dual-sport. Navigation and comms, sorted.',
  },
]

/** Distinct makes, in catalog order. */
export const MAKES: string[] = Array.from(new Set(BIKES.map((b) => b.make)))

export const modelsForMake = (make: string): string[] =>
  BIKES.filter((b) => b.make === make).map((b) => b.model)

export const yearsFor = (make: string, model: string): number[] => {
  const b = BIKES.find((x) => x.make === make && x.model === model)
  return b ? b.years : []
}
