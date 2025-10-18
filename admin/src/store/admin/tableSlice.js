import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    isLoading: false,
    tables: [],
}

export const addTable = createAsyncThunk(
    '/adminTable/addTable',
    async (formData) => {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/table/add',
            formData,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        )
        return response.data
    }
)

export const getAllTables = createAsyncThunk(
    '/adminTable/getAllTables',
    async () => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/table/all',
            { withCredentials: true }
        )
        return response.data
    }
)

export const getTableById = createAsyncThunk(
    '/adminTable/getTableById',
    async (id) => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + `/api/admin/table/get/${id}`,
            { withCredentials: true }
        )
        return response.data
    }
)

export const updateTable = createAsyncThunk(
    '/adminTable/updateTable',
    async ({ id, formData }) => {
        const response = await axios.put(
            import.meta.env.VITE_BACKEND_URL + `/api/admin/table/update/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        )
        return response.data
    }
)

export const deleteTable = createAsyncThunk(
    '/adminTable/deleteTable',
    async (id) => {
        const response = await axios.delete(
            import.meta.env.VITE_BACKEND_URL + `/api/admin/table/delete/${id}`,
            { withCredentials: true }
        )
        return response.data
    }
)

const adminTableSlice = createSlice({
    name: 'adminTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTables.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllTables.fulfilled, (state, action) => {
                state.isLoading = false
                state.tables = action.payload.data || []
            })
            .addCase(getAllTables.rejected, (state) => {
                state.isLoading = false
                state.tables = []
            })
    },
})

export default adminTableSlice.reducer
