import Icon from './Icon'
import { useCart } from '../context/CartContext'

// Global cart toast, driven by CartContext.
export default function Toast() {
  const { toast } = useCart()
  if (!toast) return null
  return (
    <div className="toast-wrap" aria-live="polite">
      <div className="toast">
        <Icon name="check" size={18} />
        {toast}
      </div>
    </div>
  )
}
