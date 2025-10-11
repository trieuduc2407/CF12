import React from 'react'
import { useSelector } from 'react-redux'

import formatNumber from '../utils/formatNumber'

const Card = ({ product, getProductData, handleDelete }) => {
    const { isLoading } = useSelector((state) => state.adminProduct)
    console.log(isLoading)
    return (
        <div className="card w-80 bg-white shadow-sm">
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
