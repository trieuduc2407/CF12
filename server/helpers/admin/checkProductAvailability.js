import { productModel } from '../../models/productModel.js'
import { storageModel } from '../../models/storageModel.js'

/**
 * Tính số lượng TỐI ĐA có thể làm được của 1 product
 * @param {String} productId - ID của product cần check
 * @returns {Number} Số lượng tối đa (0 nếu không đủ, Infinity nếu không có ingredients)
 */
export const calculateMaxQuantity = async (productId) => {
    try {
        const product = await productModel.findById(productId)

        if (!product) {
            console.warn(
                `[checkProductAvailability] Product ${productId} not found`
            )
            return 0
        }

        // Edge case 1: Product không có ingredients → unlimited
        if (!product.ingredients || product.ingredients.length === 0) {
            return Infinity
        }

        let minQuantity = Infinity

        for (const ing of product.ingredients) {
            const storage = await storageModel.findById(ing.ingredientId)

            // Edge case 2: Storage bị xóa → không thể làm
            if (!storage) {
                console.warn(
                    `[checkProductAvailability] Storage ${ing.ingredientId} not found for product ${product.name}`
                )
                return 0
            }

            const requiredAmount = ing.amount || ing.quantity

            if (!requiredAmount || isNaN(requiredAmount)) {
                console.warn(
                    `[checkProductAvailability] Invalid ingredient amount for ${product.name}`
                )
                continue
            }

            // Tính số phần tối đa từ nguyên liệu này
            const maxFromThisIngredient = Math.floor(
                storage.quantity / requiredAmount
            )

            // Lấy min (nguyên liệu nào ít nhất sẽ quyết định)
            minQuantity = Math.min(minQuantity, maxFromThisIngredient)
        }

        return minQuantity === Infinity ? 0 : minQuantity
    } catch (error) {
        console.error(
            '[checkProductAvailability] Error in calculateMaxQuantity:',
            error
        )
        return 0
    }
}

/**
 * Kiểm tra 1 product có đủ nguyên liệu để làm ít nhất 1 phần không
 * @param {String} productId - ID của product cần check
 * @returns {Boolean} true = có thể làm ít nhất 1, false = không đủ
 */
export const checkSingleProductAvailability = async (productId) => {
    const maxQuantity = await calculateMaxQuantity(productId)
    return maxQuantity > 0
}

/**
 * Update availability cho 1 product
 * @param {String} productId - ID của product cần update
 * @returns {Object} { changed, product, oldAvailable, newAvailable, maxQuantity }
 */
export const updateProductAvailability = async (productId) => {
    try {
        const product = await productModel.findById(productId)

        if (!product) {
            throw new Error('Product không tồn tại')
        }

        const oldAvailable = product.available
        const maxQuantity = await calculateMaxQuantity(productId)
        const newAvailable = maxQuantity > 0

        if (oldAvailable !== newAvailable) {
            product.available = newAvailable
            await product.save()

            return {
                changed: true,
                product,
                oldAvailable,
                newAvailable,
                maxQuantity,
            }
        }

        return {
            changed: false,
            product,
            oldAvailable,
            newAvailable,
            maxQuantity,
        }
    } catch (error) {
        console.error(
            '[checkProductAvailability] Error in updateProductAvailability:',
            error
        )
        throw error
    }
}

/**
 * Update availability cho tất cả products sử dụng storage này
 * CHỈ GỌI KHI storage.quantity <= storage.threshold HOẶC vừa vượt threshold
 * @param {String} storageId - ID của storage
 * @returns {Array} Danh sách products có thay đổi availability
 */
export const updateProductsUsingStorage = async (storageId) => {
    try {
        const products = await productModel.find({
            'ingredients.ingredientId': storageId,
        })

        const changedProducts = []

        for (const product of products) {
            const result = await updateProductAvailability(product._id)
            if (result.changed) {
                changedProducts.push(result)
            }
        }

        return changedProducts
    } catch (error) {
        console.error(
            '[checkProductAvailability] Error in updateProductsUsingStorage:',
            error
        )
        return []
    }
}
