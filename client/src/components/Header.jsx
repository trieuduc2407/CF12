import React, { useState, useEffect } from 'react'
import { Store, Clock, PhoneCall, Dot } from 'lucide-react'

const Header = () => {
    const [active, setActive] = useState({
        status: ' text-red-300 inactive',
        text: 'Đang đóng cửa',
    })

    useEffect(() => {
        const now = new Date()
        const hour = now.getHours()
        if (hour >= 7 && hour <= 23) {
            setActive({
                status: ' text-green-500 active',
                text: 'Đang mở cửa',
            })
        } else {
            setActive({
                status: 'inactive',
                text: 'Đang đóng cửa',
            })
        }
    }, [])

    return (
        <div className="flex flex-col bg-white md:flex-row md:p-4">
            <div className="relative flex-1 shrink overflow-hidden">
                <img
                    className="object-cover md:max-w-lg"
                    src="./cover_img.png"
                    alt=""
                />
                <img
                    className="absolute bottom-2.5 left-2.5 w-[80px] rounded-xl border-2 border-white"
                    src="./logo.png"
                    alt=""
                />
            </div>
            <div className="mx-8 mt-5 flex-1">
                <h2 className="text-3xl text-black md:max-lg:text-2xl">
                    Cà phê mười hai 21 Bông Lau 6
                </h2>
                <div className={'mt-2.5 flex' + active.status}>
                    <Dot />
                    <p className="pl-2.5">{active.text}</p>
                </div>
                <div className="mt-2.5 flex text-gray-500">
                    <Store />
                    <p className="pl-2.5 text-lg md:text-lg">
                        Số 21 phố Bông Lau 6, KĐT Phú Lộc I, Tp. Lạng Sơn
                    </p>
                </div>
                <div className="mt-2.5 flex text-gray-500">
                    <Clock />
                    <p className="pl-2.5 text-lg md:text-lg">
                        Giờ mở cửa: 07:00 - 22:45
                    </p>
                </div>
                <div className="mt-2.5 flex text-gray-500">
                    <PhoneCall />
                    <p className="pl-2.5 text-lg md:text-lg">
                        Số điện thoại cửa hàng: 0398810012
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Header
