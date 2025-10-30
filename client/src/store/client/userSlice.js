import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    userId: null,
    name: '',
    phone: '',
    points: 0,
    isLoading: false,
    error: null,
}

export const loginUser = createAsyncThunk(
    'clientUser/loginUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/client/user/login`,
                formData
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const userSlice = createSlice({
    name: 'clientUser',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.userId = null
            state.name = ''
            state.phone = ''
            state.points = 0
            localStorage.removeItem('userId')
        },
        setUserFromStorage: (state, action) => {
            const { userId, name, phone, points } = action.payload
            state.userId = userId
            state.name = name || ''
            state.phone = phone || ''
            state.points = points || 0
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload.success) {
                    const { userId, name, phone, points } = action.payload.data
                    state.userId = userId
                    state.name = name
                    state.phone = phone
                    state.points = points
                } else {
                    state.error = action.payload.message
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Lỗi khi đăng nhập'
            })
    },
})

export const { logoutUser, setUserFromStorage } = userSlice.actions
export default userSlice.reducer
