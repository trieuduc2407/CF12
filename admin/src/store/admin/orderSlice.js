import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const initialState = {
    orders: [],
    filteredOrders: [],
    filters: {
        status: 'all', // 'all' | 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
        tableName: '',
        date: null,
    },
    loading: false,
    error: null,
}

// Get all orders with filters
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

// Update order status (REST fallback)
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
        // Realtime: Add new order when receiving order:new event
        addNewOrder: (state, action) => {
            console.log('🆕 [orderSlice] Adding new order:', action.payload)
            state.orders.unshift(action.payload)
            applyFilters(state)
        },
        // Realtime: Update order when receiving order:statusChanged event
        updateOrderInList: (state, action) => {
            console.log('🔄 [orderSlice] Updating order:', action.payload)
            const updatedOrder = action.payload
            const index = state.orders.findIndex(
                (order) => order._id === updatedOrder._id
            )
            if (index !== -1) {
                state.orders[index] = updatedOrder
            }
            applyFilters(state)
        },
        // Set filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
            applyFilters(state)
        },
        // Clear filters
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
            // Get all orders
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
            // Update order status
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

// Helper function to apply filters
const applyFilters = (state) => {
    let filtered = [...state.orders]

    // Filter by status
    if (state.filters.status && state.filters.status !== 'all') {
        filtered = filtered.filter(
            (order) => order.status === state.filters.status
        )
    }

    // Filter by table name
    if (state.filters.tableName) {
        filtered = filtered.filter((order) =>
            order.tableName
                .toLowerCase()
                .includes(state.filters.tableName.toLowerCase())
        )
    }

    // Filter by date
    if (state.filters.date) {
        const filterDate = new Date(state.filters.date)
        filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt)
            return orderDate.toDateString() === filterDate.toDateString()
        })
    }

    state.filteredOrders = filtered
}

export const { addNewOrder, updateOrderInList, setFilters, clearFilters } =
    orderSlice.actions

export default orderSlice.reducer
