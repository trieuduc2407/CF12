import { configureStore } from '@reduxjs/toolkit'

import cartSlice from './client/cartSlice'
import productSlice from './client/productSlice'
import sessionSlice from './client/sessionSlice'

const store = configureStore({
    reducer: {
        clientProduct: productSlice,
        clientSession: sessionSlice,
        clientCart: cartSlice,
    },
})

export default store
