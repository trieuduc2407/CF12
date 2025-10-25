import { CirclePlus } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const Card = ({ product }) => {
    const { isLoading } = useSelector((state) => state.clientProduct)
    const { tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )
    const { tableName: urlTableName } = useParams()
    const navigate = useNavigate()

    const tableName = storeTableName || urlTableName

    const handleAddToCart = (productId) => {
        if (!tableName) {
            console.error('Table name is not available')
            return
        }
        navigate(`/tables/${tableName}/product/${productId}`)
    }

    return (
        <div
            className="card w-full justify-self-center rounded-lg bg-white shadow-sm"
            onClick={() => {
                handleAddToCart(product._id)
            }}
        >
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
                        {product.basePrice.toLocaleString()} VND
                    </p>
                </div>
                <div className="card-actions items-end">
                    <button className="rounded-2xl bg-amber-500">
                        <CirclePlus color="#ffffff" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
