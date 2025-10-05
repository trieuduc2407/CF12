import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import CommonForm from '../components/CommonForm'
import { changePasswordForm } from '../config/form'
import { changePassword, getMe } from '../store/auth/authSlice'

const initialState = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
}

const ChangePassword = () => {
    const [formData, setFormData] = useState(initialState)
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { staff } = useSelector((state) => state.auth)

    const onSubmit = (event) => {
        event.preventDefault()
        const submitData = {
            password: formData.currentPassword,
            newPassword: formData.newPassword,
        }

        dispatch(changePassword({ id: staff.id, formData: submitData })).then(
            (data) => {
                if (
                    data?.payload?.success === false &&
                    data?.payload?.message === 'Mật khẩu không đúng'
                ) {
                    setFormData(initialState)
                    setShowToast({
                        isShow: true,
                        type: 'error',
                        text: data.payload.message,
                    })
                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        2000
                    )
                }

                if (data?.payload?.success) {
                    setFormData(initialState)
                    setShowToast({
                        isShow: true,
                        type: 'success',
                        text: data.payload.message,
                    })
                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        2000
                    )
                    navigate('/admin/login')
                }
            }
        )
    }

    useEffect(() => {
        dispatch(getMe())
    }, [dispatch])

    return (
        <>
            {showToast.isShow && (
                <div className="toast toast-top toast-end">
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
                        Đổi mật khẩu
                    </p>
                    <div>
                        <CommonForm
                            formControls={changePasswordForm}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={onSubmit}
                            buttonText="Đổi mật khẩu"
                            isButtonDisabled={false}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword
