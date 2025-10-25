import { Lock } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import socket from '../socket/socket'

const CartItem = ({ item }) => {
    const navigate = useNavigate()
    const { tableName } = useParams()

    const { clientId } = useSelector((state) => state.clientSession)
    const isLocked = item.locked || false
    const isLockedByOther = isLocked && item.lockedBy !== clientId

    const handleEdit = () => {
        if (isLockedByOther) {
            return  
        }

        socket.emit('cart:lockItem', {
            tableName,
            clientId,
            itemId: item.itemId,
        })

        navigate(
            `/tables/${tableName}/product/${item.product._id}/edit/${item.itemId}`
        )
    }

    return (
        <div
            className={`flex rounded-lg bg-white p-2.5 ${
                isLockedByOther ? 'opacity-50' : ''
            }`}
        >
            <div className="flex flex-1 gap-4">
                <img
                    className="w-20 rounded-lg"
                    src={item.product.imageUrl}
                    alt=""
                />
                <div className="flex flex-col justify-between">
                    <p className="text-sm">
                        <span className="text-primary">{item.quantity} x </span>
                        {item.product.name}
                    </p>
                    <p className="text-sm">
                        {item.selectedSize} -
                        {item.selectedTemperature === 'ice' ? ' Đá' : ' Nóng'}
                    </p>
                    <p className="text-sm font-semibold">
                        {item.subTotal.toLocaleString()} đ
                    </p>
                </div>
            </div>
            <div className="flex flex-col justify-end">
                {isLockedByOther ? (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Lock size={14} />
                        <span>Đang sửa</span>
                    </div>
                ) : (
                    <button
                        className="text-primary text-sm"
                        onClick={handleEdit}
                        disabled={isLockedByOther}
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>
        </div>
    )
}

export default CartItem
