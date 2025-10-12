import { Search } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Card from '../components/Card'
import {
    getAllProducts,
    getLastestProducts,
} from '../store/client/productSlice'

const categoryList = [
    { value: 'new', label: 'Món mới' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố' },
    { value: 'signature', label: 'Đặc biệt' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const Menu = () => {
    const dispatch = useDispatch()
    const { products = [] } = useSelector((state) => state.clientProduct)
    const { lastestProducts = [] } = useSelector((state) => state.clientProduct)

    useEffect(() => {
        dispatch(getAllProducts())
        dispatch(getLastestProducts())
    }, [dispatch])

    return (
        <>
            <div className="mt-2.5 grid grid-cols-1 gap-5">
                <div className="hidden rounded-2xl bg-white md:flex">
                    <div className="my-5 ml-5 text-2xl font-bold text-black">
                        Danh mục
                    </div>
                    {categoryList.map((category) => (
                        <div
                            className="my-5 ml-5 text-xl font-light text-black"
                            key={category.value}
                        >
                            {category.label}
                        </div>
                    ))}
                </div>
                <div className="bg-white py-2.5">
                    <div className="grid grid-cols-2 gap-4 justify-self-center rounded-2xl bg-gradient-to-b from-[#fff3f3] to-[#ffebc0] p-2.5">
                        <p className="col-span-full text-lg font-semibold">
                            Món mới phải thử
                        </p>

                        {lastestProducts.map((product) => (
                            <Card key={product._id} product={product} />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 justify-self-center rounded-2xl bg-white">
                    {products.map((product) => (
                        <Card key={product._id} product={product} />
                    ))}
                </div>
                <div className="hidden min-h-80 flex-col justify-center rounded-2xl bg-white align-middle md:flex">
                    <img src="./icon_cart_blank.svg" alt="" />
                    <p className="py-5 text-center text-gray-500">
                        Chưa có sản phầm nào trong giỏ hàng
                    </p>
                </div>
            </div>
        </>
    )
}

export default Menu
