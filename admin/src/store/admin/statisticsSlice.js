import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import * as statisticsApi from '../../apis/statisticsApi'

const CACHE_DURATION = 5 * 60 * 1000

const initialState = {
    overview: {
        todayRevenue: 0,
        todaySales: 0,
    },
    revenue: {
        data: [],
        period: 'day',
    },
    topProducts: [],
    loading: false,
    error: null,
    lastFetch: null,
}

export const fetchOverview = createAsyncThunk(
    'adminStatistics/fetchOverview',
    async (_, { getState }) => {
        const state = getState().adminStatistics
        const now = Date.now()

        if (state.lastFetch && now - state.lastFetch < CACHE_DURATION) {
            return state.overview
        }

        const response = await statisticsApi.getOverview()
        return response.data
    }
)

export const fetchRevenue = createAsyncThunk(
    'adminStatistics/fetchRevenue',
    async (period = 'day') => {
        const response = await statisticsApi.getRevenue(period)
        return { data: response.data, period }
    }
)

export const fetchTopProducts = createAsyncThunk(
    'adminStatistics/fetchTopProducts',
    async (limit = 10) => {
        const response = await statisticsApi.getTopProducts(limit)
        return response.data
    }
)

const statisticsSlice = createSlice({
    name: 'adminStatistics',
    initialState,
    reducers: {
        incrementTodayStats: (state, action) => {
            const { revenue, sales } = action.payload
            state.overview.todayRevenue += revenue
            state.overview.todaySales += sales
        },
        invalidateCache: (state) => {
            state.lastFetch = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverview.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchOverview.fulfilled, (state, action) => {
                state.loading = false
                state.overview = action.payload
                state.lastFetch = Date.now()
            })
            .addCase(fetchOverview.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            .addCase(fetchRevenue.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchRevenue.fulfilled, (state, action) => {
                state.loading = false
                state.revenue.data = action.payload.data
                state.revenue.period = action.payload.period
            })
            .addCase(fetchRevenue.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

            .addCase(fetchTopProducts.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchTopProducts.fulfilled, (state, action) => {
                state.loading = false
                state.topProducts = Array.isArray(action.payload)
                    ? action.payload
                    : []
            })
            .addCase(fetchTopProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { incrementTodayStats, invalidateCache } = statisticsSlice.actions

export const selectOverview = (state) => state.adminStatistics.overview
export const selectRevenue = (state) => state.adminStatistics.revenue
export const selectTopProducts = (state) => state.adminStatistics.topProducts
export const selectLoading = (state) => state.adminStatistics.loading

export default statisticsSlice.reducer
