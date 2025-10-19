import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tableName: null,
    clientId: null,
}

const sessionSlice = createSlice({
    name: 'clientSession',
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.tableName = action.payload.tableName
            state.clientId = action.payload.clientId
        },
    },
})

export const { setSession } = sessionSlice.actions
export default sessionSlice.reducer
