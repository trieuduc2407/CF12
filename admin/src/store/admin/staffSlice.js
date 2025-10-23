import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createLoadingReducers, crudHelpers } from '../../helpers/apiHelpers'

const initialState = {
    isLoading: false,
    staffs: [],
}

const ENDPOINT = '/api/admin/staff'

export const addStaff = createAsyncThunk(
    '/adminStaff/addStaff',
    crudHelpers.create(ENDPOINT, 'application/json')
)

export const getAllStaff = createAsyncThunk(
    '/adminStaff/getAllStaff',
    crudHelpers.getAll(ENDPOINT)
)

export const getStaff = createAsyncThunk(
    '/adminStaff/getStaff',
    crudHelpers.getById(ENDPOINT)
)

export const updateStaff = createAsyncThunk(
    '/adminStaff/updateStaff',
    crudHelpers.update(ENDPOINT, 'application/json')
)

export const deleteStaff = createAsyncThunk(
    '/adminStaff/deleteStaff',
    crudHelpers.delete(ENDPOINT)
)

const adminStaffSlice = createSlice({
    name: 'adminStaff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        createLoadingReducers(builder, getAllStaff, 'staffs')
    },
})

export default adminStaffSlice.reducer
