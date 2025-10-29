import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    currentOrder: null,
    previousOrders: [],
    loading: false,
    error: null,
}

export const createOrder = createAsyncThunk(
    'clientOrder/createOrder',
    async ({ tableName, userId, notes }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/client/orders/create`,
                {
                    tableName,
                    userId,
                    notes,
                }
            )
            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Không thể gửi yêu cầu gọi món'
            )
        }
    }
)

// Get orders by table
export const getOrdersByTable = createAsyncThunk(
    'clientOrder/getOrdersByTable',
    async (tableName, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/client/orders?tableName=${tableName}`
            )
            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    'Không thể lấy danh sách orders'
            )
        }
    }
)

const orderSlice = createSlice({
    name: 'clientOrder',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.currentOrder = action.payload
            state.previousOrders.unshift(action.payload)
        },
        updateOrder: (state, action) => {
            const updatedOrder = action.payload
            const index = state.previousOrders.findIndex(
                (order) => order._id === updatedOrder._id
            )
            if (index !== -1) {
                state.previousOrders[index] = updatedOrder
            }
            if (state.currentOrder?._id === updatedOrder._id) {
                state.currentOrder = updatedOrder
            }
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null
        },
        clearOrders: (state) => {
            state.currentOrder = null
            state.previousOrders = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.currentOrder = action.payload
                state.previousOrders.unshift(action.payload)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getOrdersByTable.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getOrdersByTable.fulfilled, (state, action) => {
                state.loading = false
                state.previousOrders = action.payload
            })
            .addCase(getOrdersByTable.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { addOrder, updateOrder, clearCurrentOrder, clearOrders } =
    orderSlice.actions

export default orderSlice.reducer
