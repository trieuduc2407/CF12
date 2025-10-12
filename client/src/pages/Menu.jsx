import { Search } from 'lucide-react'
import React, { Fragment } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Card from '../components/Card'
import { getAllProducts } from '../store/client/productSlice'

const navbarItems = [
    { value: 'new', label: 'Món mới' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố' },
    { value: 'signature', label: 'Đặc biệt' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const categoryItems = [
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố và nước ép' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const Menu = () => {
    const dispatch = useDispatch()
    const { products = [] } = useSelector((state) => state.clientProduct)

    const latestProducts = products
        .filter((product) => product.createdAt)
        .slice(-4)
        .reverse()

    const signatureProducts = products.filter((product) => product.signature)

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    return (
        <>
            <div className="mt-2.5 grid grid-cols-1 gap-2 md:grid-cols-[1fr_3fr_2fr]">
                <div className="hidden rounded-2xl bg-white md:flex md:flex-col">
                    <div className="my-5 ml-5 text-xl font-bold text-black">
                        Danh mục
                    </div>
                    {navbarItems.map((category) => (
                        <div
                            className="text-md my-5 ml-5 font-light text-black"
                            key={category.value}
                        >
                            {category.label}
                        </div>
                    ))}
                </div>
                <div>
                    <div className="rounded-2xl bg-white py-2.5">
                        <div className="grid grid-cols-2 gap-4 justify-self-center rounded-2xl bg-gradient-to-b from-[#fff3f3] to-[#ffebc0] p-2.5">
                            <p className="col-span-full text-lg font-semibold">
                                Món mới phải thử
                            </p>

                            {latestProducts.map((product) => (
                                <Card key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white py-2.5">
                        <div className="grid grid-cols-2 gap-4 justify-self-center rounded-2xl bg-gradient-to-b from-[#e6faff] to-[#caedc7] p-2.5">
                            <p className="col-span-full text-lg font-semibold">
                                Top bán chạy
                            </p>

                            {signatureProducts.map((product) => (
                                <Card key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col divide-y-4 divide-gray-200 border-dashed bg-white">
                        {categoryItems.map((category) => (
                            <div
                                className="grid grid-cols-2 gap-4 justify-self-center p-2.5"
                                key={category.value}
                            >
                                <p className="col-span-full font-semibold">
                                    {category.label}
                                </p>
                                {products
                                    .filter(
                                        (product) =>
                                            product.category === category.value
                                    )
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    )
                                    .map((product) => (
                                        <Card
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden h-80 flex-col justify-center rounded-2xl bg-white align-middle md:flex">
                    <img src="./icon_cart_blank.svg" alt="" />
                    <p className="py-5 text-center text-gray-500">
                        Chưa có sản phẩm <br /> trong giỏ hàng
                    </p>
                </div>
            </div>
        </>
    )
}

export default Menu
