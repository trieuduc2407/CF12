import { Clock, Dot, PhoneCall, ReceiptText, Search, Store } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const navbarItems = [
    { value: 'new', label: 'Món mới' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố' },
    { value: 'signature', label: 'Đặc biệt' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const Header = () => {
    const [active, setActive] = useState({
        status: ' text-red-300 inactive',
        text: 'Đang đóng cửa',
    })
    const [isScrolled, setIsScrolled] = useState(false)
    useEffect(() => {
        const now = new Date()
        const hour = now.getHours()
        if (hour >= 7 && hour <= 23) {
            setActive({
                status: 'text-green-500 active',
                text: 'Đang mở cửa',
            })
        } else {
            setActive({
                status: 'text-red-400 inactive',
                text: 'Đang đóng cửa',
            })
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 426)
        }
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <div className="mb-5 flex flex-col bg-white md:flex-row md:p-5">
                <div className="relative flex-1 shrink overflow-hidden md:w-2/5">
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
                    <div className={`mt-2.5 flex ${active.status}`}>
                        <Dot strokeWidth={3} />
                        <p className="pl-2.5">{active.text}</p>
                    </div>
                    <div className="mt-2.5 flex text-gray-500">
                        <Store className="h-5 w-5 stroke-2" />
                        <p className="pl-2.5">
                            Số 21 phố Bông Lau 6, KĐT Phú Lộc I, Tp. Lạng Sơn
                        </p>
                    </div>
                    <div className="mt-2.5 flex text-gray-500">
                        <Clock className="h-5 w-5 stroke-2" />
                        <p className="pl-2.5">Giờ mở cửa: 07:00 - 22:45</p>
                    </div>
                    <div className="mt-2.5 flex text-gray-500">
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

                <div
                    className={`bg-bg-base flex w-full flex-col gap-2.5 md:hidden ${isScrolled ? 'hidden -translate-y-4' : 'translate-y-0 opacity-100'}`}
                >
                    <div className="flex w-full justify-center bg-white pb-2.5">
                        <label className="input w-[95%] rounded-xl bg-gray-100">
                            <Search className="text-gray-400" />
                            <input
                                id="header-search"
                                type="search"
                                className="grow"
                                placeholder="Bạn đang cần tìm món gì ?"
                            />
                        </label>
                    </div>
                    <ul className="bg-bg-base mx-2.5 grid grid-cols-3 gap-2">
                        {navbarItems.map((category) => (
                            <li
                                className={`h-8 content-center rounded-md bg-white`}
                                key={category.value}
                                onClick={() => setActive(true)}
                            >
                                <p className="text-nowrap text-center text-sm">
                                    {category.label}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div
                className={`bg-bg-base sticky top-0 md:hidden ${isScrolled ? 'z-50 translate-y-0 opacity-100' : '-z-10 hidden -translate-y-4'}`}
            >
                <div className="relative bg-white p-1.5">
                    <p className="text-center text-gray-700">
                        Cà phê mười hai 21 Bông Lau 6
                    </p>
                    <Search
                        className="absolute right-5 top-1 text-gray-400"
                        size={16}
                    />
                </div>
                <ul className="bg-bg-base menu grid grid-cols-3 gap-2 p-2.5">
                    {navbarItems.map((category) => (
                        <li
                            className="h-8 content-center rounded-md bg-white"
                            key={category.value}
                        >
                            <p className="text-nowrap text-center text-sm">
                                {category.label}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Header
