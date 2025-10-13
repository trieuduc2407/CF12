import { productModel } from '../../models/productModel.js'
import { cloudinary } from '../../config/cloudinary.js'

const addProduct = async (req, res) => {
    try {
        const { name, category, basePrice } = req.body
        const sizes = JSON.parse(req.body.sizes || '[]')
        const temperature = JSON.parse(req.body.temperature || '[]')
        const ingredients = JSON.parse(req.body.ingredients || '[]')
        const file = req.file
        if (!file) {
            return res.json({
                success: false,
                message: 'Vui lòng chọn ảnh sản phẩm'
            })
        }

        const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            async (error, result) => {
                if (error) {
                    return res.json({
                        success: false,
                        message: error.message
                    })
                }

                const newProduct = await productModel.create({
                    name,
                    category,
                    basePrice,
                    sizes,
                    temperature,
                    ingredients,
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id,
                })

                return res.json({
                    success: true,
                    data: newProduct
                })
            }
        )
        stream.end(file.buffer)
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({
                success: false,
                message: "Sản phẩm không tồn tại"
            })
        }

        res.json({
            success: true,
            data: product
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find()
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
const updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, category, basePrice } = req.body
    const sizes = JSON.parse(req.body.sizes || '[]')
    const temperature = JSON.parse(req.body.temperature || '[]')
    const ingredients = JSON.parse(req.body.ingredients || '[]')
    const imageUpdated = req.body.imageUpdated === 'true'
    if (imageUpdated && !req.file) {
        return res.json({
            success: false,
            message: 'Vui lòng chọn ảnh sản phẩm'
        })
    }

    if (!imageUpdated && req.file) {
        return res.json({
            success: false,
            message: 'Dữ liệu không hợp lệ'
        })
    }

    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({
                success: false,
                message: "Sản phẩm không tồn tại"
            })
        }

        if (imageUpdated) {
            await cloudinary.uploader.destroy(product.imagePublicId)
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'products' },
                async (error, result) => {
                    if (error) {
                        return res.json({
                            success: false,
                            message: error.message
                        })
                    }

                    await productModel.findByIdAndUpdate(id, {
                        name,
                        category,
                        basePrice,
                        sizes,
                        temperature,
                        ingredients,
                        imageUrl: result.secure_url,
                        imagePublicId: result.public_id,
                    })

                    return res.json({
                        success: true,
                        message: "Cập nhật sản phẩm thành công"
                    })
                }
            )
            stream.end(req.file.buffer)
        } else {
            await productModel.findByIdAndUpdate(id, {
                name,
                category,
                basePrice,
                sizes,
                temperature,
                ingredients,
            })

            return res.json({
                success: true,
                message: "Cập nhật sản phẩm thành công"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}
const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({
                success: false,
                message: "Sản phẩm không tồn tại"
            })
        }

        await cloudinary.uploader.destroy(product.imagePublicId)
        await productModel.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Xóa sản phẩm thành công"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const toggleSignature = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({
                success: false,
                message: "Sản phẩm không tồn tại"
            })
        }

        if (product.signature) {
            // Nếu đang là signature, remove khỏi signature
            await productModel.findByIdAndUpdate(id, { signature: false })
        } else {
            // Nếu chưa là signature, thêm vào signature
            const signatureProducts = await productModel.find({ signature: true }).sort({ updatedAt: 1 })

            if (signatureProducts.length >= 4) {
                // FIFO: Remove sản phẩm được thêm đầu tiên (oldest)
                const oldestSignature = signatureProducts[0]
                await productModel.findByIdAndUpdate(oldestSignature._id, { signature: false })
            }

            await productModel.findByIdAndUpdate(id, {
                signature: true,
                updatedAt: new Date()
            })
        }

        res.json({
            success: true,
            message: product.signature ? "Đã bỏ khỏi signature" : "Đã thêm vào signature"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const searchProduct = async (req, res) => {
    const { query } = req.query
    try {
        if (!query) {
            return res.json({
                success: false,
                message: "Vui lòng nhập từ khóa tìm kiếm"
            })
        }

        const products = await productModel.find({
            name: { $regex: query, $options: 'i' }
        })

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

export { addProduct, getProduct, getAllProduct, updateProduct, deleteProduct, toggleSignature, searchProduct }