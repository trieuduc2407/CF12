// ===== IMPORTS =====
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import CommonForm from '../components/CommonForm'
import Toast from '../components/Toast'
import { changePasswordForm } from '../config/form'
import { useFormWithToast } from '../hooks/useFormWithToast'
import { changePassword, getMe } from '../store/auth/authSlice'

// ===== CONSTANTS =====
const initialState = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
}

// ===== COMPONENT =====
const ChangePassword = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { staff } = useSelector((state) => state.adminAuth)

    // ===== CUSTOM HOOKS =====
    const { formData, setFormData, resetForm, showToast, showToastMessage } =
        useFormWithToast(initialState)

    // ===== EFFECTS =====
    useEffect(() => {
        dispatch(getMe())
    }, [dispatch])

    // ===== HANDLERS =====
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
                    resetForm()
                    showToastMessage('error', data.payload.message)
                    return
                }

                if (data?.payload?.success) {
                    resetForm()
                    showToastMessage('success', data.payload.message)
                    navigate('/admin/login')
                }
            }
        )
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

// ===== EXPORTS =====
export default ChangePassword
