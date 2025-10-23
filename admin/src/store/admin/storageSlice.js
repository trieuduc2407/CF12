import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    ingredients: [],
}

export const addIngredient = createAsyncThunk(
    '/adminStorage/addIngredient',
    async (formData) => {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/storage/add',
            formData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        return response?.data
    }
)

export const getIngredient = createAsyncThunk(
    '/adminStorage/getIngredient',
    async (id) => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + `/api/admin/storage/get/${id}`
        )
        return response?.data
    }
)

export const getAllIngredients = createAsyncThunk(
    '/adminStorage/getAllIngredients',
    async () => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/storage/all'
        )
        return response?.data
    }
)

export const updateIngredient = createAsyncThunk(
    '/adminStorage/updateIngredient',
    async ({ id, formData }) => {
        const response = await axios.put(
            import.meta.env.VITE_BACKEND_URL +
                `/api/admin/storage/update/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        return response?.data
    }
)

export const deleteIngredient = createAsyncThunk(
    '/adminStorage/deleteIngredient',
    async (id) => {
        const response = await axios.delete(
            import.meta.env.VITE_BACKEND_URL + `/api/admin/storage/delete/${id}`
        )
        return response?.data
    }
)

export const searchIngredient = createAsyncThunk(
    '/adminStorage/searchIngredient',
    async (q) => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL +
                `/api/admin/storage/search?q=${q}`
        )
        return response?.data
    }
)

const adminStorageSlice = createSlice({
    name: 'adminStorage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllIngredients.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllIngredients.fulfilled, (state, action) => {
                state.isLoading = false
                state.ingredients = action.payload?.data
            })
            .addCase(getAllIngredients.rejected, (state) => {
                state.isLoading = false
                state.ingredients = []
            })
    },
})

export default adminStorageSlice.reducer
