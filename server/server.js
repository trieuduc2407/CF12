import 'dotenv/config'
import http from 'http'

import { createApp } from './app.js'
import { initSocket } from './socket/index.js'
import { socketHandler } from './socket/socketHandler.js'

const PORT = process.env.PORT || 4000

const startServer = async () => {
    const app = await createApp()
    const server = http.createServer(app)

    const io = initSocket(server)

    socketHandler(io, app)

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()
