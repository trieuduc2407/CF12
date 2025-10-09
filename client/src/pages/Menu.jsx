import { Search } from 'lucide-react'
import React from 'react'

import Header from '../components/Header'

const Menu = () => {

    

    return (
        <>
            <Header />
            <div className="mt-5 flex flex-row gap-5">
                <div className="w-3xs rounded-2xl bg-white">
                    <div className="text-3xl text-black">Thực đơn</div>
                    <div className="text-2xl text-black">abc</div>
                    <div className="text-2xl text-black">abc</div>
                    <div className="text-2xl text-black">abc</div>
                    <div className="text-2xl text-black">abc</div>
                    <div className="text-2xl text-black">abc</div>
                    <div className="text-2xl text-black">abc</div>
                </div>
                <div className="w-2xl flex justify-center rounded-2xl bg-white">
                    <label className="input w-xl mt-2.5 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-700">
                        <Search />
                        <input
                            type="search"
                            className="grow"
                            placeholder="Bạn cần tìm món gì ?"
                        />
                    </label>
                </div>
                <div className="w-sm flex min-h-80 flex-col justify-center rounded-2xl bg-white align-middle">
                    <img src="./icon_cart_blank.svg" alt="" />
                    <p className="py-5 text-center text-gray-500">
                        Không có sản phầm nào trong giỏ hàng
                    </p>
                </div>
            </div>
        </>
    )
}

export default Menu
