import { configureStore } from '@reduxjs/toolkit'

import productSlice from './client/productSlice'
import sessionSlice from './client/sessionSlice'

const store = configureStore({
    reducer: {
        clientProduct: productSlice,
        clientSession: sessionSlice,
    },
})

export default store
