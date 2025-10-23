import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { createLoadingReducers, crudHelpers } from '../../helpers/apiHelpers'

const initialState = {
    isLoading: false,
    tables: [],
}

const ENDPOINT = '/api/admin/table'

export const addTable = createAsyncThunk(
    '/adminTable/addTable',
    crudHelpers.create(ENDPOINT, 'application/json')
)

export const getAllTables = createAsyncThunk(
    '/adminTable/getAllTables',
    crudHelpers.getAll(ENDPOINT)
)

export const getTableById = createAsyncThunk(
    '/adminTable/getTableById',
    crudHelpers.getById(ENDPOINT)
)

export const updateTable = createAsyncThunk(
    '/adminTable/updateTable',
    crudHelpers.update(ENDPOINT, 'application/json')
)

export const deleteTable = createAsyncThunk(
    '/adminTable/deleteTable',
    crudHelpers.delete(ENDPOINT)
)

const adminTableSlice = createSlice({
    name: 'adminTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        createLoadingReducers(builder, getAllTables, 'tables')
    },
})

export default adminTableSlice.reducer
