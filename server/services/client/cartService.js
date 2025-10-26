import { calculateItemSubTotal } from '../../helpers/client/calculateItemSubtotal.js'
import { transformCartResponse } from '../../helpers/client/transformCartResponse.js'
import { cartModel } from '../../models/cartModel.js'
import { productModel } from '../../models/productModel.js'
import { tableModel } from '../../models/tableModel.js'

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

        return transformCartResponse(cart)
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy giỏ hàng: ${error.message}`)
    }
}

export const addItem = async (tableName, data) => {
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
                clients: data.clientId ? [{ clientId: data.clientId }] : [],
                items: [],
                totalPrice: 0,
            })
        } else {
            // Add client if not exists
            if (
                data.clientId &&
                !cart.clients.some((c) => c.clientId === data.clientId)
            ) {
                cart.clients.push({ clientId: data.clientId })
            }
        }

        const product = await productModel.findById(data.productId)
        if (!product) throw new Error('Sản phẩm không tồn tại')
        if (!product.available) throw new Error('Sản phẩm hiện không khả dụng')

        const existingItem = cart.items.find((i) => i.itemId === data.itemId)
        if (existingItem) {
            // Merge: increase quantity
            const newQuantity = existingItem.quantity + (data.quantity || 1)
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
            // Add new item
            const subTotal = calculateItemSubTotal(product, data)
            cart.items.push({
                itemId: data.itemId,
                productId: data.productId,
                quantity: data.quantity || 1,
                selectedSize: data.size || data.selectedSize,
                selectedTemperature:
                    data.temperature || data.selectedTemperature,
                subTotal,
                locked: false,
                lockedBy: null,
            })
            cart.totalPrice += subTotal
        }

        cart.version += 1
        await cart.save()

        const populatedCart = await cartModel
            .findById(cart._id)
            .populate('items.productId', 'name basePrice imageUrl sizes')

        return transformCartResponse(populatedCart)
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi thêm sản phẩm vào giỏ hàng: ${error.message}`
        )
    }
}

// This function is used by socket handler (cartSocket.js) for realtime add via WebSocket
// Different signature: receives { tableName, clientId, data } as single object
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

        const populatedCart = await cartModel
            .findById(cart._id)
            .populate('items.productId', 'name basePrice imageUrl sizes')

        return transformCartResponse(populatedCart)
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

        const searchItemId = data.originalItemId || data.itemId
        const itemIndex = cart.items.findIndex((i) => i.itemId === searchItemId)
        if (itemIndex === -1)
            throw new Error('Sản phẩm không tồn tại trong giỏ hàng')

        const item = cart.items[itemIndex]
        const product = await productModel.findById(item.productId)
        if (!product) throw new Error('Sản phẩm không tồn tại')

        if (item.locked && item.lockedBy !== clientId) {
            throw new Error('Sản phẩm đang được người khác chỉnh sửa')
        }

        const updatedQuantity = data.quantity ?? item.quantity
        const updatedSize = data.selectedSize ?? item.selectedSize
        const updatedTemp = data.selectedTemperature ?? item.selectedTemperature

        const newItemId =
            data.itemId || `${item.productId}_${updatedSize}_${updatedTemp}`

        const existingItemIndex = cart.items.findIndex(
            (i, idx) => i.itemId === newItemId && idx !== itemIndex
        )

        if (existingItemIndex !== -1) {
            const existingItem = cart.items[existingItemIndex]

            const mergedQuantity = existingItem.quantity + updatedQuantity

            const mergedSubTotal = calculateItemSubTotal(product, {
                ...existingItem,
                quantity: mergedQuantity,
            })

            await cartModel.findOneAndUpdate(
                { _id: cart._id, 'items.itemId': newItemId },
                {
                    $set: {
                        'items.$.quantity': mergedQuantity,
                        'items.$.subTotal': mergedSubTotal,
                    },
                }
            )

            await cartModel.findByIdAndUpdate(cart._id, {
                $pull: { items: { itemId: searchItemId } },
                $inc: { version: 1 },
            })
        } else {
            const subTotal = calculateItemSubTotal(product, {
                ...item,
                quantity: updatedQuantity,
                selectedSize: updatedSize,
                selectedTemperature: updatedTemp,
            })

            await cartModel.findOneAndUpdate(
                { _id: cart._id, 'items.itemId': searchItemId },
                {
                    $set: {
                        'items.$.itemId': newItemId,
                        'items.$.quantity': updatedQuantity,
                        'items.$.selectedSize': updatedSize,
                        'items.$.selectedTemperature': updatedTemp,
                        'items.$.subTotal': subTotal,
                        'items.$.locked': false,
                        'items.$.lockedBy': null,
                    },
                    $inc: { version: 1 },
                }
            )
        }

        const updatedCart = await cartModel.findById(cart._id)
        updatedCart.totalPrice = updatedCart.items.reduce(
            (acc, curr) => acc + curr.subTotal,
            0
        )
        await updatedCart.save()

        const populatedCart = await cartModel
            .findById(cart._id)
            .populate('items.productId', 'name basePrice imageUrl sizes')

        return transformCartResponse(populatedCart)
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

        const item = cart.items.find((i) => i.itemId === itemId)
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

        const item = cart.items.find((i) => i.itemId === itemId)

        // Nếu item không tồn tại (đã bị xóa/update), trả về success để tránh lỗi
        if (!item) {
            console.log('⚠️ Item không tồn tại, bỏ qua unlock:', itemId)
            return { itemId, locked: false, lockedBy: null }
        }

        if (item.lockedBy && item.lockedBy !== clientId) {
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

        return { itemId, locked: false, lockedBy: null }
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi mở khóa sản phẩm trong giỏ hàng: ${error.message}`
        )
    }
}

export const deleteItem = async (tableName, clientId, itemId) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) throw new Error('Bàn không tồn tại')

        const cart = await cartModel.findOne({
            tableId: table._id,
            status: 'active',
        })
        if (!cart) throw new Error('Giỏ hàng không tồn tại')

        const item = cart.items.find((i) => i.itemId === itemId)
        if (!item) throw new Error('Sản phẩm không tồn tại trong giỏ hàng')

        // Kiểm tra lock: chỉ cho phép xóa nếu item không bị lock hoặc bị lock bởi chính client này
        if (item.locked && item.lockedBy !== clientId) {
            throw new Error('Sản phẩm đang được người khác chỉnh sửa')
        }

        // Xóa item khỏi cart
        await cartModel.findByIdAndUpdate(cart._id, {
            $pull: { items: { itemId } },
            $inc: { version: 1 },
        })

        // Tính lại totalPrice
        const updatedCart = await cartModel.findById(cart._id)
        updatedCart.totalPrice = updatedCart.items.reduce(
            (acc, curr) => acc + curr.subTotal,
            0
        )
        await updatedCart.save()

        // Populate và trả về cart mới
        const populatedCart = await cartModel
            .findById(cart._id)
            .populate('items.productId', 'name basePrice imageUrl sizes')

        return transformCartResponse(populatedCart)
    } catch (error) {
        console.log(error)
        throw new Error(
            `Xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng: ${error.message}`
        )
    }
}
