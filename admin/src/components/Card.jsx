import { Star } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

import formatNumber from '../utils/formatNumber'

const Card = ({
    product,
    getProductData,
    handleDelete,
    handleToggleSignature,
}) => {
    const { isLoading } = useSelector((state) => state.adminProduct)

    return (
        <div className="card relative w-80 bg-white shadow-sm">
            <button
                className={`btn btn-sm btn-circle absolute right-2 top-2 z-10 border-0 ${
                    product.signature
                        ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                        : 'bg-white text-gray-400 hover:bg-gray-100'
                }`}
                onClick={handleToggleSignature}
                title={
                    product.signature
                        ? 'Bỏ khỏi signature'
                        : 'Thêm vào signature'
                }
            >
                <Star
                    size={16}
                    fill={product.signature ? 'currentColor' : 'none'}
                />
            </button>
            <figure>
                {isLoading ? (
                    <div className="skeleton h-80 w-80"></div>
                ) : (
                    <img
                        className="w-full object-cover"
                        src={product.imageUrl}
                        alt=""
                    />
                )}
            </figure>
            <div className="card-body py-4">
                <p className="card-title">{product.name}</p>
                <p className="font-medium">
                    {formatNumber(product.basePrice)} VND
                </p>
                <div className="card-actions justify-between">
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            getProductData(product._id)
                            document.activeElement.blur()
                        }}
                    >
                        Cập nhật
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={() => {
                            handleDelete(product._id)
                            document.activeElement.blur()
                        }}
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
