import { Clock, Dot, PhoneCall, ReceiptText, Store } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const [openStatus, setOpenStatus] = useState({
        status: ' text-red-300 inactive',
        text: 'Đang đóng cửa',
    })

    const navigate = useNavigate()

    useEffect(() => {
        const now = new Date()
        const hour = now.getHours()
        if (hour >= 7 && hour <= 23) {
            setOpenStatus({
                status: 'text-green-500 active',
                text: 'Đang mở cửa',
            })
        } else {
            setOpenStatus({
                status: 'text-red-400 inactive',
                text: 'Đang đóng cửa',
            })
        }
    }, [])

    return (
        <>
            <div className="flex flex-col bg-white md:flex-row md:p-5">
                <div className="relative flex-1 shrink overflow-hidden md:w-2/5">
                    <button
                        className="absolute left-2.5 top-2.5 text-white"
                        onClick={() => navigate('/')}
                    >
                        <ChevronLeft />
                    </button>
                    <img
                        className="object-cover md:max-lg:max-w-sm lg:h-[270px] lg:w-[480px]"
                        src="./cover_img.png"
                        alt=""
                    />
                    <img
                        className="rounded-box absolute bottom-2.5 left-2.5 w-20 border-2 border-white"
                        src="./logo.png"
                        alt=""
                    />
                </div>
                <div className="relative m-2.5 md:w-3/5">
                    <h2 className="mt-2.5 font-semibold md:text-2xl md:font-medium lg:mt-8 lg:text-3xl">
                        Cà phê mười hai 21 Bông Lau 6
                    </h2>
                    <div className={`mt-2.5 flex ${openStatus.status}`}>
                        <Dot strokeWidth={3} />
                        <p className="pl-2.5">{openStatus.text}</p>
                    </div>
                    <div className="mt-2.5 flex items-center text-gray-500">
                        <Store className="h-5 w-5 stroke-2" />
                        <p className="pl-2.5">
                            Số 21 phố Bông Lau 6, KĐT Phú Lộc I, Tp. Lạng Sơn
                        </p>
                    </div>
                    <div className="mt-2.5 flex items-center text-gray-500">
                        <Clock className="h-5 w-5 stroke-2" />
                        <p className="pl-2.5">Giờ mở cửa: 07:00 - 22:45</p>
                    </div>
                    <div className="mt-2.5 flex items-center text-gray-500">
                        <PhoneCall className="h-5 w-5 stroke-2" />
                        <p className="pl-2.5">
                            Số điện thoại cửa hàng: 0398810012
                        </p>
                    </div>
                    <button className="absolute right-0 top-0 hidden rounded-2xl border-2 border-gray-200 bg-white p-2 text-black md:flex">
                        <ReceiptText className="text-amber-500" />
                        <p className="pl-2.5">Đơn hàng</p>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Header
