import { productModel } from '../../models/productModel.js'

const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find()
        if (!products) {
            return res.json({
                success: false,
                message: "Chưa có sản phẩm nào"
            })
        }

        res.json({
            success: true,
            data: products.map(product => ({
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
            }))
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

export { getAllProduct }