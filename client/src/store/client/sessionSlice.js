import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tableName: null,
    clientId: null,
    userId: null,
}

const sessionSlice = createSlice({
    name: 'clientSession',
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.tableName = action.payload.tableName
            state.clientId = action.payload.clientId
            state.userId = action.payload.userId
        },
    },
})

export const { setSession } = sessionSlice.actions
export default sessionSlice.reducer
