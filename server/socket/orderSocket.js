import * as orderService from '../services/client/orderService.js'

/**
 * Socket handlers for order realtime events
 * Events:
 * - order:statusUpdate (admin) - Admin cập nhật status order
 * - order:new (broadcast to admin) - Có order mới từ client
 * - order:updated (broadcast to table) - Order status thay đổi
 * - storage:warning (broadcast to admin) - Nguyên liệu sắp hết
 */
export const orderSocket = (io, socket) => {
    /**
     * Admin update order status
     * @param {object} payload - { orderId, status, staffId }
     */
    socket.on('order:statusUpdate', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return

            const { orderId, status, staffId } = payload

            if (!orderId || !status) {
                socket.emit('order:updateError', {
                    message: 'Thiếu thông tin orderId hoặc status',
                })
                return
            }

            console.log(
                `📝 [orderSocket] Status update request: order=${orderId}, status=${status}, staff=${staffId}`
            )

            const updatedOrder = await orderService.updateOrderStatus(
                orderId,
                status,
                staffId
            )

            // Broadcast order status update to the table
            if (updatedOrder.tableName) {
                console.log(
                    `📤 [orderSocket] Broadcasting order:updated to table ${updatedOrder.tableName}`
                )
                io.to(updatedOrder.tableName).emit('order:updated', {
                    order: updatedOrder,
                    tableName: updatedOrder.tableName,
                })
            }

            // Broadcast to admin panel
            console.log(
                `📤 [orderSocket] Broadcasting order:statusChanged to admin`
            )
            io.emit('order:statusChanged', {
                order: updatedOrder,
            })

            // Send success response to requester
            socket.emit('order:updateSuccess', {
                order: updatedOrder,
            })
        } catch (error) {
            console.error('❌ [orderSocket] order:statusUpdate error:', error)
            socket.emit('order:updateError', {
                message: error.message || 'Lỗi khi cập nhật order',
            })
        }
    })

    /**
     * Client cancel order
     * @param {object} payload - { orderId }
     */
    socket.on('order:cancel', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return

            const { orderId } = payload

            if (!orderId) {
                socket.emit('order:cancelError', {
                    message: 'Thiếu thông tin orderId',
                })
                return
            }

            console.log(`🚫 [orderSocket] Cancel request: order=${orderId}`)

            const cancelledOrder = await orderService.cancelOrder(orderId)

            // Broadcast to admin panel
            console.log(
                `📤 [orderSocket] Broadcasting order:cancelled to admin`
            )
            io.emit('order:cancelled', {
                order: cancelledOrder,
            })

            // Broadcast to table
            if (cancelledOrder.tableName) {
                console.log(
                    `📤 [orderSocket] Broadcasting order:updated to table ${cancelledOrder.tableName}`
                )
                io.to(cancelledOrder.tableName).emit('order:updated', {
                    order: cancelledOrder,
                    tableName: cancelledOrder.tableName,
                })
            }

            // Send success response
            socket.emit('order:cancelSuccess', {
                order: cancelledOrder,
            })
        } catch (error) {
            console.error('❌ [orderSocket] order:cancel error:', error)
            socket.emit('order:cancelError', {
                message: error.message || 'Lỗi khi hủy order',
            })
        }
    })
}
