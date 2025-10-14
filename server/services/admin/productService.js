import { productModel } from '../../models/productModel.js'

export const addProduct = async (data) => {
    try {
        const existingProduct = await productModel.findOne({ name: data.name })
        if (existingProduct) {
            throw new Error('Sản phẩm đã tồn tại')
        }

        const newProduct = await productModel.create(data)
        return newProduct
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi thêm sản phẩm: ${error.message}`)
    }
}

export const getProductById = async (id) => {
    try {
        const product = await productModel.findById(id)
        if (!product) {
            throw new Error('Sản phẩm không tồn tại')
        }

        return product
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy sản phẩm: ${error.message}`)
    }
}

export const getAllProducts = async () => {
    try {
        return await productModel.find()
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy danh sách sản phẩm: ${error.message}`)
    }
}

export const updateProduct = async (id, data) => {
    try {
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            throw new Error("Sản phẩm không tồn tại")
        }

        const checkName = await productModel.findOne({ name: data.name, _id: { $ne: id } })
        if (checkName) {
            throw new Error("Tên sản phẩm đã tồn tại")
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true })
        return updatedProduct
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật sản phẩm: ${error.message}`)
    }
}

export const deleteProduct = async (id) => {
    try {
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            throw new Error("Sản phẩm không tồn tại")
        }
        
        await productModel.findByIdAndDelete(id)
        return true
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi xóa sản phẩm: ${error.message}`)
    }
}

export const toggleSignature = async (id) => {
    try {
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            throw new Error("Sản phẩm không tồn tại")
        }

        if (existingProduct.signature) {
            await productModel.findByIdAndUpdate(id, { signature: false })
            return { message: "Đã bỏ khỏi signature" }
        }

        const signatureProducts = await productModel.find({ signature: true }).sort({ updatedAt: 1 })
        if (signatureProducts.length >= 4) {
            const oldestSignature = signatureProducts[0]
            await productModel.findByIdAndUpdate(oldestSignature._id, { signature: false })
        }

        await productModel.findByIdAndUpdate(id, {
            signature: true,
            updatedAt: new Date()
        })
        return { message: "Đã thêm vào signature" }
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi chuyển đổi sản phẩm đặc trưng: ${error.message}`)
    }
}

export const searchProducts = async (query) => {
    try {
        const products = await productModel.find({
            name: { $regex: query, $options: 'i' }
        })
        return products
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi tìm kiếm sản phẩm: ${error.message}`)
    }
}
