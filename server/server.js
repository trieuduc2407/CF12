import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import { router as adminAuthRoutes } from "./routes/admin/adminAuthRoutes.js"
import { router as adminStorageRoutes } from "./routes/admin/adminStorageRoutes.js"
import { router as adminStaffRoutes } from "./routes/admin/adminStaffRoutes.js"
import { router as adminProductRoutes } from "./routes/admin/adminProductRoutes.js"

const app = express()
const PORT = 4000

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
connectDB()

app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/storage', adminStorageRoutes)
app.use('/api/admin/staff', adminStaffRoutes)
app.use('/api/admin/products', adminProductRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})