// ---------------------------------------------------------------------------
// About KarooMoto — the founder's story.
//
// This is a personal, first-person account, not marketing copy. It is stored
// verbatim and broken into chapters ONLY for pacing on screen; not a word is
// rewritten, softened, shortened or "brand-voiced". If this page ever needs to
// say something new, the founder writes it — nobody paraphrases it here.
//
// Chapter titles are the one exception: they are navigational furniture added
// for the layout, kept to plain descriptive labels, and any section may render
// without them.
// ---------------------------------------------------------------------------

export const ABOUT_HERO = {
  eyebrow: 'About KarooMoto',
  title: 'Built by a rider, for riders.',
}

export interface StoryChapter {
  id: string
  /** Layout label. Deliberately plain — the story does the talking. */
  label: string
  paragraphs: string[]
}

export const STORY_INTRO = 'Our Story'

export const STORY: StoryChapter[] = [
  {
    id: 'yz80',
    label: 'Where it started',
    paragraphs: [
      'For me, motorcycles have never just been a hobby. I’ve loved riding for as long as I can remember.',
      'I grew up in South Africa, and when I was eight years old, my father bought me my first motorcycle—a 1994 Yamaha YZ80. That’s where it all started. I absolutely fell in love with riding, and motorcycles have been a part of my life ever since.',
    ],
  },
  {
    id: 'south-africa',
    label: 'Riding in South Africa',
    paragraphs: [
      'Growing up in South Africa, riding wasn’t about having the newest bike, the best gear, or every accessory you could possibly want. The reality is that motorcycles and recreational riding can be expensive, and for many families, those luxuries simply aren’t easy to afford. I certainly didn’t grow up with all the best equipment. Most of the time, I just wanted to ride. I’d put on a helmet, a pair of jeans and some shoes, and go. I didn’t even own a proper pair of riding boots. None of that mattered to me—I had a motorcycle, somewhere to ride, and I loved every minute of it.',
    ],
  },
  {
    id: 'america',
    label: 'Arriving in America',
    paragraphs: [
      'I emigrated to the United States in my early twenties, and America opened my eyes to a completely different world. I got a job working in retail and was making less than $40,000 a year, yet I was able to buy a vehicle and eventually purchase my first motorcycle in America. That might sound ordinary to some people, but to me it was incredible. It was one of the first times I really understood what people meant by the American Dream.',
      'Like many immigrants who come to America from countries where those opportunities can be harder to find, it’s easy to eventually become accustomed to having more. Things that once seemed like incredible luxuries slowly start to feel normal. I’ve always tried to hold onto where I came from and remain grateful for the opportunities I’ve had.',
      'That mindset is a big part of why I started KarooMoto.',
    ],
  },
  {
    id: 'why',
    label: 'Why KarooMoto',
    paragraphs: [
      'The reason behind KarooMoto is actually pretty simple: I absolutely love riding. Anything I can do that allows me to contribute to the sport I’ve loved my entire life, spend more of my life around motorcycles, and help other people experience that same passion means everything to me.',
      'But I also know what it’s like to love motorcycles without having an unlimited budget. I know what it’s like to see something you’d love to have for your bike and realize you simply can’t justify the price. I don’t believe good motorcycle equipment needs to carry an outrageous price tag just because it’s made for adventure, dual-sport, or rally riding.',
      'That’s a huge part of the mission behind KarooMoto. I want to drive costs down wherever I reasonably can while still putting genuinely good-quality products into riders’ hands. I’m not interested in charging more for something simply because the market will tolerate it. If we can offer it for less while maintaining the quality I’d expect to put on my own motorcycle, that’s what I want to do.',
    ],
  },
  {
    id: 'two-places',
    label: 'Two places',
    paragraphs: [
      'KarooMoto brings together two places that have had an enormous impact on my life.',
    ],
  },
  {
    id: 'what-it-is-about',
    label: 'What it’s about',
    paragraphs: [
      'At the end of the day, KarooMoto isn’t about who has the newest motorcycle or the most expensive equipment. It’s about getting out and riding. It’s about getting your bike dirty, exploring somewhere you’ve never been, meeting good people, and making memories on two wheels.',
      'Whether you’re riding a brand-new machine with every accessory imaginable or an old dirt bike and just enough gear to get out there, you’re still a rider.',
      'We’re starting small, and that’s something I’m proud of. KarooMoto is being built by a rider, for riders, with a simple goal: offer good-quality products at fair prices and never forget why we started in the first place.',
    ],
  },
]

/**
 * The two lines the brief calls out for larger visual treatment. They are
 * pulled OUT of the running prose above, not duplicated into it — `after` is
 * the chapter each one follows, so the page composes itself.
 */
export interface PullQuote {
  id: string
  after: string
  text: string
}

export const PULL_QUOTES: PullQuote[] = [
  {
    id: 'two-countries',
    after: 'two-places',
    text: 'South Africa gave me my love of riding, and America gave me the opportunity to build something from that passion.',
  },
  {
    id: 'yz80-kid',
    after: 'what-it-is-about',
    text: 'Because underneath all of this, I’m still that eight-year-old kid on a YZ80 who just wants to ride.',
  },
]

/** The last line of the page. */
export const STORY_SIGNOFF = 'Welcome to KarooMoto.'

// --- Homepage teaser --------------------------------------------------------

export const STORY_TEASER = {
  id: 'story',
  eyebrow: 'Built from a love of riding',
  paragraphs: [
    'KarooMoto started with an eight-year-old kid riding a Yamaha YZ80 in South Africa and a lifelong obsession with motorcycles.',
  ],
  /** Rendered with the second half emphasised, per the brief. */
  mission: {
    lead: 'Today, we’re building motorcycle products around a simple idea:',
    emphasis:
      'good equipment should be well-made, fairly priced, and built for people who actually ride.',
  },
  origin: 'South Africa gave us the passion. America gave us the opportunity to build something from it.',
  statement: 'Built by a rider, for riders.',
  cta: 'Read our story',
  to: '/about',
}
