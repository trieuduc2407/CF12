// ===== IMPORTS =====
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import CommonForm from '../components/CommonForm'
import Toast from '../components/Toast'
import { loginForm } from '../config/form'
import { useFormWithToast } from '../hooks/useFormWithToast'
import { loginStaff } from '../store/auth/authSlice'

// ===== CONSTANTS =====
const initialState = {
    username: '',
    password: '',
}

// ===== COMPONENT =====
const Login = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ===== CUSTOM HOOKS =====
    const { formData, setFormData, resetForm, showToast, showToastMessage } =
        useFormWithToast(initialState)

    // ===== HANDLERS =====
    const onSubmit = (event) => {
        event.preventDefault()

        dispatch(loginStaff(formData))
            .unwrap()
            .then((response) => {
                if (response?.success) {
                    navigate('/admin/dashboard', { replace: true })
                }
            })
            .catch((error) => {
                resetForm()
                showToastMessage('error', error || 'Đăng nhập thất bại', 3000)
            })
    }

    // ===== RENDER =====
    return (
        <>
            <Toast showToast={showToast} />

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

// ===== EXPORTS =====
export default Login
