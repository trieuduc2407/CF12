import { configureStore } from "@reduxjs/toolkit"
import adminStorageSlice from './admin/storageSlice'
import authSlice from './auth/authSlice'
import adminStaffSlice from './admin/staffSlice'
import productSlice from './admin/productSlice'


const store = configureStore({
    reducer: {
        adminStorage: adminStorageSlice,
        auth: authSlice,
        adminStaff: adminStaffSlice,
        adminProduct: productSlice
    }
})

export default store