import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    products: [],
}

export const addProduct = createAsyncThunk('/admin/addProduct', async (formData) => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/admin/products/add',
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
    return response?.data
})

export const fetchAllProducts = createAsyncThunk('/admin/fetchAllProducts', async () => {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/admin/products/all',
        { withCredentials: true })
    return response?.data
})

export const getProduct = createAsyncThunk('/admin/getProduct', async (id) => {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/admin/products/get/${id}`,
        { withCredentials: true })
    return response?.data
})

export const deleteProduct = createAsyncThunk('/admin/deleteProduct', async (id) => {
    const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/admin/products/delete/${id}`,
        { withCredentials: true })
    return response?.data
})

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload
            })
    }
})

export default productSlice.reducer