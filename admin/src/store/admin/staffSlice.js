import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    staffs: [],
}

export const addStaff = createAsyncThunk('/adminStaff/addStaff', async (formData) => {
    const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/staff/add',
        formData,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
    return response?.data
})

export const getAllStaff = createAsyncThunk('/adminStaff/getAllStaff', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/staff/all',
        { withCredentials: true })
    return response?.data
})

export const getStaff = createAsyncThunk('/adminStaff/getStaff', async (id) => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/staff/get/${id}`,
        { withCredentials: true })
    return response?.data
})

export const updateStaff = createAsyncThunk('/adminStaff/updateStaff', async ({ id, formData }) => {
    const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/staff/update/${id}`,
        formData,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
    return response?.data
})

export const deleteStaff = createAsyncThunk('/adminStaff/deleteStaff', async (id) => {
    const response = await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/api/admin/staff/delete/${id}`,
        { withCredentials: true }
    )
    return response?.data
})

const adminStaffSlice = createSlice({
    name: 'adminStaff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStaff.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllStaff.fulfilled, (state, action) => {
                state.isLoading = false
                state.staffs = action.payload?.data
            })
            .addCase(getAllStaff.rejected, (state) => {
                state.isLoading = false
                state.staffs = []
            })

    }
})

export default adminStaffSlice.reducer