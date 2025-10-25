import { ChevronLeft, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import CartItem from '../components/CartItem'
import socket from '../socket/socket'
import { getCart, updateCart } from '../store/client/cartSlice'
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
            // Always fetch fresh cart data when entering Cart page
            dispatch(getCart(tableName))

            // Request current lock status from server
            socket.emit('cart:requestLockStatus', { tableName })

            // Request latest cart data to ensure sync
            socket.emit('cart:requestLatestData', { tableName })
        }
    }, [dispatch, tableName])

    // Listen for socket cart updates to override API data
    useEffect(() => {
        if (!tableName) return

        const handleCartUpdate = (data) => {
            // Socket updates have priority over API calls
            dispatch(updateCart(data))
        }

        socket.on('cart:updated', handleCartUpdate)

        return () => {
            socket.off('cart:updated', handleCartUpdate)
        }
    }, [dispatch, tableName])

    // Refetch cart when page becomes visible (user switches tabs)
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
                        [...cartItems]
                            .sort((a, b) => {
                                const nameCompare =
                                    a.product.name.localeCompare(b.product.name)
                                if (nameCompare !== 0) return nameCompare

                                const sizeA = a.selectedSize || ''
                                const sizeB = b.selectedSize || ''
                                const sizeCompare = sizeA.localeCompare(sizeB)
                                if (sizeCompare !== 0) return sizeCompare

                                const tempA = a.selectedTemperature || ''
                                const tempB = b.selectedTemperature || ''
                                return tempA.localeCompare(tempB)
                            })
                            .map((item) => (
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
