import React, { useState } from 'react'
import CommonForm from '../components/CommonForm'
import { loginForm } from '../config/form'
import { useDispatch } from 'react-redux'
import { loginStaff } from '../store/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const initialState = {
    username: '',
    password: '',
}

const Login = () => {
    const [formData, setFormData] = useState(initialState)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(loginStaff(formData)).then(data=>{
            if(data?.payload?.success){
                navigate('/admin/dashboard')
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col rounded-2xl bg-white p-10">
                <div className="flex items-center gap-4">
                    <img
                        className="h-20 w-20 rounded-lg"
                        src="/logo.png"
                        alt=""
                    />
                    <p className="text-2xl font-semibold">Cà phê mười hai</p>
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
    )
}

export default Login
