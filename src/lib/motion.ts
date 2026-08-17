// ---------------------------------------------------------------------------
// Motion primitives for the Rally Tower page.
//
// Everything here is scroll-driven and rAF-throttled: a single passive scroll
// listener per hook instance, all reads batched into one frame, all writes done
// through CSS custom properties so the browser can keep them off the main
// thread where possible.
//
// Every hook respects `prefers-reduced-motion`. When it is set, reveals resolve
// immediately and scroll progress pins to its resting value, so the page reads
// as a normal document with no motion at all.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState, type RefObject } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Live `prefers-reduced-motion` state. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export interface InViewOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number
  /** Shrink the viewport so reveals fire before the element is fully on screen. */
  rootMargin?: string
  /** Keep the revealed state once triggered (default true). */
  once?: boolean
}

/**
 * Observe an element and report whether it has entered the viewport.
 * Returns `[ref, inView]`. With reduced motion the element reports `true`
 * immediately so nothing is ever hidden behind an animation that never runs.
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -12% 0px',
  once = true,
}: InViewOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduced) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return

    // Elements already on screen at mount (the hero) should not wait for a
    // scroll event to resolve.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced, threshold, rootMargin, once])

  return [ref, inView]
}

export interface ScrollProgressOptions {
  /**
   * Where progress starts, as a fraction of the viewport height measured from
   * the top. 1 = the element's top edge touching the bottom of the viewport.
   */
  start?: number
  /** Where progress reaches 1, same units. 0 = element top at viewport top. */
  end?: number
  /** Track the element's full scroll-through instead of start/end offsets. */
  mode?: 'enter' | 'through'
  /** Resting value used when reduced motion is on. */
  restingValue?: number
  /**
   * Hold the reader's place in the scene across a viewport resize.
   *
   * A sticky scrubbed scene is sized in viewport units, and so is everything
   * above it. Resize the window and the whole page reflows underneath an
   * unchanged `scrollY`, so a reader parked mid-scrub is silently relocated —
   * usually past the end, where the animation sits frozen at its final frame
   * and looks broken. With this on, the scene re-anchors the scroll position
   * so the reader stays at the same point in the animation.
   */
  anchorOnResize?: boolean
}

/**
 * Track an element's position through the viewport as a 0→1 value.
 *
 * `mode: 'enter'` (default) measures the element entering the viewport — good
 * for parallax and reveal-driven transforms. `mode: 'through'` measures a tall
 * sticky section scrolling past, where 0 is "just pinned" and 1 is "about to
 * unpin" — good for scroll-scrubbed scenes.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>({
  start = 1,
  end = 0,
  mode = 'enter',
  restingValue = 0.5,
  anchorOnResize = false,
}: ScrollProgressOptions = {}): [RefObject<T>, number] {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(reduced ? restingValue : 0)

  useEffect(() => {
    if (reduced) {
      setProgress(restingValue)
      return
    }
    const el = ref.current
    if (!el) return

    let frame = 0
    let last = -1

    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      let p: number

      if (mode === 'through') {
        // 0 when the top edge hits the viewport top, 1 when the bottom edge
        // reaches the viewport bottom.
        const distance = rect.height - vh
        p = distance <= 0 ? 0 : -rect.top / distance
      } else {
        const from = start * vh
        const to = end * vh
        const span = from - to || 1
        p = (from - rect.top) / span
      }

      p = p < 0 ? 0 : p > 1 ? 1 : p
      // Skip sub-pixel churn — 3 decimals is well past visual resolution.
      const rounded = Math.round(p * 1000) / 1000
      if (rounded !== last) {
        last = rounded
        setProgress(rounded)
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    /**
     * Put the reader back where they were in the scene.
     *
     * `last` still holds the progress from before the reflow, so the scroll
     * offset that reproduces it is the scene's new top plus that fraction of
     * its new scrub distance. Only runs while the scene is actually on screen
     * and genuinely scrubbing — resizing anywhere else must not move the page.
     */
    const reanchor = () => {
      if (!anchorOnResize || mode !== 'through' || last < 0) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const distance = rect.height - vh
      if (distance <= 0) return
      /* Bail only when the scene is a long way off screen. A generous margin
         matters here: shrinking the window HEIGHT reflows every viewport-unit
         section above this one at once, so the scene can be thrown a whole
         screen away by a single drag — exactly the case the reader most needs
         rescuing from. Beyond that, they were never in the scene and moving
         the page under them would be the wrong call. */
      if (rect.bottom < -vh * 2 || rect.top > vh * 2) return
      const top = window.scrollY + rect.top
      window.scrollTo({ top: Math.round(top + last * distance), behavior: 'auto' })
    }

    const onResize = () => {
      reanchor()
      onScroll()
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced, start, end, mode, restingValue, anchorOnResize])

  return [ref, progress]
}

/**
 * Page-level scroll offset in pixels, rAF-throttled. Used by the header and the
 * sticky purchase bar. Returns 0 under reduced motion consumers that only need
 * a threshold still work, because the value is real — only animation is opt-in.
 */
export function useScrollY(): number {
  const [y, setY] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setY(window.scrollY)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return y
}

/** Linear interpolation helper for mapping scroll progress onto a range. */
export const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t

/** Clamp a value into a range. */
export const clamp = (value: number, min = 0, max = 1): number =>
  value < min ? min : value > max ? max : value

/**
 * Map `value` from one range onto another, clamped. Useful for staging several
 * animations across one scroll-scrubbed section.
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  const t = clamp((value - inMin) / (inMax - inMin || 1))
  return lerp(outMin, outMax, t)
}

/** Cubic ease-out — matches the CSS `--rt-ease-out` curve closely enough. */
export const easeOut = (t: number): number => 1 - Math.pow(1 - clamp(t), 3)

/** Symmetric ease-in-out for scrubbed scenes. */
export const easeInOut = (t: number): number => {
  const c = clamp(t)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}
