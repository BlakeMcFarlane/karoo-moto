import { Link } from 'react-router-dom'
import type { Product } from '../data/types'
import { formatPrice } from '../data/products'
import { CATEGORY_MAP } from '../data/categories'
import ProductArt from './art/ProductArt'

const STOCK_LABEL: Record<Product['stockStatus'], { text: string; cls: string }> =
  {
    'in-stock': { text: 'In Stock', cls: 'tag-stock' },
    'low-stock': { text: 'Low Stock', cls: 'tag-mto' },
    'made-to-order': { text: 'Made to Order', cls: 'tag-mto' },
    backorder: { text: 'Backorder', cls: 'tag-mto' },
  }

export default function ProductCard({ product }: { product: Product }) {
  const stock = STOCK_LABEL[product.stockStatus]
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-media">
        <div className="product-badges">
          {product.bestSeller && <span className="tag tag-accent">Best Seller</span>}
          <span className={`tag ${stock.cls}`}>{stock.text}</span>
        </div>
        <ProductArt kind={product.art} />
      </div>
      <div className="product-body">
        <span className="product-cat">{CATEGORY_MAP[product.category].name}</span>
        <span className="product-name">{product.name}</span>
        <span className="product-tagline">{product.tagline}</span>
        <div className="product-foot">
          <span className="price">
            {product.salePrice ? (
              <>
                <span className="was">{formatPrice(product.price)}</span>
                <span className="sale">{formatPrice(product.salePrice)}</span>
              </>
            ) : (
              formatPrice(product.price)
            )}
          </span>
          <span className="btn btn-secondary btn-sm">View</span>
        </div>
      </div>
    </Link>
  )
}
