import { calculateMaxQuantity } from '../../helpers/admin/checkProductAvailability.js'
import * as productService from '../../services/client/productService.js'

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'Thiếu ID sản phẩm',
            })
        }

        const product = await productService.getProductById(id)
        if (!product) {
            return res.json({
                success: false,
                message: 'Không tìm thấy sản phẩm',
            })
        }

        let temperatureOptions = []
        if (Array.isArray(product.temperature)) {
            product.temperature.forEach((temp) => {
                if (temp.type === 'hot_ice') {
                    const defaultTemp = temp.defaultTemp || 'hot'
                    temperatureOptions.push(
                        { type: 'hot', isDefault: defaultTemp === 'hot' },
                        { type: 'ice', isDefault: defaultTemp === 'ice' }
                    )
                } else {
                    temperatureOptions.push({
                        type: temp.type,
                        isDefault: true,
                    })
                }
            })
        }

        return res.json({
            success: true,
            data: {
                name: product.name,
                imageUrl: product.imageUrl,
                basePrice: product.basePrice,
                category: product.category,
                sizes: product.sizes,
                temperature: temperatureOptions,
            },
        })
    } catch (error) {
        console.error('[productController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()

        const enrichedProducts = await Promise.all(
            products.map(async (product) => {
                const maxQuantity = await calculateMaxQuantity(product._id)
                return {
                    available: product.available,
                    basePrice: product.basePrice,
                    category: product.category,
                    imageUrl: product.imageUrl,
                    name: product.name,
                    size: product.size,
                    temperature: product.temperature,
                    _id: product._id,
                    createdAt: product.createdAt,
                    signature: product.signature,
                    maxQuantity,
                }
            })
        )

        return res.json({
            success: true,
            data: enrichedProducts,
        })
    } catch (error) {
        console.error('[productController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getProductByName = async (req, res) => {
    try {
        const name = req.query.name
        if (!name) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập tên sản phẩm',
            })
        }
        const products = await productService.getProductByName(name)
        return res.json({
            success: true,
            data: products,
        })
    } catch (error) {
        console.error('[productController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
