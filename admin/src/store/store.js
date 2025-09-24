import { configureStore } from "@reduxjs/toolkit"
import adminStorageSlice from './admin/storageSlice'
import authSlice from './auth/authSlice'
import adminStaffSlice from './admin/staffSlice'


const store = configureStore({
    reducer: {
        adminStorage: adminStorageSlice,
        auth: authSlice,
        adminStaff: adminStaffSlice
    }
})

export default store