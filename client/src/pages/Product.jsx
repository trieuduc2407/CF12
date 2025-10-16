import { ChevronLeft, Minus, Plus } from 'lucide-react'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getProductById } from '../store/client/productSlice'
import formatNumber from '../utils/formatNumber'

const initialState = {
    productId: '',
    quantity: 1,
    size: '',
    temperature: '',
}

const Product = () => {
    const productId = window.location.pathname.split('/').pop()
    const [product, setProduct] = useState({})
    const [formData, setFormData] = useState(initialState)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleOrder = () => {
        console.log(formData)
    }

    useEffect(() => {
        dispatch(getProductById(productId)).then((data) => {
            setProduct(data.payload.data)
            setFormData((f) => ({
                ...f,
                productId: productId,
                size: 'M',
            }))

            if (
                Array.isArray(data.payload.data.temperature) &&
                data.payload.data.temperature.length > 0
            ) {
                const defaultTemp =
                    data.payload.data.temperature.find((t) => t.isDefault) ||
                    data.payload.data.temperature[0]
                setFormData((f) => ({
                    ...f,
                    temperature: defaultTemp.type,
                }))
            }
        })
    }, [dispatch, productId])

    return (
        <div className="min-h-screen overflow-auto pb-20">
            <button
                className="absolute left-4 top-4 text-white"
                onClick={() => navigate('/menu')}
            >
                <ChevronLeft />
            </button>
            <div className="flex flex-col">
                <img
                    className="w-full bg-cover"
                    src={product.imageUrl}
                    alt=""
                />
                <div className="mx-5 mt-2.5 flex flex-col gap-2.5">
                    <div className="flex justify-between pb-2.5">
                        <p className="text-xl font-semibold">{product.name}</p>
                        <p className="text-xl font-semibold">
                            {formatNumber(product.basePrice)}đ
                        </p>
                    </div>
                </div>
                <form
                    className="mx-5 my-2.5 flex flex-col gap-2.5"
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    {product.sizes && product.sizes.length > 1 ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">
                                Tuỳ chọn upsize
                            </p>
                            {product.sizes.map((size) => (
                                <div
                                    key={size.name}
                                    className="flex flex-row justify-between"
                                >
                                    <div className="flex flex-row gap-5">
                                        <input
                                            className="radio radio-primary border"
                                            type="radio"
                                            name="radio-size"
                                            value={size.name}
                                            defaultChecked={size.name === 'M'}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    size: event.target.value,
                                                })
                                            }
                                        />
                                        <p>Size {size.name}</p>
                                    </div>
                                    <p>
                                        {size.price
                                            ? `+ ${formatNumber(size.price)}đ`
                                            : null}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {product.temperature && product.temperature.length > 1 ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">
                                Tuỳ chọn nhiệt độ
                            </p>
                            {product.temperature.map((temp) => {
                                return (
                                    <div className="flex gap-5" key={temp.type}>
                                        <input
                                            className="radio radio-primary border"
                                            type="radio"
                                            name="radio-temp"
                                            value={temp.type}
                                            defaultChecked={temp.isDefault}
                                            onChange={(event) =>
                                                setFormData({
                                                    ...formData,
                                                    temperature:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <p>
                                            {temp.type === 'hot'
                                                ? 'Nóng'
                                                : 'Lạnh'}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    ) : null}
                    <div className="flex w-full justify-between">
                        <p className="text-lg font-semibold">Số lượng</p>
                        <div className="flex w-20 justify-around">
                            <button
                                type="button"
                                className="btn btn-xs btn-square border-0 bg-gray-200 text-gray-400 shadow-none"
                                onClick={() =>
                                    formData.quantity > 1
                                        ? setFormData({
                                              ...formData,
                                              quantity: formData.quantity - 1,
                                          })
                                        : null
                                }
                            >
                                <Minus />
                            </button>
                            <p>{formData.quantity}</p>
                            <button
                                type="button"
                                className="btn btn-xs btn-square border-0 bg-gray-200 text-gray-400 shadow-none outline-0"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        quantity: formData.quantity + 1,
                                    })
                                }
                            >
                                <Plus />
                            </button>
                        </div>
                    </div>
                </form>

                <div className="bg-bg-base fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 transform justify-center py-4">
                    <button
                        className="btn w-[90%] border-0 bg-amber-500 text-white"
                        onClick={() => {
                            handleOrder()
                        }}
                    >
                        Thêm vào giỏ +
                        {formatNumber(
                            (product.basePrice || 0) * formData.quantity
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Product
