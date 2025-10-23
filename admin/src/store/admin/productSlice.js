import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createLoadingReducers, crudHelpers } from '../../helpers/apiHelpers'

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
    crudHelpers.update(ENDPOINT)
)

export const deleteProduct = createAsyncThunk(
    '/adminProduct/deleteProduct',
    crudHelpers.delete(ENDPOINT)
)

export const searchProduct = createAsyncThunk(
    '/adminProduct/searchProduct',
    crudHelpers.search(ENDPOINT)
)

// Custom action không có trong CRUD helpers
export const toggleSignature = createAsyncThunk(
    '/adminProduct/toggleSignature',
    async (id) => {
        const axios = (await import('axios')).default
        const response = await axios.put(
            import.meta.env.VITE_BACKEND_URL +
                `/api/admin/products/signature/${id}`,
            {}
        )
        return response?.data
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        createLoadingReducers(builder, getAllProducts, 'products')
    },
})

export default productSlice.reducer
