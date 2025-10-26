import { ChevronLeft, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import CartItem from '../components/CartItem'
import sortItem from '../helpers/sortItem'
import socket from '../socket/socket'
import { getCart } from '../store/client/cartSlice'
import { setSession } from '../store/client/sessionSlice'

const Cart = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tableName: urlTableName } = useParams()

    const { items: cartItems, totalPrice } = useSelector(
        (state) => state.clientCart
    )
    const { tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )

    const tableName = storeTableName || urlTableName

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
                    <div className="mt-5 flex justify-between">
                        <p>Tổng tiền</p>
                        <p className="font-semibold">
                            {(totalPrice || 0).toLocaleString()} ₫
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex justify-center">
                    <button className="btn btn-primary w-full rounded-lg border-0 text-white">
                        Xác nhận gửi yêu cầu gọi món
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
