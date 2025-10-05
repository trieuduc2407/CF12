import React, { useRef } from 'react'

const ImageUpload = ({ onChange, preview, setPreview }) => {
    const inputRef = useRef()

    const handleFile = (file) => {
        if (!file) return
        const reader = new FileReader(null)
        reader.onload = (event) => {
            setPreview(event.target.result)
        }
        if (onChange) onChange(file)
        reader.readAsDataURL(file)
    }

    const handleInputChange = (event) => {
        const file = event.target.files[0]
        handleFile(file)
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        handleFile(file)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    return (
        <div
            className="h-120 w-120 relative mx-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {preview ? (
                <>
                    <img
                        src={preview}
                        alt="preview"
                        className="h-120 w-120 rounded-lg object-cover"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-info text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                inputRef.current.click()
                            }}
                        >
                            Chọn lại ảnh
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-error text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                setPreview('')
                                if (onChange) onChange(null)
                            }}
                        >
                            Xoá ảnh
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="flex h-full w-full cursor-pointer items-center justify-center text-xl font-semibold"
                    onClick={() => inputRef.current.click()}
                >
                    <span className="text-center">
                        Bấm hoặc kéo/thả để tải ảnh sản phẩm
                    </span>
                </div>
            )}
            <input
                className="hidden"
                type="file"
                ref={inputRef}
                onChange={handleInputChange}
                accept="image/*"
            />
        </div>
    )
}

export default ImageUpload
