import { configureStore } from '@reduxjs/toolkit'

import productSlice from './client/productSlice'

const store = configureStore({
    reducer: {
        clientProduct: productSlice,
    },
})

export default store
