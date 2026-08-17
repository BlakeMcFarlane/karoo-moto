import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import RallyIcon from './RallyIcon'
import { STORY_TEASER } from '../../data/about'

/**
 * Our story — the teaser.
 *
 * The one moment on the page where the voice stops describing hardware and
 * says where the hardware came from. So it is built from type and space only:
 * no card, no portrait, no icon plate. There is no photograph of the founder,
 * and the badge already appears in the nav, the hero and the footer — a fourth
 * copy here would read as furniture rather than as a brand mark.
 *
 * Ground is `--panel`: Trust above is bone and the disclosure below is ink, so
 * the lifted dark surface keeps the page's light → panel → ink step and stops
 * the story from blurring into either neighbour.
 *
 * The block is a crescendo — mono eyebrow, prose, then the two beats the copy
 * is actually about. The sign-off is the section's <h2> BECAUSE it lands last:
 * "Built by a rider, for riders." is the name of this section, and naming it
 * anything else would mean writing copy that isn't in the data module.
 */

const TITLE_ID = 'story-title'

/** One stagger step. Five steps, so the last line lands inside 600ms. */
const STEP = 100

export default function StoryTeaser() {
  return (
    <section
      id={STORY_TEASER.id}
      className="rt-section rt-section--panel rt-teaser"
      aria-labelledby={TITLE_ID}
    >
      <div className="rt-container rt-container--narrow rt-teaser__inner">
        <Reveal variant="up">
          <p className="rt-eyebrow">{STORY_TEASER.eyebrow}</p>
        </Reveal>

        <Reveal variant="up" delay={STEP} className="rt-teaser__prose">
          <p className="rt-lede rt-teaser__para">{STORY_TEASER.paragraphs[0]}</p>

          {/* One sentence, not two: the lead runs straight into the promise,
              which is the half that carries the weight. */}
          <p className="rt-lede rt-teaser__para">
            {STORY_TEASER.mission.lead}{' '}
            <strong className="rt-teaser__emphasis">
              {STORY_TEASER.mission.emphasis}
            </strong>
          </p>
        </Reveal>

        <Reveal variant="up" delay={STEP * 2} className="rt-teaser__beat">
          <hr className="rt-rule rt-rule--draw rt-teaser__rule" />
          <p className="rt-teaser__origin">{STORY_TEASER.origin}</p>
        </Reveal>

        <Reveal
          variant="line"
          delay={STEP * 3}
          className="rt-teaser__statement-mask"
        >
          <h2 id={TITLE_ID} className="rt-h2 rt-h2--sentence rt-teaser__statement">
            {STORY_TEASER.statement}
          </h2>
        </Reveal>

        <Reveal variant="up" delay={STEP * 4} className="rt-teaser__actions">
          <Link className="rt-link rt-link--hit" to={STORY_TEASER.to}>
            {STORY_TEASER.cta}
            <RallyIcon name="arrow" size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
