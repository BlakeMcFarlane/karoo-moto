import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/rally/Reveal'
import RallyIcon from '../components/rally/RallyIcon'
import {
  ABOUT_HERO,
  PULL_QUOTES,
  STORY,
  STORY_INTRO,
  STORY_SIGNOFF,
} from '../data/about'
import type { PullQuote, StoryChapter } from '../data/about'
import { RALLY_TOWER } from '../data/rallyTower'
import backsplash from '../assets/rally/backsplash.jpg'
import towerOnBikeNight from '../assets/rally/tower-on-bike-night.jpeg'

/**
 * About — the founder's story.
 *
 * Every word on this page comes out of `src/data/about.ts` verbatim; the only
 * thing this file decides is pacing. The two pull quotes were lifted OUT of
 * the running prose, so the page composes chapter → any quote whose `after`
 * matches → next chapter rather than hard-coding the sequence.
 */

/** One step of the in-chapter stagger. Four steps is the whole budget. */
const STEP = 90
const MAX_STEPS = 4

/**
 * How each chapter is set. This is layout metadata, not content — the ORDER
 * still comes from STORY. Six identical stacked prose blocks would read as a
 * wall of text, so the eye gets a different place to rest in each chapter:
 * a label in the margin, an indented column, a lifted panel, the one chapter
 * that talks about what we build carrying the photograph, and the
 * one-sentence chapter set as a statement. Unknown ids fall back to `margin`.
 */
type ChapterLayout = 'margin' | 'indent' | 'panel' | 'media' | 'statement'

const LAYOUT: Record<string, ChapterLayout> = {
  yz80: 'margin',
  'south-africa': 'indent',
  america: 'panel',
  why: 'media',
  'two-places': 'statement',
  'what-it-is-about': 'margin',
}

interface ChapterProps {
  chapter: StoryChapter
}

function Chapter({ chapter }: ChapterProps) {
  const layout = LAYOUT[chapter.id] ?? 'margin'
  const headingId = `rt-about-${chapter.id}`

  return (
    <section
      className={[
        'rt-section',
        'rt-about__chapter',
        `rt-about__chapter--${layout}`,
        // Chapters run on the tighter rhythm — they are one continuous story,
        // and a full section boundary between each pair reads as six separate
        // pages. The panel chapter keeps the full rhythm because a change of
        // ground needs the room.
        layout === 'panel' ? 'rt-section--panel' : 'rt-section--sm',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={headingId}
    >
      <div className="rt-container">
        <div className="rt-about__inner">
          {/* The chapter heading is navigational furniture, not editorial —
              it carries the document outline at eyebrow scale. */}
          <Reveal variant="up" className="rt-about__label-wrap">
            <h2 id={headingId} className="rt-mono rt-about__label">
              {chapter.label}
            </h2>
          </Reveal>

          <div className="rt-about__prose">
            {chapter.paragraphs.map((paragraph, i) => (
              <Reveal
                key={paragraph}
                variant="up"
                delay={STEP * Math.min(i + 1, MAX_STEPS)}
                threshold={0.05}
              >
                <p className="rt-body-copy rt-about__para">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {layout === 'media' && (
            <Reveal
              variant="clip"
              delay={STEP * 2}
              threshold={0.08}
              className="rt-about__media-wrap"
            >
              <div className="rt-media rt-media--feather rt-about__media">
                <img
                  src={towerOnBikeNight}
                  alt="The KarooMoto Rally Tower fitted to a KTM in a workshop, its white beam and yellow dust light both lit."
                  width={960}
                  height={1280}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

interface BeatProps {
  quote: PullQuote
}

/**
 * A pull quote — the two emotional beats. Bone ground, display type, nothing
 * else in the band. No quotation glyphs: at this size they fight the type, and
 * the <blockquote> already says what this is.
 */
function Beat({ quote }: BeatProps) {
  return (
    <div className="rt-section rt-section--bone rt-about__beat">
      <div className="rt-container">
        <Reveal variant="up" className="rt-about__beat-inner" threshold={0.08}>
          <hr className="rt-rule rt-rule--draw rt-about__beat-rule" />
          <blockquote className="rt-about__quote">
            <p className="rt-about__quote-text">{quote.text}</p>
          </blockquote>
        </Reveal>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="rt-page rt-about">
      <div className="rt-grain" aria-hidden="true" />

      {/* The landing hero owns the centred badge lockup over this photograph.
          This one is its quieter sibling: a left-anchored crop off the rider,
          two lines of type, two thirds of a screen. Its job is to get you
          reading, not to hold you. */}
      <section className="rt-about__hero" aria-labelledby="rt-about-title">
        <div className="rt-about__hero-ground" aria-hidden="true">
          <img
            className="rt-about__hero-sky"
            src={backsplash}
            alt=""
            width={1717}
            height={916}
            loading="eager"
            // React 18 does not map the camelCase prop; the lowercase
            // attribute is what the browser reads anyway.
            {...{ fetchpriority: 'high' }}
            decoding="async"
          />
          <span className="rt-scrim rt-scrim--left" />
          <span className="rt-scrim rt-scrim--top" />
          <span className="rt-scrim rt-scrim--bottom" />
        </div>

        <div className="rt-container rt-about__hero-inner">
          <Reveal variant="up" threshold={0} rootMargin="0px">
            <p className="rt-eyebrow">{ABOUT_HERO.eyebrow}</p>
          </Reveal>

          <h1
            id="rt-about-title"
            className="rt-h1 rt-h1--sentence rt-about__hero-title"
          >
            <Reveal
              as="span"
              variant="line"
              className="rt-about__hero-line"
              delay={STEP}
              threshold={0}
              rootMargin="0px"
            >
              <span>{ABOUT_HERO.title}</span>
            </Reveal>
          </h1>
        </div>
      </section>

      {/* Front matter. Deliberately not a heading — the chapters below carry
          the outline, and a second h2 here would only compete with them. */}
      <div className="rt-section rt-section--sm rt-about__front">
        <div className="rt-container">
          <Reveal variant="up" className="rt-about__front-inner">
            <p className="rt-about__front-label">{STORY_INTRO}</p>
            <hr className="rt-rule rt-rule--draw rt-about__front-rule" />
          </Reveal>
        </div>
      </div>

      {STORY.map((chapter) => (
        <Fragment key={chapter.id}>
          <Chapter chapter={chapter} />
          {PULL_QUOTES.filter((quote) => quote.after === chapter.id).map(
            (quote) => (
              <Beat key={quote.id} quote={quote} />
            ),
          )}
        </Fragment>
      ))}

      {/* The last statement, and one quiet way onward. Same photograph as the
          hero, cropped and graded down until it reads as ground rather than as
          a second look at the same picture. */}
      <section className="rt-about__close" aria-labelledby="rt-about-signoff">
        <div className="rt-about__close-ground" aria-hidden="true">
          <img
            className="rt-about__close-sky"
            src={backsplash}
            alt=""
            width={1717}
            height={916}
            loading="lazy"
            decoding="async"
          />
          <span className="rt-scrim rt-scrim--veil" />
          <span className="rt-scrim rt-scrim--top" />
          <span className="rt-scrim rt-scrim--bottom" />
        </div>

        <div className="rt-container rt-about__close-inner">
          {/* threshold 0: the last statement on the page is masked type, so it
              resolves the moment the band appears rather than waiting for the
              section to be a sixth of the way up the screen. */}
          <Reveal
            variant="line"
            className="rt-about__signoff-mask"
            threshold={0}
          >
            <h2 id="rt-about-signoff" className="rt-about__signoff">
              {STORY_SIGNOFF}
            </h2>
          </Reveal>

          <Reveal variant="up" delay={STEP * 2}>
            <Link
              to="/product"
              className="rt-link rt-link--hit rt-about__onward"
              aria-label={`${RALLY_TOWER.name} product page`}
            >
              {RALLY_TOWER.name}
              <RallyIcon name="arrow" size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
