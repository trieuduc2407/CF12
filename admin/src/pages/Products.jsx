import React, { useState } from 'react'
import { addProductForm } from '../config/form'
import CommonForm from '../components/CommonForm'
import ImageUpload from '../components/ImageUpload'

const initialState = {
    name: '',
    category: '',
    basePrice: 0,
    sizes: [],
    temperature: [],
    ingredients: [],
    image: '',
}

const Products = () => {
    const [formData, setFormData] = useState(initialState)
    const onSubmit = (event) => {
        event.preventDefault()
    }

    return (
        <div>
            <div className="drawer drawer-end">
                <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer" className="drawer-button btn">
                        Thêm sản phẩm
                    </label>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu w-xl flex min-h-screen justify-center bg-white px-8">
                        <p className="p-4 text-2xl font-semibold">
                            Thêm sản phẩm
                        </p>
                        <ImageUpload />
                        <div className="m-4">
                            <CommonForm
                                formControls={addProductForm}
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={onSubmit}
                                buttonText="Thêm sản phẩm"
                                isButtonDisabled={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
