// ---------------------------------------------------------------------------
// KarooMoto Terms & Conditions.
//
// SUPPLIED LEGAL LANGUAGE — TRANSCRIBED VERBATIM.
//
// Nothing in this file may be reworded, summarised, shortened, reordered or
// "brand-voiced". Section numbering and headings are the supplied ones. If the
// terms change, they are replaced wholesale with new supplied text; nobody
// edits a clause in place to make it read better.
//
// One source, two surfaces: the acceptance modal above the checkout button and
// the `/policies/terms` document both render this module, so they can never
// drift apart.
// ---------------------------------------------------------------------------

export interface TermsSection {
  /** Section number as supplied. */
  n: number
  title: string
  body: string[]
  /** Bulleted items, where the supplied text uses them. */
  list?: string[]
  /** Text that follows the list. */
  after?: string[]
}

export const TERMS_TITLE = 'KarooMoto Terms & Conditions'
export const TERMS_UPDATED = 'Last Updated: August 16, 2026'

export const TERMS_PREAMBLE =
  'By accessing this website, placing an order with KarooMoto, purchasing a KarooMoto product, or installing or using a KarooMoto product, you acknowledge that you have read, understood, and agree to these Terms & Conditions.'

export const TERMS_SECTIONS: TermsSection[] = [
  {
    n: 1,
    title: 'Product Use',
    body: [
      'KarooMoto products are aftermarket motorcycle products intended for adventure, dual-sport, off-road, rally, recreational, and other motorcycle applications.',
      'Motorcycles and motorcycle riding involve inherent risks. Installation or use of aftermarket components may alter the handling, electrical system, lighting, weight distribution, controls, or other characteristics of a motorcycle.',
      'The purchaser and/or rider is responsible for determining whether a product is appropriate for the motorcycle, intended application, riding conditions, and rider.',
    ],
  },
  {
    n: 2,
    title: 'Installation Responsibility',
    body: [
      'KarooMoto products may require mechanical and/or electrical installation, including removal of original motorcycle components, installation of brackets and hardware, adjustment of components, routing of wiring, and cutting, connecting, or splicing electrical wiring.',
      'The purchaser is responsible for ensuring that all products are installed correctly and securely.',
      'If the purchaser is not qualified or comfortable performing the required installation, KarooMoto strongly recommends installation by a qualified motorcycle technician.',
      'Before operating the motorcycle, the installer and rider are responsible for confirming that:',
    ],
    list: [
      'All fasteners and mounting components are properly installed and secured.',
      'Wiring is properly routed, connected, insulated, and protected from heat and moving components.',
      'Steering operates freely from lock to lock without interference.',
      'Brake lines, throttle cables, clutch lines, wiring, and controls are not restricted.',
      'Lighting and electrical systems function correctly.',
      'The installation does not interfere with safe operation of the motorcycle.',
    ],
    after: [
      'Products should be inspected periodically and after crashes, impacts, severe off-road use, or other events that could loosen or damage components.',
    ],
  },
  {
    n: 3,
    title: 'Assumption of Risk',
    body: [
      'Motorcycling, including on-road riding, off-road riding, adventure riding, dual-sport riding, rally riding, racing, and competition, involves inherent risks that may result in motorcycle damage, property damage, serious bodily injury, or death.',
      'By purchasing, installing, or using a KarooMoto product, the purchaser and user acknowledge and voluntarily assume the risks associated with motorcycle operation and the use of aftermarket motorcycle equipment.',
      'The rider remains solely responsible for operating the motorcycle safely and within the rider’s abilities and applicable conditions.',
    ],
  },
  {
    n: 4,
    title: 'Limitation of Liability',
    body: [
      'To the fullest extent permitted by applicable law, KarooMoto and its owners, members, employees, contractors, suppliers, manufacturers, distributors, and affiliates shall not be liable for indirect, incidental, special, exemplary, or consequential damages arising from or related to the installation, modification, use, misuse, or failure of a KarooMoto product.',
      'This includes, without limitation, loss of use, loss of income, lost profits, towing expenses, transportation expenses, travel expenses, or damage to other equipment resulting from an incident involving a KarooMoto product.',
      'KarooMoto is not responsible for damage or injury resulting from improper installation, improper maintenance, incorrect electrical connections, unauthorized modifications, failure to inspect or maintain the product, misuse, accidents, crashes, or operation of a motorcycle in an unsafe manner.',
      'Nothing contained in these Terms & Conditions excludes or limits liability where such exclusion or limitation is prohibited by applicable law.',
    ],
  },
  {
    n: 5,
    title: 'Motorcycle & Property Damage',
    body: [
      'Except to the extent required by applicable law, KarooMoto’s obligations regarding a KarooMoto product do not extend to damage to the customer’s motorcycle or other property.',
      'Repair or replacement of a KarooMoto product under an applicable warranty does not constitute acceptance of responsibility for the accident, crash, motorcycle damage, property damage, personal injury, or other losses associated with the event.',
    ],
  },
  {
    n: 6,
    title: 'Product Compatibility',
    body: [
      'Customers are responsible for providing accurate motorcycle information when ordering, including make, model, model year, and relevant modifications.',
      'Aftermarket fuel tanks, handlebars, steering dampers, dashboards, electrical modifications, accessories, fairings, controls, or other modifications may affect compatibility.',
      'Unless specifically stated otherwise in the applicable product listing, KarooMoto does not guarantee compatibility with every possible combination of motorcycle and aftermarket equipment.',
    ],
  },
  {
    n: 7,
    title: 'Lighting & Road-Legal Compliance',
    body: [
      'Vehicle equipment and motorcycle lighting requirements vary between states, countries, and jurisdictions.',
      'The purchaser is responsible for determining whether the product, lighting configuration, installation, and motorcycle comply with all laws and regulations applicable where the motorcycle is registered or operated.',
      'The availability or sale of a KarooMoto product does not constitute a representation that the product is approved for public-road use in every jurisdiction.',
    ],
  },
  {
    n: 8,
    title: 'Off-Road & Competition Use',
    body: [
      'Off-road riding, rally riding, racing, and competition can place significantly greater loads on motorcycle components than ordinary street riding.',
      'Customers participating in these activities are responsible for inspecting their motorcycle and KarooMoto components frequently and after crashes, impacts, or unusually severe riding conditions.',
    ],
  },
  {
    n: 9,
    title: 'Product Information',
    body: [
      'KarooMoto makes reasonable efforts to ensure that product descriptions, photographs, specifications, pricing, compatibility information, and other website information are accurate.',
      'Minor differences in color, texture, finish, hardware, manufacturing details, or appearance may occur between production batches.',
      'KarooMoto may make reasonable improvements or revisions to product designs, materials, hardware, or components without notice provided that such changes do not materially reduce the intended functionality of the product.',
    ],
  },
  {
    n: 10,
    title: 'Orders & Payment',
    body: [
      'By placing an order, you represent that the information provided during checkout is accurate and that you are authorized to use the selected payment method.',
      'KarooMoto reserves the right to refuse or cancel an order in cases of suspected fraud, payment problems, pricing errors, inventory errors, incorrect product information, or other circumstances that reasonably prevent fulfillment.',
      'If KarooMoto cancels a paid order before shipment, the amount paid for the canceled merchandise will be refunded.',
    ],
  },
  {
    n: 11,
    title: 'Pre-Orders & Made-to-Order Products',
    body: [
      'Certain KarooMoto products may be sold as pre-order, limited-production, or made-to-order products.',
      'Any estimated production, import, shipping, or delivery date is an estimate rather than a guaranteed delivery date unless expressly stated otherwise.',
      'Delays may occur because of manufacturing schedules, component availability, international transportation, customs clearance, weather, carriers, supply-chain disruptions, or other circumstances outside KarooMoto’s reasonable control.',
      'KarooMoto will make reasonable efforts to fulfill orders and communicate material delays.',
    ],
  },
  {
    n: 12,
    title: 'Shipping',
    body: [
      'Shipping and delivery estimates are not guarantees unless expressly stated otherwise.',
      'KarooMoto is not responsible for carrier delays or other transportation delays outside its reasonable control.',
      'Customers are responsible for providing a complete and accurate shipping address.',
      'Additional shipping terms displayed during checkout or contained in KarooMoto’s Shipping Policy are incorporated into these Terms.',
    ],
  },
  {
    n: 13,
    title: 'Returns & Warranty',
    body: [
      'KarooMoto’s current 45-Day Satisfaction Guarantee and 12-Month KarooMoto Warranty are governed by the Returns & Warranty Policy displayed on this website and/or the applicable product page.',
      'The terms of those policies are incorporated into these Terms & Conditions by reference.',
    ],
  },
  {
    n: 14,
    title: 'Product Inspection',
    body: [
      'The purchaser and rider are responsible for inspecting installed products before use and periodically thereafter.',
      'After any crash, collision, tip-over, significant impact, or unusually severe riding event, the motorcycle and installed components should be inspected before the motorcycle is operated again.',
      'Any component showing cracking, deformation, loose mounting, damaged wiring, compromised hardware, or other potentially unsafe conditions should not be used until appropriately repaired or replaced.',
    ],
  },
  {
    n: 15,
    title: 'No Modification of Motorcycle Manufacturer Obligations',
    body: [
      'KarooMoto is an aftermarket motorcycle-product business and is not the manufacturer of the customer’s motorcycle.',
      'KarooMoto makes no representation regarding whether installation of an aftermarket product may affect a motorcycle manufacturer’s warranty. Customers should consult the motorcycle manufacturer or dealer regarding their specific warranty.',
    ],
  },
  {
    n: 16,
    title: 'Intellectual Property',
    body: [
      'The KarooMoto name, branding, logos, original graphics, photographs, product materials, website content, and proprietary designs are owned by or licensed to KarooMoto and may not be reproduced, copied, manufactured, distributed, or used commercially without authorization except as permitted by law.',
    ],
  },
  {
    n: 17,
    title: 'Indemnification',
    body: [
      'To the fullest extent permitted by applicable law, you agree to indemnify and hold harmless KarooMoto and its owners, members, employees, contractors, and affiliates from third-party claims, liabilities, damages, or reasonable costs arising from your unlawful use of a KarooMoto product, your material violation of these Terms, or modifications or installations performed by you in a manner contrary to provided instructions.',
      'This provision does not require you to indemnify KarooMoto for liability that cannot legally be shifted to you.',
    ],
  },
  {
    n: 18,
    title: 'Governing Law',
    body: [
      'These Terms & Conditions shall be governed by the laws of the State of Missouri, without regard to conflict-of-law principles, except where applicable consumer-protection laws or other mandatory laws require otherwise.',
      'Any jurisdiction or venue rights that cannot legally be waived remain unaffected.',
    ],
  },
  {
    n: 19,
    title: 'Severability',
    body: [
      'If any provision of these Terms is determined to be invalid, illegal, or unenforceable, that provision shall be enforced to the maximum extent permitted by law, and the remaining provisions shall continue in effect.',
    ],
  },
  {
    n: 20,
    title: 'Changes to These Terms',
    body: [
      'KarooMoto may revise these Terms & Conditions from time to time.',
      'Changes will apply prospectively and will not eliminate contractual or statutory rights associated with purchases already completed where prohibited by applicable law.',
    ],
  },
  {
    n: 21,
    title: 'Entire Agreement',
    body: [
      'These Terms & Conditions, together with the applicable product listing, Shipping Policy, Privacy Policy, Returns & Warranty Policy, and any other policies expressly incorporated by reference, constitute the terms applicable to purchases made through KarooMoto’s website.',
    ],
  },
]

export const TERMS_ACKNOWLEDGMENT = {
  title: 'Acknowledgment',
  body: [
    'By completing a purchase from KarooMoto, you acknowledge that you have read, understood, and agree to these Terms & Conditions, including the provisions concerning installation responsibility, assumption of risk, and limitations of liability.',
  ],
}

// --- Acceptance gate --------------------------------------------------------

export const TERMS_ACCEPT = {
  /** Split so the middle clause can be the link without breaking the sentence. */
  before: 'I have read and agree to the ',
  linkLabel: 'KarooMoto Terms & Conditions',
  after: '.',
  /** Shown when checkout is attempted without acceptance. */
  required: 'Please accept the Terms & Conditions to continue to checkout.',
  openLabel: 'Read the KarooMoto Terms & Conditions',
  closeLabel: 'Close Terms & Conditions',
}
