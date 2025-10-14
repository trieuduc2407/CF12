import { ReceiptText, Search, ShoppingBasket } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Card from '../components/Card'
import { getAllProducts } from '../store/client/productSlice'

const navbarItems = [
    { value: 'new', label: 'Món mới' },
    { value: 'signature', label: 'Đặc biệt' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố' },
    { value: 'milktea', label: 'Trà sữa' },
    { value: 'yogurt', label: 'Sữa chua & khác' },
]

const categoryItems = [
    { value: 'coffee', label: 'Cà phê' },
    { value: 'mixed', label: 'Sinh tố và nước ép' },
    { value: 'milktea', label: 'Trà sữa và trà hoa quả' },
    { value: 'yogurt', label: 'Sữa chua và thức uống khác' },
]

const Menu = () => {
    const dispatch = useDispatch()
    const { products = [] } = useSelector((state) => state.clientProduct)

    const latestProducts = products
        .filter((product) => product.createdAt)
        .slice(-4)
        .reverse()

    const signatureProducts = products.filter((product) => product.signature)

    const [activeCategory, setActiveCategory] = useState(navbarItems[0].value)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const sectionIds = navbarItems.map((item) => item.value)
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean)
        if (sections.length === 0) return

        const handleScroll = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // Set sticky navbar state (show when scrolled down from header)
            setIsScrolled(scrollTop > 424)

            const isNearBottom =
                scrollTop + windowHeight >= documentHeight - 100

            if (isNearBottom) {
                const lastSection = sections[sections.length - 1]
                if (lastSection && activeCategory !== lastSection.id) {
                    setActiveCategory(lastSection.id)
                }
                return
            }

            // Find section closest to top with optimized loop
            let closestSection = null
            let closestDistance = Infinity

            for (const section of sections) {
                const rect = section.getBoundingClientRect()
                const distance = Math.abs(rect.top - 100)
                if (rect.top <= 120 && distance < closestDistance) {
                    closestDistance = distance
                    closestSection = section
                }
            }

            if (closestSection && activeCategory !== closestSection.id) {
                setActiveCategory(closestSection.id)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [activeCategory])

    const handleNavClick = (category) => {
        setActiveCategory(category.value)
        const section = document.getElementById(category.value)
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    useEffect(() => {
        dispatch(getAllProducts())
    }, [dispatch])

    return (
        <>
            <div
                className={`bg-bg-base flex w-full flex-col gap-2.5 transition-all duration-300 md:hidden ${isScrolled ? 'hidden -translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
                <div className="flex w-full justify-center bg-white pb-2.5">
                    <label className="input w-[95%] rounded-lg bg-gray-100">
                        <Search className="text-gray-400" />
                        <input
                            id="menu-search"
                            type="search"
                            className="grow"
                            placeholder="Bạn đang cần tìm món gì ?"
                        />
                    </label>
                </div>
                <ul className="bg-bg-base mx-2.5 grid grid-cols-3 gap-2">
                    {navbarItems.map((category) => (
                        <li
                            className={`h-8 cursor-pointer content-center rounded-md transition-colors ${activeCategory === category.value ? 'bg-amber-500 font-semibold text-white' : 'bg-white'}`}
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

            {/* Sticky navbar cho mobile - hiển thị khi scroll */}
            <div
                className={`bg-bg-base pt-[var(--safe-top)] sticky top-0 transition-all duration-300 md:hidden ${isScrolled ? 'z-50 translate-y-0 opacity-100' : '-z-10 hidden -translate-y-4'}`}
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
                            className={`h-8 cursor-pointer content-center rounded-md transition-colors ${activeCategory === category.value ? 'bg-amber-500 font-semibold text-white' : 'bg-white'}`}
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

            <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-[1fr_3fr_2fr]">
                <div className="scrollbar-thin sticky top-2 hidden h-fit max-h-screen overflow-y-auto rounded-lg bg-white md:flex md:flex-col">
                    <div className="my-5 ml-5 text-xl font-bold text-black">
                        Danh mục
                    </div>
                    {navbarItems.map((category) => (
                        <div
                            key={category.value}
                            className={`text-md my-2 ml-5 cursor-pointer rounded-lg px-2 py-1 transition-colors ${activeCategory === category.value ? 'bg-amber-500 font-semibold text-white' : 'font-light text-black'}`}
                            onClick={() => handleNavClick(category)}
                        >
                            {category.label}
                        </div>
                    ))}
                </div>
                <div className="rounded-lg bg-white px-2.5">
                    <div className="hidden w-full justify-center bg-white pt-2.5 md:flex">
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
                    <div className="bg-white py-2.5">
                        <section
                            id="new"
                            className="grid min-h-[400px] grid-cols-2 gap-4 rounded-lg bg-gradient-to-b from-[#fff3f3] to-[#ffebc0] p-2.5"
                        >
                            <p className="col-span-full text-lg font-semibold">
                                Món mới phải thử
                            </p>

                            {latestProducts.map((product) => (
                                <Card key={product._id} product={product} />
                            ))}
                        </section>
                    </div>
                    <div className="bg-white py-2.5">
                        <section
                            id="signature"
                            className="grid min-h-[400px] grid-cols-2 gap-4 rounded-lg bg-gradient-to-b from-[#e6faff] to-[#caedc7] p-2.5"
                        >
                            <p className="col-span-full text-lg font-semibold">
                                Top bán chạy
                            </p>

                            {signatureProducts.map((product) => (
                                <Card key={product._id} product={product} />
                            ))}
                        </section>
                    </div>
                    <div className="flex flex-col divide-y-4 divide-gray-200 border-dashed bg-white pb-20">
                        {categoryItems.map((category) => (
                            <section
                                id={category.value}
                                className="grid min-h-[400px] grid-cols-2 gap-4 p-2.5"
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
                            </section>
                        ))}
                    </div>
                </div>
                <div className="hidden h-80 flex-col items-center justify-center rounded-lg bg-white md:flex">
                    <img src="./icon_cart_blank.svg" alt="" />
                    <p className="py-5 text-center text-gray-500">
                        Chưa có sản phẩm <br /> trong giỏ hàng
                    </p>
                </div>
            </div>
            <div className="mb-[var(--safe-bottom)] fixed bottom-0 flex w-full justify-between bg-gradient-to-t from-white to-transparent px-6 py-5 md:hidden">
                <button className="btn btn-sm flex flex-row border-0 bg-white py-5 shadow-none">
                    <ReceiptText className="text-amber-500" />
                    <p className="font-medium text-black"> Đơn hàng</p>
                </button>
                <button className="btn btn-sm border-0 bg-amber-500 py-5 text-white">
                    <ShoppingBasket />
                    <p>Giỏ hàng</p>
                    <p></p>
                </button>
            </div>
        </>
    )
}

export default Menu
