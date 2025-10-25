import React from 'react'
import { useSelector } from 'react-redux'

const Cart = () => {
    const { items: cartItems, totalPrice } = useSelector(
        (state) => state.clientCart
    )

    console.log('Cart Items:', cartItems)
    console.log('Total Price:', totalPrice)

    return <div className="mt-5 text-black">Cart</div>
}

export default Cart
