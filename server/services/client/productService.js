import { productModel } from '../../models/productModel.js'

import mongoose from 'mongoose'

export const getProductById  = async (productId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('ID sản phẩm không hợp lệ')
        }
        const product = await productModel.findById(productId)
        return product
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy sản phẩm theo ID: ${error.message}`)
    }
}


export const getAllProducts = async () => {
    try {
        const products = await productModel.find()
        return products
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy sản phẩm: ${error.message}`)
    }
}
