import { ShoppingBag } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="card m-5 flex-row justify-start bg-red-300 py-5 text-3xl">
                <div className="px-5">
                    <ShoppingBag size={48} />
                </div>
                Nhập số điện thoại để tích điểm
            </div>
            <div className="h-dvh rounded-2xl bg-white">
                <div className="rounded-box flex w-full p-5">
                    <div className="card bg-base-300 rounded-box grid h-20 grow place-items-center">
                        Gọi thanh toán
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card rounded-box grid h-20 grow place-items-center bg-blue-500 bg-opacity-50">
                        Gọi nhân viên
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card rounded-box grid h-20 grow place-items-center bg-blue-500 bg-opacity-50">
                        Gửi đánh giá
                    </div>
                </div>
                <div
                    onClick={() => navigate('/menu')}
                    className="card m-5 h-16 justify-center bg-red-300 text-center text-3xl"
                >
                    Xem Menu - Gọi Món
                </div>
            </div>
        </>
    )
}

export default Home
