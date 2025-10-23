import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createLoadingReducers, crudHelpers } from '../../helpers/apiHelpers'

const initialState = {
    isLoading: false,
    ingredients: [],
}

const ENDPOINT = '/api/admin/storage'

export const addIngredient = createAsyncThunk(
    '/adminStorage/addIngredient',
    crudHelpers.create(ENDPOINT, 'application/json')
)

export const getIngredient = createAsyncThunk(
    '/adminStorage/getIngredient',
    crudHelpers.getById(ENDPOINT)
)

export const getAllIngredients = createAsyncThunk(
    '/adminStorage/getAllIngredients',
    crudHelpers.getAll(ENDPOINT)
)

export const updateIngredient = createAsyncThunk(
    '/adminStorage/updateIngredient',
    crudHelpers.update(ENDPOINT, 'application/json')
)

export const deleteIngredient = createAsyncThunk(
    '/adminStorage/deleteIngredient',
    crudHelpers.delete(ENDPOINT)
)

// Custom search với query param khác (q thay vì query)
export const searchIngredient = createAsyncThunk(
    '/adminStorage/searchIngredient',
    async (q) => {
        const axios = (await import('axios')).default
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
        createLoadingReducers(builder, getAllIngredients, 'ingredients')
    },
})

export default adminStorageSlice.reducer
