import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    products: [],
}

export const addProduct = createAsyncThunk('/admin/addProduct', async (formData) => {
    const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/products/add',
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
    return response?.data
})

export const getAllProducts = createAsyncThunk('/admin/getAllProducts', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/products/all',
        { withCredentials: true })
    return response?.data
})

export const getProduct = createAsyncThunk('/admin/getProduct', async (id) => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/products/get/${id}`,
        { withCredentials: true })
    return response?.data
})

export const updateProduct = createAsyncThunk('/admin/updateProduct', async ({ id, formData }) => {
    const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/products/update/${id}`,
        formData,
        { withCredentials: true })
    return response?.data
})

export const deleteProduct = createAsyncThunk('/admin/deleteProduct', async (id) => {
    const response = await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/products/delete/${id}`,
        { withCredentials: true })
    return response?.data
})

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload
            })
            .addCase(getAllProducts.rejected, (state) => {
                state.isLoading = false
                state.products = []
            })
    }
})

export default productSlice.reducer