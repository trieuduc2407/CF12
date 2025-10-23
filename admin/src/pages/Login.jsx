import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import CommonForm from '../components/CommonForm'
import { loginForm } from '../config/form'
import { loginStaff } from '../store/auth/authSlice'

const initialState = {
    username: '',
    password: '',
}

const Login = () => {
    const [formData, setFormData] = useState(initialState)
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = async (event) => {
        event.preventDefault()

        try {
            const data = await dispatch(loginStaff(formData)).unwrap()

            if (data?.success === false) {
                setFormData(initialState)
                setShowToast({
                    isShow: true,
                    type: 'error',
                    text: data.message,
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
                return
            }

            if (data?.success) {
                // Try multiple redirect methods for Safari mobile compatibility
                // try {
                navigate('/admin/dashboard', { replace: true })
                // } catch (error) {
                // Fallback for Safari mobile
                // window.location.href = '/admin/dashboard'
                // }
            }
        } catch (error) {
            console.error('Login error:', error)
            window.location.href = '/admin/dashboard'

            setFormData(initialState)

            setShowToast({
                isShow: true,
                type: 'error',
                text:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Đã xảy ra lỗi khi đăng nhập',
            })
        }
    }
    return (
        <>
            {showToast.isShow && (
                <div
                    className="toast toast-top toast-end"
                    key={showToast.type + showToast.text}
                >
                    <div className={`alert alert-${showToast.type}`}>
                        <span>{showToast.text}</span>
                    </div>
                </div>
            )}
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col rounded-2xl bg-white p-10">
                    <div className="flex items-center gap-4">
                        <img
                            className="h-20 w-20 rounded-lg"
                            src="/logo.png"
                            alt=""
                        />
                        <p className="text-2xl font-semibold">
                            Cà phê mười hai
                        </p>
                    </div>
                    <p className="my-5 text-center text-xl font-semibold">
                        Đăng nhập
                    </p>
                    <div>
                        <CommonForm
                            formControls={loginForm}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={onSubmit}
                            buttonText="Đăng nhập"
                            isButtonDisabled={false}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
