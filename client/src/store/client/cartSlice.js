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

export const addToCart = createAsyncThunk(
    'clientCart/addToCart',
    async ({ tableName, data }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/client/cart/${tableName}/add`,
                data
            )
            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Không thể thêm vào giỏ hàng'
            )
        }
    }
)

export const updateCartItem = createAsyncThunk(
    'clientCart/updateCartItem',
    async ({ tableName, data, clientId }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/client/cart/${tableName}/update`,
                data,
                {
                    headers: {
                        'x-client-id': clientId,
                    },
                }
            )
            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Không thể cập nhật giỏ hàng'
            )
        }
    }
)

const cartSlice = createSlice({
    name: 'clientCart',
    initialState,
    reducers: {
        updateCart: (state, action) => {
            // Socket emits { cart, action, tableName }
            const cart = action.payload?.cart || action.payload

            state.items = cart.items || []
            state.totalPrice = cart.totalPrice || 0
            state.version = cart.version || 0
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
        removeItem: (state, action) => {
            const { itemId } = action.payload
            state.items = state.items.filter((i) => i.itemId !== itemId)
            // Recalculate totalPrice
            state.totalPrice = state.items.reduce(
                (acc, item) => acc + item.subTotal,
                0
            )
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

                // Backend returns { currentCart, previousOrders }
                const cart = action.payload?.currentCart

                if (cart) {
                    state.items = cart.items || []
                    state.totalPrice = cart.totalPrice || 0
                    state.version = cart.version || 0
                } else {
                    // No cart exists yet
                    state.items = []
                    state.totalPrice = 0
                    state.version = 0
                }
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCartItem.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { updateCart, clearCart, lockItem, unlockItem, removeItem } =
    cartSlice.actions
export default cartSlice.reducer
