import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { GALLERY } from '../../data/rallyTower'
import RallyIcon from './RallyIcon'
import studio01 from '../../assets/rally/tower-studio-01.jpeg'
import detailLights from '../../assets/rally/tower-detail-lights.jpeg'
import detailMount from '../../assets/rally/tower-detail-mount.jpeg'
import detailPlate from '../../assets/rally/tower-detail-plate.jpeg'
import onBikeNight from '../../assets/rally/tower-on-bike-night.jpeg'
import onBikeFull from '../../assets/rally/tower-on-bike-full.jpeg'

/** Basename → bundled asset URL, so the data module stays free of imports. */
const IMAGES: Record<string, string> = {
  'tower-studio-01': studio01,
  'tower-detail-lights': detailLights,
  'tower-detail-mount': detailMount,
  'tower-detail-plate': detailPlate,
  'tower-on-bike-night': onBikeNight,
  'tower-on-bike-full': onBikeFull,
}

/** Intrinsic pixel size of each source — written onto every <img> so the frame
    never reflows as a photograph arrives. */
const DIMS: Record<string, [number, number]> = {
  'tower-studio-01': [1080, 1430],
  'tower-detail-lights': [1080, 1350],
  'tower-detail-mount': [1080, 1324],
  'tower-detail-plate': [940, 1324],
  'tower-on-bike-night': [960, 1280],
  'tower-on-bike-full': [1200, 1600],
}

type Shot = (typeof GALLERY.shots)[number]

const SHOTS: readonly Shot[] = GALLERY.shots
const COUNT = SHOTS.length

const pad = (n: number): string => String(n).padStart(2, '0')

/** The rail is a vertical tablist beside the image on wide viewports and a
    horizontal filmstrip beneath it below that. Screen readers are told which,
    so ArrowUp/Down vs ArrowLeft/Right matches what the user is looking at —
    both are handled either way. */
const WIDE = '(min-width: 1000px)'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * The product gallery — one large frame and six thumbnails.
 *
 * Built as a tablist: the thumbnails are the tabs, the frame is the panel, and
 * selection follows focus (automatic activation) because switching photograph
 * costs nothing. The six photographs are all mounted and crossfaded on opacity
 * alone, so changing view never reflows the card around it.
 */
export default function ProductGallery() {
  const [index, setIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const vertical = useMediaQuery(WIDE)

  const select = useCallback((next: number, moveFocus: boolean) => {
    const i = (next + COUNT) % COUNT
    setIndex(i)
    if (moveFocus) tabRefs.current[i]?.focus()
  }, [])

  // Keep the chosen thumbnail on screen in both rail orientations. Skipped on
  // mount — scrolling the page to the gallery before the customer has touched
  // anything would hijack the landing.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    tabRefs.current[index]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [index])

  const onRailKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = index + 1
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        next = index - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = COUNT - 1
        break
      default:
        return
    }
    e.preventDefault()
    select(next, true)
  }

  const active = SHOTS[index]
  const tabId = (i: number) => `rt-pgal-tab-${i}`

  return (
    <div className="rt-pgal">
      <div
        className="rt-pgal__rail"
        role="tablist"
        aria-label="Rally Tower photographs"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        onKeyDown={onRailKey}
      >
        {SHOTS.map((s, i) => {
          const [w, h] = DIMS[s.src]
          const on = i === index
          return (
            <button
              key={s.src}
              type="button"
              id={tabId(i)}
              role="tab"
              aria-selected={on}
              aria-controls="rt-pgal-panel"
              tabIndex={on ? 0 : -1}
              className={`rt-pgal__thumb${on ? ' is-on' : ''}`}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              onClick={() => select(i, false)}
            >
              {/* The caption is the tab's accessible name; the thumbnail
                  repeats the photograph the frame will show, so it is
                  decorative here. */}
              <img
                src={IMAGES[s.src]}
                alt=""
                width={w}
                height={h}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="rt-sr">
                {pad(i + 1)}. {s.caption}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rt-pgal__stage">
        <div
          className="rt-pgal__panel"
          id="rt-pgal-panel"
          role="tabpanel"
          aria-labelledby={tabId(index)}
        >
          {/* Feathered, not framed: the studio wall behind four of these six
              photographs is light grey, and a hard-edged bright rectangle on
              the ink ground reads as a broken image. */}
          <div className="rt-media rt-media--feather rt-pgal__frame">
            {SHOTS.map((s, i) => {
              const [w, h] = DIMS[s.src]
              return (
                <img
                  key={s.src}
                  className={`rt-pgal__shot${i === index ? ' is-on' : ''}`}
                  src={IMAGES[s.src]}
                  alt={s.alt}
                  width={w}
                  height={h}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  aria-hidden={i === index ? undefined : true}
                />
              )
            })}
            <span className="rt-scrim rt-scrim--vignette" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="rt-pgal__nav rt-pgal__nav--prev"
            onClick={() => select(index - 1, false)}
            aria-label="Previous photograph"
          >
            <RallyIcon name="chevron" size={20} />
          </button>
          <button
            type="button"
            className="rt-pgal__nav rt-pgal__nav--next"
            onClick={() => select(index + 1, false)}
            aria-label="Next photograph"
          >
            <RallyIcon name="chevron" size={20} />
          </button>

          <span className="rt-mono rt-pgal__count" aria-hidden="true">
            {pad(index + 1)} / {pad(COUNT)}
          </span>
        </div>

        <p className="rt-pgal__cap">{active.caption}</p>
      </div>
    </div>
  )
}
