import { cartModel } from '../../models/cartModel.js'
import { productModel } from '../../models/productModel.js'
import { tableModel } from '../../models/tableModel.js'

import { calculateItemSubTotal } from '../../helpers/client/calculateItemSubtotal.js'

export const getActiveCartByTable = async (tableName) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        const cart = await cartModel
            .findOne({
                tableId: table._id,
                status: 'active',
            })
            .populate('items.productId', 'name basePrice imageUrl')
        return cart
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy giỏ hàng: ${error.message}`)
    }
}

export const addItemViaSocket = async ({ tableName, clientId, data }) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        let cart = await cartModel.findOne({
            tableId: table._id,
            status: 'active',
        })
        if (!cart) {
            cart = await cartModel.create({
                tableId: table._id,
                clients: [{ clientId }],
                items: [],
                totalPrice: 0,
            })
        }

        const product = await productModel.findById(data.productId)
        if (!product) throw new Error('Sản phẩm không tồn tại')

        const existingItem = cart.items.find((i) => i.itemId === data.itemId)
        if (existingItem) {
            const newQuantity = existingItem.quantity + 1
            const subTotal = calculateItemSubTotal(product, {
                ...existingItem,
                quantity: newQuantity,
            })
            await cartModel.findOneAndUpdate(
                { _id: cart._id, 'items.itemId': data.itemId },
                {
                    $set: {
                        'items.$.quantity': newQuantity,
                        'items.$.subTotal': subTotal,
                    },
                }
            )
            cart.totalPrice += subTotal - existingItem.subTotal
        } else {
            const subTotal = calculateItemSubTotal(product, data)
            cart.items.push({
                ...data,
                subTotal,
                locked: false,
                lockedBy: null,
            })
            cart.totalPrice += subTotal
            cart.version += 1
        }

        await cart.save()
        return cart
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi thêm sản phẩm vào giỏ hàng: ${error.message}`
        )
    }
}

export const updateItem = async (tableName, clientId, data) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        const cart = await cartModel.findOne({
            tableId: table._id,
            status: 'active',
        })
        if (!cart) throw new Error('Giỏ hàng không tồn tại')

        const item = await cart.items.find((i) => i.itemId === data.itemId)
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ hàng')

        const product = await productModel.findById(item.productId)
        if (!product) throw new Error('Sản phẩm không tồn tại')

        if (item.locked && item.lockedBy !== clientId) {
            throw new Error('Sản phẩm đang được người khác chỉnh sửa')
        }

        if (data.quantity !== undefined) {
            item.quantity = data.quantity
        }
        if (data.selectedSize !== undefined) {
            item.selectedSize = data.selectedSize
        }
        if (data.selectedTemperature !== undefined) {
            item.selectedTemperature = data.selectedTemperature
        }

        const subTotal = calculateItemSubTotal(product, item)
        await cartModel.findOneAndUpdate(
            { _id: cart._id, 'items.itemId': data.itemId },
            {
                $set: {
                    'items.$.quantity': item.quantity,
                    'items.$.selectedSize': item.selectedSize,
                    'items.$.selectedTemperature': item.selectedTemperature,
                    'items.$.subTotal': subTotal,
                    'items.$.locked': false,
                    'items.$.lockedBy': null,
                },
                $inc: { version: 1 },
            }
        )
        cart.totalPrice = cart.items.reduce(
            (acc, curr) => acc + curr.subTotal,
            0
        )
        await cart.save()
        return cart
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi cập nhật sản phẩm trong giỏ hàng: ${error.message}`
        )
    }
}

export const lockItem = async (tableName, clientId, itemId) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        const cart = await cartModel.findOne({
            tableId: table._id,
            status: 'active',
        })
        if (!cart) throw new Error('Giỏ hàng không tồn tại')

        const item = await cart.items.find((i) => i.itemId === itemId)
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ hàng')

        if (item.locked && item.lockedBy !== clientId) {
            throw new Error('Sản phẩm đang được người khác chỉnh sửa')
        }

        await cartModel.findOneAndUpdate(
            { _id: cart._id, 'items.itemId': itemId },
            {
                $set: {
                    'items.$.locked': true,
                    'items.$.lockedBy': clientId,
                },
            }
        )
        await cart.save()
        return { itemId, locked: true, lockedBy: clientId }
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi khóa sản phẩm trong giỏ hàng: ${error.message}`
        )
    }
}

export const unlockItem = async (tableName, clientId, itemId) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        const cart = await cartModel.findOne({
            tableId: table._id,
            status: 'active',
        })
        if (!cart) throw new Error('Giỏ hàng không tồn tại')

        const item = await cart.items.find((i) => i.itemId === itemId)
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ hàng')

        if (item.lockedBy !== clientId) {
            throw new Error('Bạn không có quyền mở khóa sản phẩm này')
        }

        await cartModel.findOneAndUpdate(
            { _id: cart._id, 'items.itemId': itemId },
            {
                $set: {
                    'items.$.locked': false,
                    'items.$.lockedBy': null,
                },
            }
        )
        await cart.save()
        return { itemId, locked: false, lockedBy: null }
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi mở khóa sản phẩm trong giỏ hàng: ${error.message}`
        )
    }
}
