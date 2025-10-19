import { cloudinary } from '../../config/cloudinaryConfig.js'
import { parseAndValidateProductFields } from '../../helpers/admin/parseAndValidateProductFields.js'
import { uploadToCloudinary } from '../../helpers/admin/uploadToCloudinary.js'
import * as productService from '../../services/admin/productService.js'

export const addProduct = async (req, res) => {
    const { isValid, fields } = parseAndValidateProductFields(req)
    if (!isValid.valid) {
        return res.json({
            success: false,
            message: isValid.message || 'Vui lòng điền đầy đủ thông tin',
        })
    }

    const file = req.file
    if (!file) {
        return res.json({
            success: false,
            message: 'Vui lòng chọn ảnh sản phẩm',
        })
    }

    try {
        const result = await uploadToCloudinary(file.buffer)
        const newProduct = await productService.addProduct({
            ...fields,
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
        })
        return res.json({
            success: true,
            data: newProduct,
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID sản phẩm',
        })
    }

    try {
        const product = await productService.getProductById(id)
        res.json({
            success: true,
            data: product,
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
            data: products,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID sản phẩm',
        })
    }

    const { isValid, fields } = parseAndValidateProductFields(req)
    if (!isValid.valid) {
        return res.json({
            success: false,
            message: isValid.message || 'Vui lòng điền đầy đủ thông tin',
        })
    }

    const imageUpdated = req.body.imageUpdated === 'true'
    if (imageUpdated && !req.file) {
        return res.json({
            success: false,
            message: 'Vui lòng chọn ảnh sản phẩm',
        })
    }

    if (!imageUpdated && req.file) {
        return res.json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
        })
    }

    try {
        const product = await productService.getProductById(id)
        let result = null
        if (imageUpdated) {
            if (product.imagePublicId) {
                try {
                    const destroyResult = await cloudinary.uploader.destroy(
                        product.imagePublicId
                    )
                    if (destroyResult.result !== 'ok') {
                        return res.json({
                            success: false,
                            message: 'Không thể xóa ảnh cũ trên Cloudinary',
                        })
                    }
                } catch (destroyError) {
                    console.log(destroyError)
                    return res.json({
                        success: false,
                        message: 'Lỗi khi xóa ảnh cũ trên Cloudinary',
                    })
                }
            }
            result = await uploadToCloudinary(req.file.buffer)
        }

        const updatedProduct = await productService.updateProduct(id, {
            ...fields,
            imageUrl: result ? result.secure_url : product.imageUrl,
            imagePublicId: result ? result.public_id : product.imagePublicId,
            updatedAt: Date.now(),
        })
        return res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID sản phẩm',
        })
    }

    try {
        const product = await productService.getProductById(id)
        await cloudinary.uploader.destroy(product.imagePublicId)
        await productService.deleteProduct(id)
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công',
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const toggleSignature = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID sản phẩm',
        })
    }
    try {
        const result = await productService.toggleSignature(id)
        res.json({
            success: true,
            message: result.message,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const searchProduct = async (req, res) => {
    const { query } = req.query
    if (!query) {
        return res.json({
            success: false,
            message: 'Vui lòng nhập từ khóa tìm kiếm',
        })
    }

    try {
        const products = await productService.searchProducts(query)
        res.json({
            success: true,
            data: products,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
