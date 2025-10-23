import {
    ChevronLeft,
    CircleEllipsis,
    CirclePlus,
    RotateCcw,
    Search,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Card from '../components/Card'
import CommonForm from '../components/CommonForm'
import ImageUpload from '../components/ImageUpload'
import Searchbar from '../components/Searchbar'
import Toast from '../components/Toast'
import { addProductForm } from '../config/form'
import { useDebounce } from '../hooks/useDebounce'
import { useFormWithToast } from '../hooks/useFormWithToast'
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    searchProduct,
    toggleSignature,
    updateProduct,
} from '../store/admin/productSlice'
import { getAllIngredients } from '../store/admin/storageSlice'

const initialState = {
    name: '',
    category: '',
    basePrice: '',
    sizeOption: 'single',
    upsizePrice: '',
    sizes: [],
    temperature: [],
    ingredients: [],
}

const buildSizesArray = (sizeOption, upsizePrice) => {
    if (sizeOption === 'upsize') {
        return [
            { name: 'M', price: 0 },
            { name: 'L', price: upsizePrice || 0 },
        ]
    }
    return [{ name: 'M', price: 0 }]
}

const Products = () => {
    const { formData, setFormData, resetForm, showToast, showToastMessage } =
        useFormWithToast(initialState)

    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(image || '')
    const [imageUpdated, setImageUpdated] = useState(false)

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)
    const [searchResults, setSearchResults] = useState([])
    const [showMobileSearch, setShowMobileSearch] = useState(false)

    const { ingredients = [] } = useSelector((state) => state.adminStorage)
    const { products = [] } = useSelector((state) => state.adminProduct)
    const dispatch = useDispatch()

    const productsList = Array.isArray(products)
        ? products
        : products.data || []

    useEffect(() => {
        dispatch(getAllIngredients())
        dispatch(getAllProducts())
    }, [dispatch])

    useEffect(() => {
        if (debouncedQuery) {
            dispatch(searchProduct(debouncedQuery)).then((data) => {
                if (data?.payload?.success) {
                    setSearchResults(data.payload.data)
                }
            })
        } else {
            setSearchResults([])
        }
    }, [debouncedQuery, dispatch])

    const getProductData = (id) => {
        dispatch(getProduct(id)).then((data) => {
            if (data?.payload?.success) {
                let tempType = ''
                let isDefaultTemp = ''
                if (
                    Array.isArray(data.payload.data.temperature) &&
                    data.payload.data.temperature.length > 0
                ) {
                    const firstTemp = data.payload.data.temperature[0]
                    tempType = firstTemp.type

                    if (firstTemp.type === 'hot_ice' && firstTemp.defaultTemp) {
                        isDefaultTemp = firstTemp.defaultTemp
                    }
                }

                let sizeOption = 'single'
                let upsizePrice = 0
                if (
                    data.payload.data.sizes &&
                    data.payload.data.sizes.length > 1
                ) {
                    sizeOption = 'upsize'
                    const lSize = data.payload.data.sizes.find(
                        (size) => size.name === 'L'
                    )
                    if (lSize) {
                        upsizePrice = lSize.price
                    }
                }

                setFormData({
                    ...data.payload.data,
                    temperature: tempType,
                    isDefaultTemperature: isDefaultTemp,
                    sizeOption: sizeOption,
                    upsizePrice: upsizePrice,
                })
                setPreview(data.payload.data.imageUrl)
                setCurrentUpdateId(data.payload.data._id)
                setImageUpdated(false)
                document.getElementById('my-drawer').checked = true
            }
        })
    }

    const handleUpdate = (id) => {
        if (
            formData.temperature === 'hot_ice' &&
            !formData.isDefaultTemperature
        ) {
            showToastMessage(
                'error',
                'Vui lòng chọn nhiệt độ mặc định cho sản phẩm có cả nóng và đá'
            )
            return
        }

        const payload = new FormData()
        const tempValue = formData.temperature
        let tempArr = []

        if (Array.isArray(tempValue)) {
            tempArr = tempValue
        } else if (typeof tempValue === 'string' && tempValue) {
            const tempObj = { type: tempValue }
            // Nếu là hot_ice, thêm defaultTemp từ isDefaultTemperature
            if (tempValue === 'hot_ice' && formData.isDefaultTemperature) {
                tempObj.defaultTemp = formData.isDefaultTemperature
            }
            tempArr = [tempObj]
        }

        const sizesArray = buildSizesArray(
            formData.sizeOption,
            formData.upsizePrice
        )

        payload.append('name', formData.name)
        payload.append('category', formData.category)
        payload.append('basePrice', formData.basePrice)
        payload.append('sizes', JSON.stringify(sizesArray))
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
                resetForm()
                setImage(null)
                setPreview('')
                setImageUpdated(false)
                document.getElementById('my-drawer').checked = false
                showToastMessage('success', 'Cập nhật sản phẩm thành công!')
            }
        })
    }

    const handleDelete = (id) => {
        dispatch(deleteProduct(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllProducts())
                showToastMessage('success', 'Xóa sản phẩm thành công!')
            }
        })
    }

    const handleToggleSignature = async (id) => {
        const result = await dispatch(toggleSignature(id))
        if (result?.payload?.success) {
            dispatch(getAllProducts())
            showToastMessage('success', result.payload.message)
        }
    }

    const productForm = addProductForm.map((item) => {
        if (item.name === 'ingredients') {
            return {
                ...item,
                fields: item.fields.map((field) => {
                    if (field.name === 'ingredientId') {
                        return {
                            ...field,
                            options: ingredients
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((ingredient) => ({
                                    value: ingredient._id,
                                    label: ingredient.name,
                                })),
                        }
                    } else {
                        return field
                    }
                }),
            }
        }
        return item
    })

    const onChange = (event) => {
        setQuery(event.target.value)
    }

    const handleMobileSearchBlur = () => {
        setTimeout(() => {
            if (!query && showMobileSearch) {
                setShowMobileSearch(false)
            }
        }, 150)
    }

    const handleMobileSearchClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowMobileSearch(false)
        setQuery('')
    }

    const onSubmit = (event) => {
        event.preventDefault()

        if (
            formData.temperature === 'hot_ice' &&
            !formData.isDefaultTemperature
        ) {
            showToastMessage(
                'error',
                'Vui lòng chọn nhiệt độ mặc định cho sản phẩm có cả nóng và đá'
            )
            return
        }

        const payload = new FormData()
        const tempValue = formData.temperature
        let tempArr = []
        if (Array.isArray(tempValue)) {
            tempArr = tempValue
        } else if (typeof tempValue === 'string' && tempValue) {
            const tempObj = { type: tempValue }
            // Nếu là hot_ice, thêm defaultTemp từ isDefaultTemperature
            if (tempValue === 'hot_ice' && formData.isDefaultTemperature) {
                tempObj.defaultTemp = formData.isDefaultTemperature
            }
            tempArr = [tempObj]
        }

        const sizesArray = buildSizesArray(
            formData.sizeOption,
            formData.upsizePrice
        )

        payload.append('name', formData.name)
        payload.append('category', formData.category)
        payload.append('basePrice', formData.basePrice)
        payload.append('sizes', JSON.stringify(sizesArray))
        payload.append('temperature', JSON.stringify(tempArr))
        payload.append('ingredients', JSON.stringify(formData.ingredients))
        payload.append('image', image)

        dispatch(addProduct(payload)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllProducts())
                resetForm()
                setImage(null)
                setPreview('')
                showToastMessage('success', 'Thêm sản phẩm thành công!')
            }
        })
    }

    return (
        <>
            <Toast showToast={showToast} />

            <div
                id="search-bar"
                className={`fixed left-0 right-0 top-0 z-30 bg-white pt-4 shadow-md transition-all duration-200 md:hidden ${showMobileSearch ? '' : 'hidden'}`}
            >
                <Searchbar
                    searchName="sản phẩm"
                    onChange={onChange}
                    value={query}
                    onBlur={handleMobileSearchBlur}
                    onClose={handleMobileSearchClose}
                />
            </div>
            <div className="drawer drawer-end xl:drawer-open h-full gap-2">
                <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    onChange={(e) => {
                        if (!e.target.checked) {
                            setCurrentUpdateId('')
                            resetForm()
                            setImage(null)
                            setPreview('')
                            setImageUpdated(false)
                        }
                    }}
                />
                <div className="drawer-content flex flex-col overflow-hidden">
                    <div className="fab z-20 md:hidden" id="main-fab">
                        <div
                            id="main-fab-trigger"
                            tabIndex={0}
                            role="button"
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                        >
                            <CircleEllipsis />
                        </div>
                        <button
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                            onClick={(e) => {
                                document.getElementById('my-drawer').checked =
                                    true
                                document
                                    .getElementById('main-fab-trigger')
                                    .blur()
                                e.currentTarget.blur()
                            }}
                        >
                            <CirclePlus />
                        </button>
                        <button
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                            onClick={(e) => {
                                setShowMobileSearch(true)
                                setTimeout(() => {
                                    const input =
                                        document.getElementById('menu-search')
                                    if (input) input.focus()
                                }, 50)
                                document
                                    .getElementById('main-fab-trigger')
                                    .blur()
                                e.currentTarget.blur()
                            }}
                        >
                            <Search />
                        </button>
                    </div>

                    <div className="hidden items-center justify-around py-4 md:flex">
                        <Searchbar
                            searchName="sản phẩm"
                            onChange={onChange}
                            value={query}
                        />
                        <div className="mb-5 flex justify-end xl:m-0">
                            <label
                                htmlFor="my-drawer"
                                className="drawer-button btn xl:hidden"
                            >
                                Thêm sản phẩm
                            </label>
                        </div>
                    </div>
                    <div className="scrollbar-hide 3xl:grid-cols-3 grid flex-1 grid-cols-1 items-start justify-items-center gap-8 overflow-y-auto sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        {debouncedQuery ? (
                            searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                    <Card
                                        product={product}
                                        key={product._id}
                                        getProductData={getProductData}
                                        handleDelete={handleDelete}
                                        handleToggleSignature={() =>
                                            handleToggleSignature(product._id)
                                        }
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-lg font-semibold text-gray-500">
                                    Không tìm thấy sản phẩm
                                </p>
                            )
                        ) : productsList.length > 0 ? (
                            productsList
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((product) => (
                                    <Card
                                        product={product}
                                        key={product._id}
                                        getProductData={getProductData}
                                        handleDelete={handleDelete}
                                        handleToggleSignature={() =>
                                            handleToggleSignature(product._id)
                                        }
                                    />
                                ))
                        ) : (
                            <p className="col-span-full text-center text-lg font-semibold text-gray-500">
                                Chưa có sản phẩm nào
                            </p>
                        )}
                    </div>
                </div>
                <div className="drawer-side z-20 rounded-lg">
                    <label
                        htmlFor="my-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="scrollbar-hide menu w-sm md:w-xl flex h-screen flex-col overflow-y-auto bg-white px-8">
                        <div className="flex items-center justify-between py-4">
                            <button
                                className="md:hidden"
                                onClick={() =>
                                    (document.getElementById(
                                        'my-drawer'
                                    ).checked = false)
                                }
                                title="Đóng"
                            >
                                <ChevronLeft />
                            </button>
                            <h2 className="text-2xl font-semibold">
                                {currentUpdateId
                                    ? 'Cập nhật sản phẩm'
                                    : 'Thêm sản phẩm'}
                            </h2>
                            <button
                                onClick={() => {
                                    resetForm()
                                    setCurrentUpdateId('')
                                    setImage(null)
                                    setPreview('')
                                    setImageUpdated(false)
                                }}
                                title="Đặt lại form"
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
                        <div className="scrollbar-hide m-4 flex-1 overflow-y-auto">
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
