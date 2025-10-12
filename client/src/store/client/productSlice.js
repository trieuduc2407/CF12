import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const initialState = {
    isLoading: false,
    products: [],
    lastestProducts: [],
}

export const getAllProducts = createAsyncThunk('/clientProduct/getAllProducts', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/client/products/all',
    )
    return response?.data
})

export const getLastestProducts = createAsyncThunk('/clientProduct/getLastestProducts', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/client/products/latest',
    )
    return response?.data
})

const productSlice = createSlice({
    name: 'clientProduct',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload?.data || []
            })
            .addCase(getAllProducts.rejected, (state) => {
                state.isLoading = false
                state.products = []
            })
            .addCase(getLastestProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getLastestProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.lastestProducts = action.payload?.data || []
            })
            .addCase(getLastestProducts.rejected, (state) => {
                state.isLoading = false
                state.lastestProducts = []
            })
    }
})

export default productSlice.reducer