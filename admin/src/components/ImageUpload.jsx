import React from 'react'

const ImageUpload = () => {
    return (
        <div className="h-120 w-120 mx-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <label className="block text-xl font-semibold">
                Tải ảnh sản phẩm
            </label>
            <input className="hidden" type="file" />
        </div>
    )
}

export default ImageUpload
