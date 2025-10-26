import { ChevronLeft, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import CartItem from '../components/CartItem'
import sortItem from '../helpers/sortItem'
import socket from '../socket/socket'
import { getCart } from '../store/client/cartSlice'
import { createOrder, getOrdersByTable } from '../store/client/orderSlice'
import { setSession } from '../store/client/sessionSlice'

const Cart = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tableName: urlTableName } = useParams()

    const [notes, setNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { items: cartItems, totalPrice } = useSelector(
        (state) => state.clientCart
    )
    const { tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )
    const { loading: orderLoading } = useSelector((state) => state.clientOrder)

    const tableName = storeTableName || urlTableName

    const handleCreateOrder = async () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng trống, vui lòng thêm món trước khi gọi món')
            return
        }

        // Check if any item is locked
        const lockedItems = cartItems.filter((item) => item.locked)
        if (lockedItems.length > 0) {
            alert(
                'Có món đang được chỉnh sửa, vui lòng chờ hoàn tất trước khi gọi món'
            )
            return
        }

        setIsSubmitting(true)
        try {
            await dispatch(
                createOrder({
                    tableName,
                    userId: null, // Guest user
                    notes,
                })
            ).unwrap()

            // Success - show notification
            alert('Đã gửi yêu cầu gọi món thành công!')
            setNotes('')

            // Refresh cart to clear
            await dispatch(getCart(tableName))
        } catch (error) {
            alert(error || 'Không thể gửi yêu cầu gọi món')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (urlTableName && urlTableName !== storeTableName) {
            const storedClientId = localStorage.getItem('clientId')
            if (storedClientId) {
                dispatch(
                    setSession({
                        tableName: urlTableName,
                        clientId: storedClientId,
                    })
                )
            }
        }
    }, [dispatch, urlTableName, storeTableName])

    useEffect(() => {
        if (tableName) {
            dispatch(getCart(tableName))
            dispatch(getOrdersByTable(tableName))

            socket.emit('cart:requestLockStatus', { tableName })

            socket.emit('cart:requestLatestData', { tableName })
        }
    }, [dispatch, tableName])

    useEffect(() => {
        if (!tableName) return

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                dispatch(getCart(tableName))
            }
        }

        const handleFocus = () => {
            dispatch(getCart(tableName))
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('focus', handleFocus)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
            window.removeEventListener('focus', handleFocus)
        }
    }, [dispatch, tableName])

    return (
        <div className="bg-bg-base flex min-h-screen flex-col">
            <div className="flex justify-between bg-white px-2.5 py-5">
                <button onClick={() => navigate(`/tables/${tableName}/menu`)}>
                    <ChevronLeft />
                </button>
                <p>Món của bạn</p>
                <button className="text-red-600">
                    <Trash2 />
                </button>
            </div>
            <div className="mx-5 my-4 flex flex-1 flex-col">
                <div className="flex flex-1 flex-col gap-2.5">
                    {cartItems.length > 0 ? (
                        sortItem(cartItems).map((item) => (
                            <CartItem key={item.itemId} item={item} />
                        ))
                    ) : (
                        <p>Chưa có món nào trong giỏ</p>
                    )}
                </div>
                <div className="mt-5 flex flex-col gap-3">
                    <div className="flex justify-between">
                        <p>Tổng tiền</p>
                        <p className="font-semibold">
                            {(totalPrice || 0).toLocaleString()} ₫
                        </p>
                    </div>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                    />
                </div>
                <div className="mt-5 flex justify-center">
                    <button
                        className="btn btn-primary w-full rounded-lg border-0 text-white"
                        onClick={handleCreateOrder}
                        disabled={
                            isSubmitting ||
                            orderLoading ||
                            cartItems.length === 0
                        }
                    >
                        {isSubmitting || orderLoading
                            ? 'Đang gửi...'
                            : 'Xác nhận gửi yêu cầu gọi món'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
