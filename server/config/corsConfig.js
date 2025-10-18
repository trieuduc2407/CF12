import cors from 'cors'

export const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma',
    ],
    credentials: true,
}

export const corsMiddleware = cors(corsOptions)
