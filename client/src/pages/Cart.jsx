import { ChevronLeft, Trash2 } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import CartItem from '../components/CartItem'

const Cart = () => {
    const { tableName: urlTableName } = useParams()
    const navigate = useNavigate()

    const { items: cartItems, totalPrice } = useSelector(
        (state) => state.clientCart
    )
    const { tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )

    const tableName = storeTableName || urlTableName

    console.log('Cart items:', cartItems)

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
                        cartItems.map((item) => (
                            <CartItem key={item.itemId} item={item} />
                        ))
                    ) : (
                        <p>Chưa có món nào trong giỏ</p>
                    )}
                    <div className="mt-5 flex justify-between">
                        <p>Tổng tiền</p>
                        <p>{totalPrice.toLocaleString()} ₫</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="btn-primary btn w-full rounded-lg border-0 text-white">
                        Xác nhận gửi yêu cầu gọi món
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
