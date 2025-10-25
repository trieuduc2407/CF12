import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    items: [],
    totalPrice: 0,
    version: 0,
    loading: false,
    error: null,
}

export const getCart = createAsyncThunk(
    'clientCart/getCart',
    async (tableName, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/client/cart/${tableName}/get`
            )
            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Không thể tải giỏ hàng'
            )
        }
    }
)

const cartSlice = createSlice({
    name: 'clientCart',
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.items = action.payload.items || []
            state.totalPrice = action.payload.totalPrice || 0
            state.version = action.payload.version || 0
            state.error = null
        },
        clearCart: (state) => {
            state.items = []
            state.totalPrice = 0
            state.version = 0
            state.error = null
        },
        lockItem: (state, action) => {
            const { itemId, lockedBy } = action.payload
            const item = state.items.find((i) => i.itemId === itemId)
            if (item) {
                item.locked = true
                item.lockedBy = lockedBy
            }
        },
        unlockItem: (state, action) => {
            const { itemId } = action.payload
            const item = state.items.find((i) => i.itemId === itemId)
            if (item) {
                item.locked = false
                item.lockedBy = null
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.items = action.payload.items || []
                    state.totalPrice = action.payload.totalPrice || 0
                    state.version = action.payload.version || 0
                }
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { updateCart, clearCart, lockItem, unlockItem } = cartSlice.actions
export default cartSlice.reducer
