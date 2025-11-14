import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'admin_notifications'

const loadFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.log('[notificationSlice] Lỗi khi load từ localStorage:', error)
        return {}
    }
}

const saveToLocalStorage = (items) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
        console.log('[notificationSlice] Lỗi khi lưu vào localStorage:', error)
    }
}

const initialState = {
    items: {},
}

const notificationSlice = createSlice({
    name: 'adminNotification',
    initialState,
    reducers: {
        loadNotifications: (state) => {
            state.items = loadFromLocalStorage()
        },
        addNotification: (state, action) => {
            const { tableName, timestamp } = action.payload
            state.items[tableName] = { timestamp }
            saveToLocalStorage(state.items)
        },
        removeNotification: (state, action) => {
            const tableName = action.payload
            delete state.items[tableName]
            saveToLocalStorage(state.items)
        },
    },
})

export const { loadNotifications, addNotification, removeNotification } =
    notificationSlice.actions

export const selectNotifications = (state) => state.adminNotification.items
export const selectUnreadCount = (state) =>
    Object.keys(state.adminNotification.items).length

export default notificationSlice.reducer
