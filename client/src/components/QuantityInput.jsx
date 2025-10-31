// ===== IMPORTS =====
import { Minus, Plus } from 'lucide-react'

// ===== COMPONENT =====
const QuantityInput = ({ className, formData, setFormData, maxQuantity }) => {
    // ===== DERIVED STATE =====
    const max = maxQuantity ?? Infinity
    const isAtMax = formData.quantity >= max

    // ===== RENDER =====
    return (
        <div className={className}>
            <button
                type="button"
                className="btn btn-xs btn-square border-0 bg-gray-200 text-gray-400 shadow-none"
                onClick={() =>
                    formData.quantity > 1
                        ? setFormData({
                              ...formData,
                              quantity: formData.quantity - 1,
                          })
                        : null
                }
            >
                <Minus />
            </button>
            <p>{formData.quantity}</p>
            <button
                type="button"
                className="btn btn-xs btn-square border-0 bg-gray-200 text-gray-400 shadow-none outline-0 disabled:bg-gray-100 disabled:text-gray-300"
                disabled={isAtMax}
                onClick={() =>
                    setFormData({
                        ...formData,
                        quantity: formData.quantity + 1,
                    })
                }
                title={isAtMax ? `Chỉ còn ${max} phần` : ''}
            >
                <Plus />
            </button>
        </div>
    )
}

// ===== EXPORTS =====
export default QuantityInput
