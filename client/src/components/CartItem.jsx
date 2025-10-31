// ===== IMPORTS =====
import { Lock, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import socket from '../socket/socket'
import { lockItem, removeItem } from '../store/client/cartSlice'

// ===== COMPONENT =====
const CartItem = ({ item }) => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { clientId } = useSelector((state) => state.clientSession)

    // ===== ROUTER =====
    const navigate = useNavigate()
    const { tableName } = useParams()

    // ===== LOCAL STATE =====
    const [isDeleting, setIsDeleting] = useState(false)

    // ===== DERIVED STATE =====
    const isLocked = item.locked || false
    const isLockedByOther = isLocked && item.lockedBy !== clientId

    // ===== EARLY RETURN =====
    if (!item.product || !item.product._id) {
        return null
    }

    // ===== HANDLERS =====
    const handleEdit = () => {
        if (isLockedByOther) {
            return
        }

        dispatch(lockItem({ itemId: item.itemId, lockedBy: clientId }))

        socket.emit('cart:lockItem', {
            tableName,
            clientId,
            itemId: item.itemId,
        })

        navigate(
            `/tables/${tableName}/product/${item.product._id}/edit/${item.itemId}`
        )
    }

    const handleDelete = () => {
        if (isLockedByOther || isDeleting) {
            return
        }

        setIsDeleting(true)

        dispatch(removeItem({ itemId: item.itemId }))

        if (!isLocked) {
            dispatch(lockItem({ itemId: item.itemId, lockedBy: clientId }))
            socket.emit('cart:lockItem', {
                tableName,
                clientId,
                itemId: item.itemId,
            })
        }

        socket.emit('cart:deleteItem', {
            tableName,
            clientId,
            itemId: item.itemId,
        })

        document.getElementById('delete_modal').close()
        setTimeout(() => setIsDeleting(false), 1000)
    }

    // ===== RENDER =====
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
            <div className="flex flex-col justify-between gap-2">
                {isLockedByOther ? (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Lock size={14} />
                        <span>Đang sửa</span>
                    </div>
                ) : (
                    <>
                        <button
                            className="flex justify-end gap-1 text-sm text-red-500 disabled:opacity-50"
                            onClick={() =>
                                document
                                    .getElementById('delete_modal')
                                    .showModal()
                            }
                            disabled={isLockedByOther || isDeleting}
                        >
                            <Trash2 size={14} />
                            <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
                        </button>
                        <dialog id="delete_modal" className="modal">
                            <div className="modal-box rounded-lg bg-white text-center">
                                <h3 className="text-lg font-bold">
                                    Xác nhận xoá sản phẩm
                                </h3>
                                <p className="py-4 text-sm">
                                    Bạn có chắc muốn xoá sản phẩm{' '}
                                    <span className="font-semibold">
                                        {item.product.name}
                                    </span>{' '}
                                    khỏi giỏ hàng?
                                </p>
                                <div className="flex justify-around">
                                    <button
                                        className="w-30 bg-bg-base btn rounded-lg border-0"
                                        onClick={() =>
                                            document
                                                .getElementById('delete_modal')
                                                .close()
                                        }
                                    >
                                        Không
                                    </button>
                                    <button
                                        className="w-30 btn btn-primary rounded-lg border-0"
                                        onClick={() => handleDelete()}
                                    >
                                        Đồng ý
                                    </button>
                                </div>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                        <button
                            className="text-primary text-sm"
                            onClick={handleEdit}
                            disabled={isLockedByOther || isDeleting}
                        >
                            Chỉnh sửa
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

// ===== EXPORTS =====
export default CartItem
