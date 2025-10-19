import { io } from 'socket.io-client'

// Nếu backend của bạn đang chạy local:
const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const socket = io(URL, {
    transports: ['websocket', 'polling'], // ưu tiên websocket, fallback polling nếu cần
    withCredentials: true,
})

export default socket
