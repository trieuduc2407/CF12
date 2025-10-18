import { cloudinary } from '../../config/cloudinaryConfig.js'

export const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
                if (error) return reject(error)
                else return resolve(result)
            }
        )
        stream.end(fileBuffer)
    })
}
