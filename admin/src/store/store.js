import { configureStore } from '@reduxjs/toolkit'

import productSlice from './admin/productSlice'
import adminStaffSlice from './admin/staffSlice'
import adminStorageSlice from './admin/storageSlice'
import adminTableSlice from './admin/tableSlice'
import authSlice from './auth/authSlice'

const store = configureStore({
    reducer: {
        adminAuth: authSlice,
        adminStorage: adminStorageSlice,
        adminStaff: adminStaffSlice,
        adminProduct: productSlice,
        adminTable: adminTableSlice,
    },
})

export default store
