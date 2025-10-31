import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createLoadingReducers, crudHelpers } from '../../helpers/apiHelpers'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    isLoading: false,
    products: [],
}

const ENDPOINT = '/api/admin/products'

export const addProduct = createAsyncThunk(
    '/adminProduct/addProduct',
    crudHelpers.create(ENDPOINT, 'multipart/form-data')
)

export const getAllProducts = createAsyncThunk(
    '/adminProduct/getAllProducts',
    crudHelpers.getAll(ENDPOINT)
)

export const getProduct = createAsyncThunk(
    '/adminProduct/getProduct',
    crudHelpers.getById(ENDPOINT)
)

export const updateProduct = createAsyncThunk(
    '/adminProduct/updateProduct',
    crudHelpers.update(ENDPOINT, 'multipart/form-data')
)

export const deleteProduct = createAsyncThunk(
    '/adminProduct/deleteProduct',
    crudHelpers.delete(ENDPOINT)
)

export const searchProduct = createAsyncThunk(
    '/adminProduct/searchProduct',
    crudHelpers.search(ENDPOINT)
)

export const toggleSignature = createAsyncThunk(
    '/adminProduct/toggleSignature',
    async (id) => {
        const axios = (await import('axios')).default
        const response = await axios.put(
            `${API_URL}/api/admin/products/signature/${id}`,
            {}
        )
        return response?.data
    }
)

const adminProductSlice = createSlice({
    name: 'adminProduct',
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
        // getAllProducts - load toàn bộ danh sách
        createLoadingReducers(builder, getAllProducts, 'products')

        // Các actions khác chỉ set loading, không update products array
        // Refetch sẽ được gọi trong useCrudHandlers
        builder
            .addCase(addProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addProduct.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(addProduct.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(updateProduct.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(deleteProduct.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(toggleSignature.pending, (state) => {
                state.isLoading = true
            })
            .addCase(toggleSignature.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(toggleSignature.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export const { updateProductAvailability } = adminProductSlice.actions

export default adminProductSlice.reducer
