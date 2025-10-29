import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { setSession } from '../store/client/sessionSlice'

const initialState = {
    name: '',
    phone: '',
}

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tableName } = useParams()

    const { clientId: storeClientId, tableName: storeTableName } = useSelector(
        (state) => state.clientSession
    )

    const [formData, setFormData] = useState(initialState)
    // const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        if (tableName && tableName === storeTableName) {
            dispatch(
                setSession({
                    tableName,
                    clientId: storeClientId,
                })
            )
        }
    }, [dispatch, tableName, storeTableName, storeClientId])

    const handleOnchange = (event) => {
        const { name, value } = event.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

        const form = event.target.form
        if (form) {
            setIsFormValid(form.checkValidity())
        }
    }

    const handleLogin = () => {
        console.log('Login data:', formData)
    }

    return (
        <div className="mt-5 flex flex-col gap-2.5 px-2.5">
            <button
                className="mb-5 flex gap-2.5"
                onClick={() => navigate(`/tables/${tableName}`)}
            >
                <ChevronLeft />
                Quay lại
            </button>
            <form className="contents">
                <div className="flex w-[90%] flex-col justify-center self-center">
                    <input
                        type="tel"
                        name="phone"
                        className="input validator border-1 user-valid:border-green-500 user-invalid:border-red-500 rounded-lg border-gray-300 tabular-nums"
                        required
                        placeholder="Số điện thoại"
                        pattern="[0-9]*"
                        minlength="10"
                        maxlength="10"
                        title="Must be 10 digits"
                        onChange={handleOnchange}
                    />
                    <p className="validator-hint">Must be 10 digits</p>
                </div>
                <div className="flex w-[90%] flex-col justify-center self-center">
                    <input
                        type="text"
                        name="name"
                        className="input validator border-1 user-valid:border-green-500 user-invalid:border-red-500 rounded-lg border-gray-300"
                        required
                        placeholder="Họ và tên"
                        pattern="[\p{L}]+(\s[\p{L}]+)+"
                        title="Vui lòng nhập đầy đủ họ và tên"
                        onChange={handleOnchange}
                    />
                    <p className="validator-hint">
                        Vui lòng nhập đầy đủ họ và tên
                    </p>
                </div>
                <button
                    type="button"
                    className={` btn-disabled btn btn-primary w-[90%] self-center rounded-lg border-0 text-white`}
                    onClick={() => handleLogin()}
                    // disabled={!isFormValid ? 'disabled' : ''}
                >
                    Tiếp tục
                </button>
            </form>
        </div>
    )
}

export default Login
