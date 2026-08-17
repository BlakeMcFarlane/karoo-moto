// ---------------------------------------------------------------------------
// Shopify Storefront API adapter.
//
// Shopify is the commerce backend: it owns pricing, cart state, checkout,
// payment, shipping rates, taxes and orders. This site owns the entire visual
// experience up to the moment the customer clicks Checkout, at which point we
// hand them Shopify's hosted checkout URL for the cart we have been building
// server-side all along.
//
// The selected motorcycle travels as Shopify **cart line attributes**, which
// surface on the order in the Shopify admin, so whoever packs the crate can see
// exactly which mounting kit to fit.
//
// CONFIGURATION — set these in `.env.local` (see `.env.example`):
//   VITE_SHOPIFY_DOMAIN            my-store.myshopify.com
//   VITE_SHOPIFY_STOREFRONT_TOKEN  public Storefront API access token
//   VITE_SHOPIFY_VARIANT_RALLY     gid://shopify/ProductVariant/1234567890
//
// When those are absent the adapter reports `configured: false` and the cart
// falls back to local state, so the site runs and demos end-to-end without a
// store attached. Nothing silently pretends to have reached Shopify.
// ---------------------------------------------------------------------------

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined
const RALLY_VARIANT = import.meta.env.VITE_SHOPIFY_VARIANT_RALLY as
  | string
  | undefined

/** Storefront API version this adapter is written against. */
const API_VERSION = '2024-10'

export const shopify = {
  configured: Boolean(DOMAIN && TOKEN),
  variantForRallyTower: RALLY_VARIANT,
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyLine {
  id: string
  quantity: number
  merchandiseId: string
  title: string
  variantTitle?: string
  image?: string
  unitPrice: ShopifyMoney
  totalPrice: ShopifyMoney
  /** Line-item attributes — this is where the motorcycle selection lives. */
  attributes: { key: string; value: string }[]
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  subtotal: ShopifyMoney
  lines: ShopifyLine[]
}

export class ShopifyError extends Error {
  constructor(message: string, readonly detail?: unknown) {
    super(message)
    this.name = 'ShopifyError'
  }
}

async function storefront<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new ShopifyError(
      'Shopify is not configured. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.',
    )
  }

  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new ShopifyError(`Storefront API returned ${res.status}`)
  }

  const body = (await res.json()) as {
    data?: T
    errors?: { message: string }[]
  }

  if (body.errors?.length) {
    throw new ShopifyError(body.errors.map((e) => e.message).join('; '), body.errors)
  }
  if (!body.data) throw new ShopifyError('Storefront API returned no data')
  return body.data
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        attributes { key value }
        cost {
          amountPerQuantity { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url }
            product { title }
          }
        }
      }
    }
  }
`

/** Shape returned by the Storefront API before we flatten it. */
interface RawCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: ShopifyMoney }
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        attributes: { key: string; value: string }[]
        cost: { amountPerQuantity: ShopifyMoney; totalAmount: ShopifyMoney }
        merchandise: {
          id: string
          title: string
          image?: { url: string }
          product: { title: string }
        }
      }
    }[]
  }
}

const normalise = (cart: RawCart): ShopifyCart => ({
  id: cart.id,
  checkoutUrl: cart.checkoutUrl,
  totalQuantity: cart.totalQuantity,
  subtotal: cart.cost.subtotalAmount,
  lines: cart.lines.edges.map(({ node }) => ({
    id: node.id,
    quantity: node.quantity,
    merchandiseId: node.merchandise.id,
    title: node.merchandise.product.title,
    variantTitle:
      node.merchandise.title === 'Default Title'
        ? undefined
        : node.merchandise.title,
    image: node.merchandise.image?.url,
    unitPrice: node.cost.amountPerQuantity,
    totalPrice: node.cost.totalAmount,
    attributes: node.attributes,
  })),
})

export async function createCart(
  merchandiseId: string,
  quantity: number,
  attributes: { key: string; value: string }[],
): Promise<ShopifyCart> {
  const data = await storefront<{
    cartCreate: { cart: RawCart; userErrors: { message: string }[] }
  }>(
    `mutation CartCreate($input: CartInput!) {
       cartCreate(input: $input) {
         cart { ${CART_FIELDS} }
         userErrors { message }
       }
     }`,
    { input: { lines: [{ merchandiseId, quantity, attributes }] } },
  )
  const { cart, userErrors } = data.cartCreate
  if (userErrors?.length) throw new ShopifyError(userErrors[0].message)
  return normalise(cart)
}

export async function addLine(
  cartId: string,
  merchandiseId: string,
  quantity: number,
  attributes: { key: string; value: string }[],
): Promise<ShopifyCart> {
  const data = await storefront<{
    cartLinesAdd: { cart: RawCart; userErrors: { message: string }[] }
  }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) {
         cart { ${CART_FIELDS} }
         userErrors { message }
       }
     }`,
    { cartId, lines: [{ merchandiseId, quantity, attributes }] },
  )
  const { cart, userErrors } = data.cartLinesAdd
  if (userErrors?.length) throw new ShopifyError(userErrors[0].message)
  return normalise(cart)
}

export async function updateLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await storefront<{
    cartLinesUpdate: { cart: RawCart; userErrors: { message: string }[] }
  }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) {
         cart { ${CART_FIELDS} }
         userErrors { message }
       }
     }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  )
  const { cart, userErrors } = data.cartLinesUpdate
  if (userErrors?.length) throw new ShopifyError(userErrors[0].message)
  return normalise(cart)
}

export async function removeLine(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
  const data = await storefront<{
    cartLinesRemove: { cart: RawCart; userErrors: { message: string }[] }
  }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
         cart { ${CART_FIELDS} }
         userErrors { message }
       }
     }`,
    { cartId, lineIds: [lineId] },
  )
  const { cart, userErrors } = data.cartLinesRemove
  if (userErrors?.length) throw new ShopifyError(userErrors[0].message)
  return normalise(cart)
}

/** Re-read a cart we already own — used to rehydrate after a page reload. */
export async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId },
  )
  return data.cart ? normalise(data.cart) : null
}
