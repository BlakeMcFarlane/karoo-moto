/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** e.g. `my-store.myshopify.com` */
  readonly VITE_SHOPIFY_DOMAIN?: string
  /** Public Storefront API access token. */
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN?: string
  /** `gid://shopify/ProductVariant/…` for the Rally Tower. */
  readonly VITE_SHOPIFY_VARIANT_RALLY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
