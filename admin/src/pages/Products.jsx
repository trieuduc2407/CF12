import { ChevronLeft, RotateCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Card from '../components/Card'
import CommonForm from '../components/CommonForm'
import ImageUpload from '../components/ImageUpload'
import { addProductForm } from '../config/form'
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct,
} from '../store/admin/productSlice'
import { getAllIngredients } from '../store/admin/storageSlice'

const initialState = {
    name: '',
    category: '',
    basePrice: 0,
    sizes: [],
    temperature: [],
    ingredients: [],
}

const Products = () => {
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(image || '')
    const [imageUpdated, setImageUpdated] = useState(false)
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })

    const { ingredients = [] } = useSelector((state) => state.adminStorage)
    const { products = [] } = useSelector((state) => state.adminProduct)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllIngredients())
        dispatch(getAllProducts())
    }, [dispatch])

    const getProductData = (id) => {
        dispatch(getProduct(id)).then((data) => {
            if (data?.payload?.success) {
                let tempType = ''
                let isDefaultTemp = ''
                if (
                    Array.isArray(data.payload.data.temperature) &&
                    data.payload.data.temperature.length > 0
                ) {
                    tempType = data.payload.data.temperature[0].type
                    isDefaultTemp = data.payload.data.temperature[0].isDefault
                        ? data.payload.data.temperature[0].type
                        : ''
                }

                setFormData({
                    ...data.payload.data,
                    temperature: tempType,
                    isDefaultTemperature: isDefaultTemp,
                })
                setPreview(data.payload.data.imageUrl)
                setCurrentUpdateId(data.payload.data._id)
                setImageUpdated(false)
                document.getElementById('my-drawer').checked = true
            }
        })
    }

    const handleUpdate = (id) => {
        const payload = new FormData()
        const tempValue = formData.temperature
        let tempArr = []

        if (Array.isArray(tempValue)) {
            tempArr = tempValue
        } else if (typeof tempValue === 'string' && tempValue) {
            tempArr = [{ type: tempValue, isDefault: true }]
        }

        payload.append('name', formData.name)
        payload.append('category', formData.category)
        payload.append('basePrice', formData.basePrice)
        payload.append('sizes', JSON.stringify(formData.sizes))
        payload.append('temperature', JSON.stringify(tempArr))
        payload.append('ingredients', JSON.stringify(formData.ingredients))
        if (imageUpdated) {
            payload.append('imageUpdated', 'true')
            payload.append('image', image)
        }

        dispatch(updateProduct({ id, formData: payload })).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllProducts())
                setCurrentUpdateId('')
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: 'Cập nhật sản phẩm thành công!',
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    const handleDelete = (id) => {
        dispatch(deleteProduct(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllProducts())
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: 'Xóa sản phẩm thành công!',
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    const productForm = addProductForm.map((item) => {
        if (item.name === 'ingredients') {
            return {
                ...item,
                fields: item.fields.map((field) => {
                    if (field.name === 'ingredientId') {
                        return {
                            ...field,
                            options: ingredients.map((ingredient) => {
                                return {
                                    value: ingredient._id,
                                    label: ingredient.name,
                                }
                            }),
                        }
                    } else {
                        return field
                    }
                }),
            }
        }
        return item
    })

    const onSubmit = (event) => {
        event.preventDefault()
        const payload = new FormData()
        const tempValue = formData.temperature
        let tempArr = []
        if (Array.isArray(tempValue)) {
            tempArr = tempValue
        } else if (typeof tempValue === 'string' && tempValue) {
            tempArr = [{ type: tempValue, isDefault: true }]
        }

        payload.append('name', formData.name)
        payload.append('category', formData.category)
        payload.append('basePrice', formData.basePrice)
        payload.append('sizes', JSON.stringify(formData.sizes))
        payload.append('temperature', JSON.stringify(tempArr))
        payload.append('ingredients', JSON.stringify(formData.ingredients))
        payload.append('image', image)

        dispatch(addProduct(payload)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllProducts())
                setFormData(initialState)
                setImage(null)
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: 'Thêm sản phẩm thành công!',
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    return (
        <>
            {showToast.isShow && (
                <div className="toast toast-top toast-end">
                    <div className={`alert alert-${showToast.type}`}>
                        <span>{showToast.text}</span>
                    </div>
                </div>
            )}
            <div className="drawer xl:drawer-open drawer-end gap-2">
                <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content">
                    <div className="my-4 flex justify-end xl:m-0">
                        <label
                            htmlFor="my-drawer"
                            className="drawer-button btn xl:hidden"
                        >
                            Thêm sản phẩm
                        </label>
                    </div>
                    <div className="flex gap-4">
                        {products.data
                            ? products.data.map((product) => {
                                  return (
                                      <Card
                                          product={product}
                                          key={product._id}
                                          getProductData={getProductData}
                                          handleDelete={handleDelete}
                                      />
                                  )
                              })
                            : null}
                    </div>
                </div>
                <div className="drawer-side rounded-lg">
                    <label
                        htmlFor="my-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu w-xl flex min-h-screen justify-center bg-white px-8">
                        <div className="flex justify-between">
                            <button
                                className="md:hidden"
                                onClick={() =>
                                    (document.getElementById(
                                        'my-drawer'
                                    ).checked = false)
                                }
                            >
                                <ChevronLeft />
                            </button>
                            <p className="p-4 text-2xl font-semibold">
                                {currentUpdateId
                                    ? 'Cập nhật sản phẩm'
                                    : 'Thêm sản phẩm'}
                            </p>
                            <button
                                onClick={() => {
                                    setFormData(initialState)
                                    setCurrentUpdateId('')
                                    setImage(null)
                                    setPreview('')
                                }}
                            >
                                <RotateCcw />
                            </button>
                        </div>
                        <ImageUpload
                            onChange={(file) => {
                                setImage(file)
                                setImageUpdated(true)
                            }}
                            preview={preview}
                            setPreview={setPreview}
                        />
                        <div className="m-4">
                            <CommonForm
                                formControls={productForm}
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={
                                    currentUpdateId
                                        ? (event) => {
                                              event.preventDefault()
                                              handleUpdate(currentUpdateId)
                                          }
                                        : onSubmit
                                }
                                buttonText={
                                    currentUpdateId
                                        ? 'Cập nhật sản phẩm'
                                        : 'Thêm sản phẩm'
                                }
                                isButtonDisabled={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products
