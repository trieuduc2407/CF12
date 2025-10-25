import * as productService from '../../services/client/productService.js'

export const getProductById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Thiếu ID sản phẩm',
        })
    }

    try {
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

        res.json({
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
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts()

        res.json({
            success: true,
            data: products.map((product) => ({
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
            })),
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Server error',
        })
    }
}
