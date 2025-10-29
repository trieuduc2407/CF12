import express from 'express'

import { connectDB } from './config/db.js'
import { applyMiddleware } from './config/middleware.js'
import { router as adminAuthRoutes } from './routes/admin/adminAuthRoutes.js'
import adminOrderRoutes from './routes/admin/adminOrderRoutes.js'
import { router as adminProductRoutes } from './routes/admin/adminProductRoutes.js'
import { router as adminStaffRoutes } from './routes/admin/adminStaffRoutes.js'
import { router as adminStorageRoutes } from './routes/admin/adminStorageRoutes.js'
import { router as adminTableRoutes } from './routes/admin/adminTableRoutes.js'
import { router as clientCartRoutes } from './routes/client/cartRoutes.js'
import { router as clientOrderRoutes } from './routes/client/orderRoutes.js'
import { router as clientProductRoutes } from './routes/client/productRoutes.js'
import { router as clientSessionRoutes } from './routes/client/sessionRoutes.js'
import { router as clientUserRoutes } from './routes/client/userRoutes.js'

export const createApp = async () => {
    const app = express()

    applyMiddleware(app)

    await connectDB()

    app.use('/api/admin/auth', adminAuthRoutes)
    app.use('/api/admin/storage', adminStorageRoutes)
    app.use('/api/admin/staff', adminStaffRoutes)
    app.use('/api/admin/products', adminProductRoutes)
    app.use('/api/admin/table', adminTableRoutes)
    app.use('/api/admin', adminOrderRoutes)

    app.use('/api/client/products', clientProductRoutes)
    app.use('/api/client/cart', clientCartRoutes)
    app.use('/api/client/orders', clientOrderRoutes)
    app.use('/api/client/session', clientSessionRoutes)
    app.use('/api/client/user', clientUserRoutes)

    return app
}
