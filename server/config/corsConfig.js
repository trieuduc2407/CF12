import cors from 'cors'

export const corsOptions = {
    origin: [
        process.env.ADMIN_URL,
        process.env.CLIENT_URL,
        process.env.LOCAL_CLIENT_URL || 'http://localhost:5173',
        process.env.LOCAL_ADMIN_URL || 'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma',
        'x-client-id', // For cart operations
    ],
    credentials: true,
}

export const corsMiddleware = cors(corsOptions)
