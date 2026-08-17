import Hero from '../components/rally/Hero'
import ProvenInAfrica from '../components/rally/ProvenInAfrica'
import RiderFocused from '../components/rally/RiderFocused'
import LightingWiring from '../components/rally/LightingWiring'
import Trust from '../components/rally/Trust'
import StoryTeaser from '../components/rally/StoryTeaser'
import ImportantInfo from '../components/rally/ImportantInfo'
import BuyBar from '../components/rally/BuyBar'

/**
 * The landing page.
 *
 * Section order is the story order: promise → proof → differentiator →
 * differentiator → installation → reassurance → disclosure.
 * Capability and the product gallery live on /product, where they belong to
 * the transaction rather than the story. The brand moment is the hero — the
 * page opens on it rather than closing with a second copy of it.
 *
 * It sells; it does not transact. Every CTA leads to `/product`, where the
 * customer chooses their motorcycle and adds the tower to the cart. Chrome
 * (navigation, footer) is app-level — see App.tsx.
 */
export default function RallyTower() {
  return (
    <div className="rt-page rt-page--bleed">
      <div className="rt-grain" aria-hidden="true" />
      <Hero />
      <ProvenInAfrica />
      <RiderFocused />
      <LightingWiring />
      <Trust />
      <StoryTeaser />
      <ImportantInfo />
      <BuyBar />
    </div>
  )
}
