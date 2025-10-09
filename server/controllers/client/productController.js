import productModel from '../../models/productModel.js'

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
            data: products
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