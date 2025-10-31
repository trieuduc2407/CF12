import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    isLoading: false,
    products: [],
    selectedProduct: null,
    error: null,
}

export const getProductById = createAsyncThunk(
    '/clientProduct/getProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/client/products/${productId}`
            )
            return response?.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const getAllProducts = createAsyncThunk(
    '/clientProduct/getAllProducts',
    async () => {
        const response = await axios.get(`${API_URL}/api/client/products/all`)
        return response?.data
    }
)

const productSlice = createSlice({
    name: 'clientProduct',
    initialState,
    reducers: {
        updateProductAvailability: (state, action) => {
            const { productId, available, maxQuantity } = action.payload
            const product = state.products.find((p) => p._id === productId)
            if (product) {
                product.available = available
                product.maxQuantity = maxQuantity
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload?.data || []
                state.error = null
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false
                state.products = []
                state.error = action.payload || action.error.message
            })
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true
                state.selectedProduct = null
                state.error = null
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedProduct = action.payload?.data || null
                state.error = null
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false
                state.selectedProduct = null
                state.error = action.payload || action.error.message
            })
    },
})

export const { updateProductAvailability } = productSlice.actions

export default productSlice.reducer
