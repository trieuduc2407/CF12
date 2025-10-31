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

            const updatedOrder = await orderService.updateOrderStatus(
                orderId,
                status,
                staffId
            )

            if (updatedOrder.tableName) {
                io.to(updatedOrder.tableName).emit('order:updated', {
                    order: updatedOrder,
                    tableName: updatedOrder.tableName,
                })
            }

            io.emit('order:statusChanged', {
                order: updatedOrder,
            })

            // Send success response to requester
            socket.emit('order:updateSuccess', {
                order: updatedOrder,
            })
        } catch (error) {
            console.error('[orderSocket] order:statusUpdate error:', error)
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

            const cancelledOrder = await orderService.cancelOrder(orderId)

            io.emit('order:cancelled', {
                order: cancelledOrder,
            })

            if (cancelledOrder.tableName) {
                io.to(cancelledOrder.tableName).emit('order:updated', {
                    order: cancelledOrder,
                    tableName: cancelledOrder.tableName,
                })
            }

            socket.emit('order:cancelSuccess', {
                order: cancelledOrder,
            })
        } catch (error) {
            console.error('[orderSocket] order:cancel error:', error)
            socket.emit('order:cancelError', {
                message: error.message || 'Lỗi khi hủy order',
            })
        }
    })
}
