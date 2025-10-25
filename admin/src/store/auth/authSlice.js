import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    staff: null,
}

export const loginStaff = createAsyncThunk(
    '/auth/loginStaff',
    async (formData) => {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/login',
            formData
        )
        if (response?.data?.success && response?.data?.token) {
            localStorage.setItem('adminToken', response.data.token)
        }
        return response?.data
    }
)

export const logoutStaff = createAsyncThunk('/auth/logoutStaff', async () => {
    const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/logout/',
        {}
    )
    localStorage.removeItem('adminToken')
    return response?.data
})

export const getMe = createAsyncThunk('/auth/getMe', async () => {
    const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/me'
    )
    return response?.data
})

export const changePassword = createAsyncThunk(
    '/staff/changePassword',
    async ({ id, formData }) => {
        const response = await axios.put(
            import.meta.env.VITE_BACKEND_URL +
                `/api/admin/auth/change-password/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        localStorage.removeItem('adminToken')
        return response?.data
    }
)

const authSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginStaff.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginStaff.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.staff = action.payload.data
            })
            .addCase(loginStaff.rejected, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.staff = null
            })
            .addCase(logoutStaff.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logoutStaff.fulfilled, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.staff = null
                localStorage.removeItem('adminToken')
            })
            .addCase(logoutStaff.rejected, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.staff = null
                localStorage.removeItem('adminToken')
            })
            .addCase(getMe.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.staff = action.payload.data
            })
            .addCase(getMe.rejected, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.staff = null
                localStorage.removeItem('adminToken')
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.staff = null
                localStorage.removeItem('adminToken')
            })
            .addCase(changePassword.rejected, (state) => {
                state.isLoading = false
            })
    },
})

export default authSlice.reducer
