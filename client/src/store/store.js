import { configureStore } from '@reduxjs/toolkit'

import cartSlice from './client/cartSlice'
import orderSlice from './client/orderSlice'
import productSlice from './client/productSlice'
import sessionSlice from './client/sessionSlice'
import userSlice from './client/userSlice'

const store = configureStore({
    reducer: {
        clientProduct: productSlice,
        clientSession: sessionSlice,
        clientCart: cartSlice,
        clientOrder: orderSlice,
        clientUser: userSlice,
    },
})

export default store
