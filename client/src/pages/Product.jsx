import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import QuantityInput from '../components/QuantityInput'
import socket from '../socket/socket'
import {
    addToCart,
    getCart,
    unlockItem,
    updateCartItem,
} from '../store/client/cartSlice'
import { getProductById } from '../store/client/productSlice'

const initialState = {
    clientId: '',
    itemId: '',
    originalItemId: '',
    productId: '',
    quantity: 1,
    size: '',
    temperature: '',
}

const Product = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id: productId, tableName: urlTableName, itemId } = useParams()

    const { clientId: storeClientId, tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )
    const { items: cartItems } = useSelector((state) => state.clientCart)

    const [product, setProduct] = useState({})
    const [formData, setFormData] = useState(initialState)
    const [isEditMode, setIsEditMode] = useState(false)
    const [hasUpdated, setHasUpdated] = useState(false)

    const tableName = storeTableName || urlTableName
    const clientId = storeClientId || localStorage.getItem('clientId')

    const handleOrder = async () => {
        if (isEditMode) {
            // Update item
            await dispatch(
                updateCartItem({
                    tableName,
                    clientId,
                    data: {
                        originalItemId: formData.originalItemId || itemId,
                        itemId: formData.itemId,
                        productId: formData.productId,
                        quantity: formData.quantity,
                        selectedSize: formData.size,
                        selectedTemperature: formData.temperature,
                    },
                })
            )
            // Mark as updated to prevent cleanup unlock
            setHasUpdated(true)
            // Note: updateCartItem already unlocks the item, no need to unlock again
            // Refresh cart
            await dispatch(getCart(tableName))
            navigate(`/tables/${tableName}/cart`)
        } else {
            // Add item
            await dispatch(
                addToCart({
                    tableName,
                    data: formData,
                })
            )
            // Refresh cart
            await dispatch(getCart(tableName))
            navigate(`/tables/${tableName}/menu`)
        }
    }

    useEffect(() => {
        if (!clientId || !tableName) return

        const editMode = !!itemId
        setIsEditMode(editMode)

        dispatch(getProductById(productId)).then((data) => {
            setProduct(data.payload.data)

            if (editMode) {
                const cartItem = cartItems.find(
                    (item) => item.itemId === itemId
                )
                if (cartItem) {
                    setFormData({
                        clientId: clientId,
                        tableName: tableName,
                        productId: productId,
                        quantity: cartItem.quantity,
                        size: cartItem.selectedSize,
                        temperature: cartItem.selectedTemperature,
                        itemId: cartItem.itemId,
                        originalItemId: cartItem.itemId,
                    })
                    return
                }
            }

            let defaultTemp = 'hot'
            if (
                Array.isArray(data.payload.data.temperature) &&
                data.payload.data.temperature.length > 0
            ) {
                const tempObj =
                    data.payload.data.temperature.find((t) => t.isDefault) ||
                    data.payload.data.temperature[0]
                defaultTemp = tempObj.type
            }

            const size = 'M'
            setFormData({
                clientId: clientId,
                tableName: tableName,
                productId: productId,
                quantity: 1,
                size: size,
                temperature: defaultTemp,
                itemId: `${productId}_${size}_${defaultTemp}`,
            })
        })

        return () => {
            if (editMode && itemId && !hasUpdated) {
                // Only unlock if user leaves without updating
                // If user updated, the item is already unlocked by updateCartItem
                dispatch(unlockItem({ itemId }))
                socket.emit('cart:unlockItem', {
                    tableName,
                    clientId,
                    itemId,
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, productId, clientId, tableName, itemId])

    return (
        <div className="m-auto overflow-auto pb-20 xl:mt-10 xl:max-w-6xl 2xl:max-w-7xl">
            <button
                className="btn-circle fixed left-4 top-4 z-10 text-white xl:bg-gray-400"
                onClick={() =>
                    isEditMode
                        ? navigate(`/tables/${tableName}/cart`)
                        : navigate(`/tables/${tableName}/menu`)
                }
            >
                <ChevronLeft />
            </button>
            <div className="flex flex-col xl:flex-row xl:justify-around">
                <div className="relative">
                    <img
                        className="xl:w-2xl 2xl:w-3xl w-full bg-cover xl:rounded-2xl"
                        src={product.imageUrl}
                        alt=""
                    />
                    <div className="">
                        <div className="absolute bottom-0 left-10 hidden flex-col justify-between pb-2.5 xl:flex">
                            <p className="text-xl font-semibold text-white">
                                {product.name}
                            </p>
                            <p className="text-md text-primary font-semibold">
                                Giá: {(product.basePrice || 0).toLocaleString()}
                                đ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="xl:w-sm flex flex-col justify-between">
                    <div className="mx-5 mt-2.5 flex justify-between gap-2.5 pb-2.5 xl:m-0 xl:hidden">
                        <p className="text-xl font-semibold">{product.name}</p>
                        <p className="text-xl font-semibold">
                            {(product.basePrice || 0).toLocaleString()}đ
                        </p>
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
                                                checked={
                                                    formData.size === size.name
                                                }
                                                onChange={(event) =>
                                                    setFormData({
                                                        ...formData,
                                                        size: event.target
                                                            .value,
                                                        itemId: `${productId}_${event.target.value}_${formData.temperature}`,
                                                    })
                                                }
                                            />
                                            <p>Size {size.name}</p>
                                        </div>
                                        <p>
                                            {size.price
                                                ? `+ ${(size.price || 0).toLocaleString()}đ`
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
                                                checked={
                                                    formData.temperature ===
                                                    temp.type
                                                }
                                                onChange={(event) =>
                                                    setFormData({
                                                        ...formData,
                                                        temperature:
                                                            event.target.value,
                                                        itemId: `${productId}_${formData.size}_${event.target.value}`,
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

                    <div className="bg-bg-base fixed bottom-0 flex w-full justify-center gap-2 py-4 xl:static xl:justify-between">
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
                            {isEditMode ? 'Cập nhật' : 'Thêm vào giỏ'} +
                            {(formData.size === 'L'
                                ? (product.basePrice +
                                      (product.sizes.find((s) => s.name === 'L')
                                          ?.price || 0)) *
                                  formData.quantity
                                : (product.basePrice || 0) * formData.quantity
                            ).toLocaleString()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Product
