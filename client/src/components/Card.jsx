import { CirclePlus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const Card = ({ product }) => {
    const { isLoading } = useSelector((state) => state.clientProduct)
    const { tableName } = useParams()
    const navigate = useNavigate()

    const isAvailable = product.available !== false
    const maxQuantity = product.maxQuantity ?? Infinity

    const handleAddToCart = (productId) => {
        if (!isAvailable) return
        navigate(`/tables/${tableName}/product/${productId}`)
    }

    return (
        <div
            className={`card w-full justify-self-center rounded-lg bg-white shadow-sm ${!isAvailable ? 'opacity-60' : 'cursor-pointer'}`}
            onClick={() => {
                handleAddToCart(product._id)
            }}
        >
            <figure className="relative">
                {isLoading ? (
                    <div className="skeleton h-80 w-80"></div>
                ) : (
                    <>
                        <img
                            className="w-full object-cover"
                            src={product.imageUrl}
                            alt=""
                        />
                        {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <span className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white">
                                    Hết hàng
                                </span>
                            </div>
                        )}
                        {isAvailable && maxQuantity <= 10 && (
                            <div className="absolute right-2 top-2">
                                <span
                                    className={`badge ${maxQuantity <= 5 ? 'badge-error' : 'badge-warning'} gap-1 text-white`}
                                >
                                    Còn {maxQuantity} phần
                                </span>
                            </div>
                        )}
                    </>
                )}
            </figure>
            <div className="card-body flex flex-row justify-between px-2.5 py-2">
                <div>
                    <p className="card-title text-sm">{product.name}</p>
                    <p className="font-medium">
                        {(product.basePrice || 0).toLocaleString()} VND
                    </p>
                </div>
                <div className="card-actions items-end">
                    <button
                        className={`rounded-2xl ${isAvailable ? 'bg-amber-500' : 'bg-gray-400'}`}
                        disabled={!isAvailable}
                    >
                        <CirclePlus color="#ffffff" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
