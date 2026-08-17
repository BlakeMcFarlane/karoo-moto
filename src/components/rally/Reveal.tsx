import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../lib/motion'

export type RevealVariant = 'up' | 'fade' | 'clip' | 'scale' | 'blur' | 'line'

interface RevealProps {
  children: ReactNode
  /** Rendered element. Defaults to `div`. */
  as?: ElementType
  className?: string
  /** Motion signature — see `styles/rally/base.css`. */
  variant?: RevealVariant
  /** Stagger in milliseconds. */
  delay?: number
  /** Override the observer threshold for tall blocks. */
  threshold?: number
  rootMargin?: string
  /** Re-hide when scrolled back out (off by default — reveals stay revealed). */
  repeat?: boolean
  style?: CSSProperties
  id?: string
}

/** Lets a caller pass `--rt-delay` without fighting the CSSProperties type. */
type RevealStyle = CSSProperties & Record<'--rt-delay', string>


/**
 * Scroll reveal wrapper. Adds `.rt-reveal` (+ variant) and flips `.is-in` when
 * the element enters the viewport. All timing lives in CSS so the motion
 * language stays consistent across every section, and reduced-motion users get
 * the revealed state immediately.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  variant = 'up',
  delay = 0,
  threshold,
  rootMargin,
  repeat = false,
  style,
  id,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>({
    threshold,
    rootMargin,
    once: !repeat,
  })

  return (
    <Tag
      ref={ref}
      id={id}
      className={`rt-reveal rt-reveal--${variant} ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={
        delay ? ({ ...style, '--rt-delay': `${delay}ms` } as RevealStyle) : style
      }
    >
      {children}
    </Tag>
  )
}
