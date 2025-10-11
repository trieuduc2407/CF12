import { Search } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import Card from '../components/Card'
import { getAllProducts } from '../store/client/productSlice'

const categoryList = [
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố và nước ép' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua và thức uống khác' },
]

const Menu = () => {
    const dispatch = useDispatch()
    const { products = [] } = useSelector((state) => state.clientProduct)

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    return (
        <>
            <div className="mt-5 grid grid-cols-[1fr_2fr_1fr] gap-5">
                <div className="rounded-2xl bg-white">
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
                <div className="grid rounded-2xl bg-white">
                    <label className="input w-xl mt-2.5 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-700">
                        <Search />
                        <input
                            type="search"
                            className="grow"
                            placeholder="Bạn cần tìm món gì ?"
                        />
                    </label>
                    <div className="px-2.5 py-5">
                        {products.map((product) => (
                            <Card key={product._id} product={product} />
                        ))}
                    </div>
                </div>
                <div className="flex min-h-80 flex-col justify-center rounded-2xl bg-white align-middle">
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
