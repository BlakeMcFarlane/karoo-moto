import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useTowerConfig } from './TowerConfig'
import RallyIcon from './RallyIcon'
import {
  BRANDS,
  FITMENT_SECTION,
  PREORDER,
  modelsForBrand,
  needsVariant,
  pendingOptions,
  yearRangeLabel,
  yearsForModel,
} from '../../data/rallyTower'

/**
 * The compatibility selector.
 *
 * Manufacturer → Model → Year → (Configuration). Each level is filtered by the
 * one above it and cleared by it, so an impossible pair — a 2025 CRF450L, a
 * 2019 CRF450RL — is never offered in the first place. `TowerConfig` holds the
 * state and owns that cascade; this component only draws it, and reads
 * `isComplete` / `isIncompatible` back out as the purchase gate.
 */

interface Choice {
  value: string
  label: string
  /** Quiet second line — brand blurb, model year range. */
  hint?: string
}

interface DropdownProps {
  id: string
  label: string
  /** Shown when nothing is chosen yet and the field is available. */
  placeholder: string
  /** Shown instead when the upstream step has not been made. */
  lockedHint: string
  options: Choice[]
  value: string | undefined
  onChange: (value: string) => void
  locked: boolean
}

/**
 * Select-only combobox (ARIA 1.2).
 *
 * Focus never leaves the trigger — the active option is pointed at with
 * `aria-activedescendant`, which is why the options are `<li role="option">`
 * and not buttons. A button inside a listbox breaks the role hierarchy and
 * screen readers stop announcing position and count.
 *
 * The list is always mounted so `aria-controls` resolves; `visibility: hidden`
 * takes it back out of the accessibility tree while it is closed.
 */
function Dropdown({
  id,
  label,
  placeholder,
  lockedHint,
  options,
  value,
  onChange,
  locked,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const labelId = `${id}-label`
  const triggerId = `${id}-trigger`
  const listId = `${id}-list`
  const optionId = (i: number) => `${id}-opt-${i}`

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined
  const last = options.length - 1

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const openAt = (i: number) => {
    if (locked || options.length === 0) return
    setActive(Math.min(Math.max(i, 0), last))
    setOpen(true)
  }

  const commit = (i: number) => {
    const option = options[i]
    if (option) onChange(option.value)
  }

  // A locked field stays focusable — it carries `aria-disabled`, never
  // `disabled`, so tabbing through the form mid-purchase never dead-ends on
  // <body>. It must still close when its upstream choice is cleared.
  useEffect(() => {
    if (locked) setOpen(false)
  }, [locked])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (locked) return

    if (!open) {
      switch (e.key) {
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault()
          openAt(selectedIndex >= 0 ? selectedIndex : 0)
          return
        case 'ArrowUp':
          e.preventDefault()
          openAt(selectedIndex >= 0 ? selectedIndex : last)
          return
        case 'Home':
          e.preventDefault()
          openAt(0)
          return
        case 'End':
          e.preventDefault()
          openAt(last)
          return
        default:
          return
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((a) => Math.min(last, a + 1))
        return
      case 'ArrowUp':
        e.preventDefault()
        setActive((a) => Math.max(0, a - 1))
        return
      case 'Home':
        e.preventDefault()
        setActive(0)
        return
      case 'End':
        e.preventDefault()
        setActive(last)
        return
      case 'Enter':
      case ' ':
        e.preventDefault()
        commit(active)
        close(true)
        return
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        return
      case 'Tab':
        // Tab commits the active option and moves on, as a native select does.
        commit(active)
        setOpen(false)
        return
      default:
    }
  }

  const valueText = selected ? selected.label : locked ? lockedHint : placeholder

  return (
    <div className={`rt-sel__field${locked ? ' is-locked' : ''}`} ref={rootRef}>
      <span className="rt-mono rt-sel__label" id={labelId}>
        {label}
      </span>

      <button
        type="button"
        id={triggerId}
        ref={triggerRef}
        className={`rt-sel__trigger${open ? ' is-open' : ''}${selected ? ' is-set' : ''}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${triggerId}`}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-disabled={locked || undefined}
        onClick={() =>
          open ? close(false) : openAt(selectedIndex >= 0 ? selectedIndex : 0)
        }
        onKeyDown={onKeyDown}
      >
        <span className="rt-sel__value">{valueText}</span>
        <RallyIcon name="chevron" size={16} className="rt-sel__chevron" />
      </button>

      <ul
        className={`rt-sel__list${open ? ' is-open' : ''}`}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        ref={listRef}
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={optionId(i)}
            role="option"
            aria-selected={o.value === value}
            className={`rt-sel__opt${i === active ? ' is-active' : ''}`}
            /* Focus stays on the trigger: aria-activedescendant is only valid
               while the combobox itself owns focus. */
            onPointerDown={(e) => e.preventDefault()}
            onPointerEnter={() => setActive(i)}
            onClick={() => {
              commit(i)
              close(true)
            }}
          >
            <span className="rt-sel__opt-label">{o.label}</span>
            {o.hint && <span className="rt-mono rt-sel__opt-hint">{o.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BikeSelector() {
  const {
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
  } = useTowerConfig()

  const brandChoices: Choice[] = BRANDS.map((b) => ({
    value: b.id,
    label: b.name,
    hint: b.blurb,
  }))

  const models = selection.brand ? modelsForBrand(selection.brand) : []
  const modelChoices: Choice[] = models.map((m) => ({
    value: m.id,
    label: m.name,
    hint: yearRangeLabel(m),
  }))

  // Already scoped to the model, so a CRF450L never offers 2021 and later and
  // a CRF450RL never offers 2019.
  const years = selection.modelId ? yearsForModel(selection.modelId) : []
  const yearChoices: Choice[] = years.map((y) => ({
    value: String(y),
    label: String(y),
  }))

  const showVariant = platform ? needsVariant(platform) : false
  const variantChoices: Choice[] = variants.map((v) => ({
    value: v.id,
    label: v.label,
  }))

  const pending = platform ? pendingOptions(platform) : []
  const step = selection.year
    ? 3
    : selection.modelId
      ? 2
      : selection.brand
        ? 1
        : 0

  return (
    <div className="rt-sel">
      <ol className="rt-sel__steps" aria-hidden="true">
        {FITMENT_SECTION.steps.map((s, i) => (
          <li
            key={s.n}
            className={`rt-sel__step${i < step ? ' is-done' : ''}${i === step ? ' is-now' : ''}`}
          >
            <span className="rt-mono">{s.n}</span>
            <span>{s.label}</span>
          </li>
        ))}
      </ol>

      <div className="rt-sel__fields">
        <Dropdown
          id="rt-sel-brand"
          label="Manufacturer"
          placeholder={FITMENT_SECTION.prompts.brand}
          lockedHint={FITMENT_SECTION.prompts.brand}
          options={brandChoices}
          value={selection.brand}
          locked={false}
          onChange={(v) => {
            const brand = BRANDS.find((b) => b.id === v)
            if (brand) setBrand(brand.id)
          }}
        />

        <Dropdown
          id="rt-sel-model"
          label={FITMENT_SECTION.steps[1].label}
          placeholder={FITMENT_SECTION.prompts.model}
          lockedHint={FITMENT_SECTION.prompts.modelLocked}
          options={modelChoices}
          value={selection.modelId}
          locked={!selection.brand}
          onChange={setModel}
        />

        <Dropdown
          id="rt-sel-year"
          label={FITMENT_SECTION.steps[2].label}
          placeholder={FITMENT_SECTION.prompts.year}
          lockedHint={FITMENT_SECTION.prompts.yearLocked}
          options={yearChoices}
          value={selection.year ? String(selection.year) : undefined}
          locked={!selection.modelId}
          onChange={(v) => setYear(Number(v))}
        />

        {showVariant && (
          <Dropdown
            id="rt-sel-variant"
            label="Configuration"
            placeholder="Choose a configuration"
            lockedHint="Choose a year first"
            options={variantChoices}
            value={variant?.id}
            locked={false}
            onChange={setVariant}
          />
        )}
      </div>

      {/* One region for every outcome, so a change of state is announced once
          and in the order the customer reads it. */}
      <div className="rt-sel__result" aria-live="polite">
        {isComplete && platform ? (
          <div className="rt-sel__fit">
            <p className="rt-sel__fit-head">
              <span className="rt-dot rt-dot--teal" />
              <span className="rt-mono rt-mono--teal">
                {FITMENT_SECTION.result.fits}
              </span>
            </p>

            <p className="rt-sel__bike">{bikeLabel}</p>
            <p className="rt-sel__note">{FITMENT_SECTION.result.fitsBody}</p>

            <dl className="rt-sel__kit">
              <dt className="rt-mono rt-sel__kit-label">
                {FITMENT_SECTION.result.kitLabel}
              </dt>
              <dd className="rt-sel__kit-code">{platform.kit}</dd>
              {variant && (
                <>
                  <dt className="rt-mono rt-sel__kit-label">Configuration</dt>
                  <dd className="rt-sel__kit-code">{variant.label}</dd>
                </>
              )}
            </dl>

            {pending.length > 0 && (
              <ul className="rt-sel__pending">
                {pending.map((o) => (
                  <li key={o.id} className="rt-sel__pending-item">
                    <span className="rt-chip">Coming soon</span>
                    <span className="rt-sel__pending-text">
                      {o.label}
                      {o.note ? ` — ${o.note}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button type="button" className="rt-link rt-link--hit" onClick={reset}>
              {FITMENT_SECTION.result.changeLabel}
            </button>
          </div>
        ) : isIncompatible ? (
          <div className="rt-sel__nofit">
            <p className="rt-sel__fit-head">
              <span className="rt-dot" />
              <span className="rt-mono rt-mono--ember">Not compatible</span>
            </p>
            <p className="rt-sel__bike">{bikeLabel}</p>
            <p className="rt-sel__note">{FITMENT_SECTION.missing.body}</p>
            <button type="button" className="rt-link rt-link--hit" onClick={reset}>
              {FITMENT_SECTION.result.changeLabel}
            </button>
          </div>
        ) : (
          <p className="rt-sel__prompt">
            <span className="rt-sel__prompt-text">{PREORDER.selectPrompt}</span>
            <span className="rt-sel__prompt-sub">{FITMENT_SECTION.lede}</span>
          </p>
        )}
      </div>
    </div>
  )
}
