import { Clock, Dot, PhoneCall, ReceiptText, Search, Store } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const navbarItems = [
    { value: 'new', label: 'Món mới' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'signature', label: 'Đặc biệt' },
    { value: 'mixed', label: 'Sinh tố' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const Header = () => {
    const [openStatus, setOpenStatus] = useState({
        status: ' text-red-300 inactive',
        text: 'Đang đóng cửa',
    })
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeCategory, setActiveCategory] = useState(navbarItems[0].value)

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

    useEffect(() => {
        const sectionIds = navbarItems.map((item) => item.value)
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean)

        const handleScroll = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // Set sticky header state
            setIsScrolled(scrollTop > 426)

            // Skip section detection if no sections exist
            if (sections.length === 0) return

            // Check if near bottom of page
            const isNearBottom =
                scrollTop + windowHeight >= documentHeight - 100

            if (isNearBottom) {
                // Set last section as active when near bottom
                const lastSection = sections[sections.length - 1]
                if (lastSection && activeCategory !== lastSection.id) {
                    setActiveCategory(lastSection.id)
                }
                return
            }

            // Normal scroll detection - find section closest to top
            let closestSection = null
            let closestDistance = Infinity

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect()
                const distance = Math.abs(rect.top - 100) // 100px offset for header
                if (rect.top <= 120 && distance < closestDistance) {
                    closestDistance = distance
                    closestSection = section
                }
            })

            if (closestSection && activeCategory !== closestSection.id) {
                setActiveCategory(closestSection.id)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial call
        return () => window.removeEventListener('scroll', handleScroll)
    }, [activeCategory])

    const handleNavClick = (category) => {
        setActiveCategory(category.value)
        const section = document.getElementById(category.value)
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

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
                    <div className={`mt-2.5 flex ${openStatus.status}`}>
                        <Dot strokeWidth={3} />
                        <p className="pl-2.5">{openStatus.text}</p>
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
                    className={`bg-bg-base flex w-full flex-col gap-2.5 transition-all duration-300 md:hidden ${isScrolled ? 'hidden -translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
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
                                className={`h-8 cursor-pointer content-center rounded-md transition-colors ${activeCategory === category.value ? 'bg-amber-100 font-semibold text-amber-600' : 'bg-white'}`}
                                key={category.value}
                                onClick={() => handleNavClick(category)}
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
                className={`bg-bg-base sticky top-0 transition-all duration-300 md:hidden ${isScrolled ? 'z-50 translate-y-0 opacity-100' : '-z-10 -translate-y-4 opacity-0'}`}
            >
                <div className="relative bg-white p-1.5">
                    <p className="text-center text-gray-700">
                        Cà phê mười hai 21 Bông Lau 6
                    </p>
                    <Search
                        className="absolute right-5 top-2.5 text-gray-400"
                        size={16}
                    />
                </div>
                <div className="bg-bg-base grid grid-cols-3 gap-2 p-2.5">
                    {navbarItems.map((category) => (
                        <button
                            className={`h-8 cursor-pointer content-center rounded-md transition-colors ${activeCategory === category.value ? 'bg-amber-100 font-semibold text-amber-600' : 'bg-white'}`}
                            key={category.value}
                            onClick={() => handleNavClick(category)}
                        >
                            <p className="text-nowrap text-center text-sm">
                                {category.label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Header
