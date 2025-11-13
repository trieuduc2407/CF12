// ===== IMPORTS =====
import { ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { setSession } from '../store/client/sessionSlice'

// ===== COMPONENT =====
const Home = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()

    // ===== ROUTER =====
    const navigate = useNavigate()
    const { tableName } = useParams()

    // ===== DERIVED STATE =====
    const clientId = localStorage.getItem('clientId')

    // ===== EFFECTS =====
    useEffect(() => {
        if (clientId && tableName) {
            dispatch(setSession({ tableName, clientId }))
        }
    }, [clientId, tableName, dispatch])

    // ===== HANDLERS =====
    const handleLogin = () => {
        navigate(`/tables/${tableName}/login`)
    }

    // ===== RENDER =====
    return (
        <>
            <div
                className="card m-5 flex-row justify-start rounded-lg bg-gradient-to-b from-[#7b2d9f] to-[#bc8266] py-5 text-3xl text-white"
                onClick={() => handleLogin()}
            >
                <div className="px-5">
                    <ShoppingBag size={48} />
                </div>
                Nhập số điện thoại để tích điểm
            </div>
            <div className="h-dvh rounded-lg bg-white">
                <div className="rounded-box flex w-full p-5 text-center text-white">
                    <div
                        style={{
                            background:
                                'radial-gradient(circle at top left, #ffce08, #fe2e00)',
                        }}
                        className="card rounded-box grid h-20 grow place-items-center"
                    >
                        Gọi thanh toán
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div
                        style={{
                            background:
                                'radial-gradient(circle at center, #ffce08, #fe2e00)',
                        }}
                        className="card rounded-box grid h-20 grow place-items-center"
                    >
                        Gọi nhân viên
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="card rounded-box grid h-20 grow place-items-center bg-blue-500 bg-opacity-50">
                        Gửi đánh giá
                    </div>
                </div>
                <div
                    onClick={() => navigate(`/tables/${tableName}/menu`)}
                    className="card m-5 h-16 justify-center bg-red-300 text-center text-3xl"
                >
                    Xem Menu - Gọi Món
                </div>
            </div>
        </>
    )
}

// ===== EXPORTS =====
export default Home
