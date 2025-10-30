import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import * as authApi from '../../apis/authApi.js'

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    staff: null,
}

export const loginStaff = createAsyncThunk(
    '/auth/loginStaff',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await authApi.loginStaff(formData)
            if (response?.success && response?.token) {
                localStorage.setItem('adminToken', response.token)
            }
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Đăng nhập thất bại')
        }
    }
)

export const logoutStaff = createAsyncThunk(
    '/auth/logoutStaff',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.logoutStaff()
            localStorage.removeItem('adminToken')
            return response
        } catch (error) {
            localStorage.removeItem('adminToken')
            return rejectWithValue(error.message || 'Đăng xuất thất bại')
        }
    }
)

export const getMe = createAsyncThunk(
    '/auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const staffData = await authApi.getMe()
            return { success: true, data: staffData }
        } catch (error) {
            return rejectWithValue(
                error.message || 'Không thể lấy thông tin user'
            )
        }
    }
)

export const changePassword = createAsyncThunk(
    '/staff/changePassword',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await authApi.changePassword({ id, formData })
            localStorage.removeItem('adminToken')
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Đổi mật khẩu thất bại')
        }
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
