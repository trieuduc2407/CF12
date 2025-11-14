export const notificationSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('staff:call', ({ tableName }) => {
            if (!tableName) {
                console.log(
                    '[notificationSocket] Thiếu tableName trong staff:call'
                )
                return
            }

            console.log(
                '[notificationSocket] Nhận yêu cầu gọi nhân viên từ bàn:',
                tableName
            )

            io.emit('staff:callReceived', {
                tableName,
                timestamp: Date.now(),
            })
        })
    })
}
