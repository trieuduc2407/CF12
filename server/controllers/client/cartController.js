import * as cartService from '../../services/client/cartService.js'
import * as orderService from '../../services/client/orderService.js'

export const getActiveCart = async (req, res) => {
    try {
        const { tableName } = req.params
        if (!tableName) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp tên bàn',
            })
        }

        const cart = await cartService.getActiveCartByTable(tableName)

        if (!cart) {
            return res.json({
                success: true,
                data: {
                    currentCart: null,
                    previousOrders: [],
                },
            })
        }

        const previousOrders = await orderService.getOrdersByTable(tableName)

        return res.json({
            success: true,
            data: {
                currentCart: cart,
                previousOrders: previousOrders || [],
            },
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const addItem = async (req, res) => {
    try {
        const { tableName } = req.params
        const data = req.body

        await cartService.addItem(tableName, data)

        const io = req.app.locals.io
        if (io) {
            try {
                const cart = await cartService.getActiveCartByTable(tableName)
                if (cart) {
                    io.to(tableName).emit('cart:updated', {
                        cart,
                        action: 'add',
                        tableName,
                    })
                }
            } catch (socketError) {
                console.log('Socket emit error:', socketError)
            }
        }

        return res.json({
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const updateItem = async (req, res) => {
    try {
        const { tableName } = req.params
        const clientId = req.headers['x-client-id']
        const data = req.body

        await cartService.updateItem(tableName, clientId, data)

        const io = req.app.locals.io
        if (io) {
            try {
                const cart = await cartService.getActiveCartByTable(tableName)
                if (cart) {
                    io.to(tableName).emit('cart:updated', {
                        cart,
                        action: 'update',
                        tableName,
                    })

                    const updatedItemId = data.itemId || data.originalItemId
                    io.to(tableName).emit('cart:itemUnlocked', {
                        itemId: updatedItemId,
                        locked: false,
                        lockedBy: null,
                    })
                }
            } catch (socketError) {
                console.error('Socket emit error:', socketError)
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật sản phẩm trong giỏ hàng thành công',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const lockItem = async (req, res) => {
    try {
        const { tableName, itemId } = req.params
        const clientId = req.headers['x-client-id']

        await cartService.lockItem(tableName, clientId, itemId)
        return res.json({
            success: true,
            message: 'Khóa sản phẩm trong giỏ hàng thành công',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const unlockItem = async (req, res) => {
    try {
        const { tableName, itemId } = req.params
        const clientId = req.headers['x-client-id']

        await cartService.unlockItem(tableName, clientId, itemId)
        return res.json({
            success: true,
            message: 'Mở khóa sản phẩm trong giỏ hàng thành công',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
