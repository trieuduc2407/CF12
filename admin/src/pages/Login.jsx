import axios from 'axios'
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

    const onSubmit = (event) => {
        event.preventDefault()

        const isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        console.log('Form submitted on iOS:', isIOS)
        console.log('Form data:', formData)

        if (isIOS) {
            // Sử dụng axios trực tiếp cho iOS
            console.log('Using direct axios for iOS')
            axios
                .post(
                    import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/login',
                    formData,
                    { withCredentials: true }
                )
                .then((response) => {
                    console.log('iOS Login response:', response.data)

                    if (response.data?.success === false) {
                        console.log('iOS Login failed:', response.data.message)
                        setFormData(initialState)
                        setShowToast({
                            isShow: true,
                            type: 'error',
                            text: response.data.message,
                        })
                        setTimeout(
                            () => setShowToast({ isShow: false, text: '' }),
                            2000
                        )
                        return
                    }

                    if (response.data?.success) {
                        console.log('iOS Login successful, redirecting...')
                        // Cập nhật Redux state
                        dispatch({
                            type: 'adminAuth/loginStaff/fulfilled',
                            payload: response.data,
                        })

                        // Thử nhiều cách redirect cho iOS
                        setTimeout(() => {
                            try {
                                // Thử navigate trước
                                navigate('/admin/dashboard', { replace: true })
                            } catch (navError) {
                                console.warn(
                                    'Navigate failed on iOS, using window.location:',
                                    navError
                                )
                                // Fallback cho iOS
                                window.location.href = '/admin/dashboard'
                            }
                        }, 200)

                        // Fallback timeout cho iOS
                        setTimeout(() => {
                            if (window.location.pathname === '/admin/login') {
                                console.log('Fallback redirect for iOS')
                                window.location.href = '/admin/dashboard'
                            }
                        }, 1000)
                    }
                })
                .catch((error) => {
                    console.error('iOS Login error:', error)

                    setFormData(initialState)

                    setShowToast({
                        isShow: true,
                        type: 'error',
                        text:
                            error?.response?.data?.message ||
                            error?.message ||
                            'Đã xảy ra lỗi khi đăng nhập',
                    })

                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        3000
                    )
                })
        } else {
            // Sử dụng Redux thunk cho các trình duyệt khác
            console.log('Using Redux thunk for non-iOS')
            dispatch(loginStaff(formData))
                .then((result) => {
                    console.log('Login result:', result)

                    if (result?.payload?.success === false) {
                        console.log('Login failed:', result.payload.message)
                        setFormData(initialState)
                        setShowToast({
                            isShow: true,
                            type: 'error',
                            text: result.payload.message,
                        })
                        setTimeout(
                            () => setShowToast({ isShow: false, text: '' }),
                            2000
                        )
                        return
                    }

                    if (result?.payload?.success) {
                        console.log('Login successful, redirecting...')

                        setTimeout(() => {
                            try {
                                navigate('/admin/dashboard', { replace: true })
                            } catch (navError) {
                                console.warn(
                                    'Navigate failed, using window.location:',
                                    navError
                                )
                                window.location.href = '/admin/dashboard'
                            }
                        }, 100)
                    }
                })
                .catch((error) => {
                    console.error('Login error:', error)

                    setFormData(initialState)

                    setShowToast({
                        isShow: true,
                        type: 'error',
                        text:
                            error?.response?.data?.message ||
                            error?.message ||
                            'Đã xảy ra lỗi khi đăng nhập',
                    })

                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        3000
                    )
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
