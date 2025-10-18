import { Server } from 'socket.io'

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                process.env.ADMIN_URL,
                process.env.LOCAL_CLIENT_URL,
                process.env.LOCAL_ADMIN_URL,
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    })

    return io
}
