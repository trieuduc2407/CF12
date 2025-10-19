import { ChevronLeft, Minus, Plus } from 'lucide-react'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import QuantityInput from '../components/QuantityInput'
import { getProductById } from '../store/client/productSlice'
import formatNumber from '../utils/formatNumber'

const initialState = {
    productId: '',
    quantity: 1,
    size: '',
    temperature: '',
}

const Product = () => {
    const productId = useParams().id
    const tableName = useParams().tableName
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
        <>
            <div className="min-h-screen overflow-auto pb-20">
                <button
                    className="fixed left-4 top-4 z-10 text-white"
                    onClick={() => navigate(`/tables/${tableName}/menu`)}
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
                            <p className="text-xl font-semibold">
                                {product.name}
                            </p>
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
                                                defaultChecked={
                                                    size.name === 'M'
                                                }
                                                onChange={(event) =>
                                                    setFormData({
                                                        ...formData,
                                                        size: event.target
                                                            .value,
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

                        {product.temperature &&
                        product.temperature.length > 1 ? (
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-semibold">
                                    Tuỳ chọn nhiệt độ
                                </p>
                                {product.temperature.map((temp) => {
                                    return (
                                        <div
                                            className="flex gap-5"
                                            key={temp.type}
                                        >
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
                        <div className="flex w-full justify-between md:hidden">
                            <p className="text-lg font-semibold">Số lượng</p>
                            <QuantityInput
                                className="flex w-20 justify-around"
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>
                    </form>

                    <div className="bg-bg-base fixed bottom-0 flex w-full justify-center gap-2 py-4">
                        <QuantityInput
                            className="hidden items-center justify-between md:flex md:w-[35%]"
                            formData={formData}
                            setFormData={setFormData}
                        />
                        <button
                            className="btn w-[90%] rounded-lg border-0 bg-amber-500 text-white md:w-[55%]"
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
        </>
    )
}
export default Product
