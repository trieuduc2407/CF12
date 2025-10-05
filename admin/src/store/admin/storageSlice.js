import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    ingredients: [],
}

export const addIngredient = createAsyncThunk('/storage/addIngredient', async (formData) => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/admin/storage/add',
        formData,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
    return response?.data
})

export const getIngredient = createAsyncThunk('/storage/getIngredient', async (id) => {
    const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/storage/get/${id}`,
        {},
        { withCredentials: true })
    return response?.data
})

export const fetchAllIngredients = createAsyncThunk('/storage/fetchAllIngredients', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/storage/all',
        { withCredentials: true })
    return response?.data
})

export const updateIngredient = createAsyncThunk('/storage/updateIngredient', async ({ id, formData }) => {
    const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/storage/update/${id}`,
        formData,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
    return response?.data
})

export const deleteIngredient = createAsyncThunk('/storage/deleteIngredient', async (id) => {
    const response = await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/storage/delete/${id}`,
        { withCredentials: true })
    return response?.data
})

const adminStorageSlice = createSlice({
    name: 'adminStorage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllIngredients.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAllIngredients.fulfilled, (state, action) => {
                state.isLoading = false
                state.ingredients = action.payload?.data
            })
            .addCase(fetchAllIngredients.rejected, (state) => {
                state.isLoading = false
                state.ingredients = []
            })
    }
})

export default adminStorageSlice.reducer