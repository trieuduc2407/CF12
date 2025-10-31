import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import * as orderApi from '../../apis/orderApi.js'
import * as sessionApi from '../../apis/sessionApi.js'
import applyFilters from '../../helpers/applyFilters.js'
import getTodayDate from '../../helpers/getTodayDate.js'

const initialState = {
    orders: [],
    filteredOrders: [],
    filters: {
        status: 'all',
        date: getTodayDate(),
    },
    loading: false,
    error: null,
}

export const getAllOrders = createAsyncThunk(
    'adminOrder/getAllOrders',
    async (filters = {}, { rejectWithValue }) => {
        try {
            return await orderApi.fetchAllOrders(filters)
        } catch (error) {
            return rejectWithValue(
                error.message || 'Không thể lấy danh sách orders'
            )
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
    'adminOrder/updateOrderStatus',
    async ({ orderId, status, staffId }, { rejectWithValue }) => {
        try {
            return await orderApi.updateOrderStatus(orderId, status, staffId)
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể cập nhật order')
        }
    }
)

export const getSessionPaymentPreview = createAsyncThunk(
    'adminOrder/getSessionPaymentPreview',
    async ({ sessionId, phone, pointsToUse = 0 }, { rejectWithValue }) => {
        try {
            const data = await sessionApi.getSessionPaymentPreview(
                sessionId,
                phone,
                pointsToUse
            )
            return { data }
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải preview')
        }
    }
)

export const checkoutSession = createAsyncThunk(
    'adminOrder/checkoutSession',
    async (
        { sessionId, phone, name, pointsToUse = 0 },
        { rejectWithValue }
    ) => {
        try {
            const result = await sessionApi.checkoutSession(sessionId, {
                phone,
                name,
                pointsToUse,
            })
            return result.data
        } catch (error) {
            return rejectWithValue(error.message || 'Thanh toán thất bại')
        }
    }
)

export const cancelOrder = createAsyncThunk(
    'adminOrder/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderApi.cancelOrder(orderId)
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể hủy đơn hàng')
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
                date: getTodayDate(), // Reset về ngày hiện tại
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
            .addCase(checkoutSession.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(checkoutSession.fulfilled, (state, action) => {
                state.loading = false
                // Update tất cả orders trong session thành 'paid'
                const session = action.payload.session
                state.orders = state.orders.map((order) => {
                    if (order.sessionId._id === session._id) {
                        return { ...order, status: 'paid' }
                    }
                    return order
                })
                applyFilters(state)
            })
            .addCase(checkoutSession.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false
                const cancelledOrder = action.payload
                const index = state.orders.findIndex(
                    (order) => order._id === cancelledOrder._id
                )
                if (index !== -1) {
                    state.orders[index] = cancelledOrder
                }
                applyFilters(state)
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { addNewOrder, updateOrderInList, setFilters, clearFilters } =
    orderSlice.actions

export default orderSlice.reducer
