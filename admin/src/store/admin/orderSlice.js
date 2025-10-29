import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import applyFilters from '../../helpers/applyFilters.js'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const initialState = {
    orders: [],
    filteredOrders: [],
    filters: {
        status: 'all', 
        date: null,
    },
    loading: false,
    error: null,
}

export const getAllOrders = createAsyncThunk(
    'adminOrder/getAllOrders',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams()
            if (filters.status && filters.status !== 'all') {
                params.append('status', filters.status)
            }
            if (filters.tableName) {
                params.append('tableName', filters.tableName)
            }
            if (filters.startDate) {
                params.append('startDate', filters.startDate)
            }
            if (filters.endDate) {
                params.append('endDate', filters.endDate)
            }

            const response = await axios.get(
                `${API_URL}/api/admin/orders?${params.toString()}`
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

export const updateOrderStatus = createAsyncThunk(
    'adminOrder/updateOrderStatus',
    async ({ orderId, status, staffId }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/api/admin/orders/${orderId}/status`,
                { status, staffId }
            )

            if (!response.data.success) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Không thể cập nhật order'
            )
        }
    }
)

const orderSlice = createSlice({
    name: 'adminOrder',
    initialState,
    reducers: {
        addNewOrder: (state, action) => {
            state.orders.unshift(action.payload)
            applyFilters(state)
        },
        updateOrderInList: (state, action) => {
            const updatedOrder = action.payload
            const index = state.orders.findIndex(
                (order) => order._id === updatedOrder._id
            )
            if (index !== -1) {
                state.orders[index] = updatedOrder
            }
            applyFilters(state)
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            applyFilters(state)
        },
        clearFilters: (state) => {
            state.filters = {
                status: 'all',
                tableName: '',
                date: null,
            }
            applyFilters(state)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
                applyFilters(state)
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false
                const updatedOrder = action.payload
                const index = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                )
                if (index !== -1) {
                    state.orders[index] = updatedOrder
                }
                applyFilters(state)
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { addNewOrder, updateOrderInList, setFilters, clearFilters } =
    orderSlice.actions

export default orderSlice.reducer
