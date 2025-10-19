import { Minus, Plus } from 'lucide-react'
import React from 'react'

const QuantityInput = ({ className, formData, setFormData }) => {
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
                className="btn btn-xs btn-square border-0 bg-gray-200 text-gray-400 shadow-none outline-0"
                onClick={() =>
                    setFormData({
                        ...formData,
                        quantity: formData.quantity + 1,
                    })
                }
            >
                <Plus />
            </button>
        </div>
    )
}

export default QuantityInput
