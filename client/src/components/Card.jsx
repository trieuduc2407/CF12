import { CirclePlus } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

import formatNumber from '../utils/formatNumber'

const Card = ({ product }) => {
    const { isLoading } = useSelector((state) => state.clientProduct)

    return (
        <div className="card w-full justify-self-center bg-white shadow-sm">
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
            <div className="card-body flex flex-row justify-between px-2.5 py-2">
                <div>
                    <p className="card-title text-sm">{product.name}</p>
                    <p className="font-medium">
                        {formatNumber(product.basePrice)} VND
                    </p>
                </div>
                <div className="card-actions items-end">
                    <button
                        className="rounded-2xl bg-amber-500"
                        onClick={() => {
                            console.log('Add to cart clicked', product._id)
                        }}
                    >
                        <CirclePlus color="#ffffff" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
