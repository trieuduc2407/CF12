import express from 'express'

import { connectDB } from './config/db.js'
import { applyMiddleware } from './config/middleware.js'
import { router as adminAuthRoutes } from './routes/admin/adminAuthRoutes.js'
import { router as adminProductRoutes } from './routes/admin/adminProductRoutes.js'
import { router as adminStaffRoutes } from './routes/admin/adminStaffRoutes.js'
import { router as adminStorageRoutes } from './routes/admin/adminStorageRoutes.js'
import { router as adminTableRoutes } from './routes/admin/adminTableRoutes.js'
import { router as clientCartRoutes } from './routes/client/cartRoutes.js'
import { router as clientProductRoutes } from './routes/client/productRoutes.js'

export const createApp = async () => {
    const app = express()

    applyMiddleware(app)

    await connectDB()

    app.use('/api/admin/auth', adminAuthRoutes)
    app.use('/api/admin/storage', adminStorageRoutes)
    app.use('/api/admin/staff', adminStaffRoutes)
    app.use('/api/admin/products', adminProductRoutes)
    app.use('/api/admin/table', adminTableRoutes)

    app.use('/api/client/products', clientProductRoutes)
    app.use('/api/client/cart', clientCartRoutes)

    return app
}
