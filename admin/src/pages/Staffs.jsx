import React, { useEffect, useState } from 'react'
import { addStaffForm, updateStaffForm } from '../config/form'
import CommonForm from '../components/CommonForm'
import { useDispatch, useSelector } from 'react-redux'
import {
    addStaff,
    deleteStaff,
    fetchAllStaff,
    getStaff,
    updateStaff,
} from '../store/admin/staffSlice'
import ListLayout from '../components/ListLayout'
import { ChevronLeft, RotateCcw } from 'lucide-react'

const initialState = {
    name: '',
    username: '',
    password: '',
    role: '',
}

const labelMap = {
    admin: 'Quản trị viên',
    staff: 'Quản lý',
    employee: 'Nhân viên',
}

const listLabel = [
    { name: 'name', label: 'Tên' },
    { name: 'role', label: 'Chức vụ' },
]

const Staffs = () => {
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })

    const dispatch = useDispatch()
    const { staffs = [] } = useSelector((state) => state.adminStaff)

    const getStaffData = (id) => {
        dispatch(getStaff(id)).then((data) => {
            if (data?.payload?.success) {
                setFormData(data.payload.data)
                setCurrentUpdateId(data.payload.data.id)
                document.getElementById('my-drawer').checked = true
            }
        })
    }

    const handleUpdate = () => {
        dispatch(updateStaff({ id: currentUpdateId, formData })).then(
            (data) => {
                if (
                    data?.payload?.success === false &&
                    data?.payload?.message === 'Không có quyền truy cập'
                ) {
                    document.getElementById('my-drawer').checked = false
                    setShowToast({
                        isShow: true,
                        type: 'error',
                        text: 'Bạn không có quyền cập nhật vai trò này',
                    })
                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        2000
                    )
                }

                if (data?.payload?.success) {
                    dispatch(fetchAllStaff())
                    document.getElementById('my-drawer').checked = false
                    setShowToast({
                        isShow: true,
                        type: 'success',
                        text: data.payload.message,
                    })
                    setTimeout(
                        () => setShowToast({ isShow: false, text: '' }),
                        2000
                    )
                }
            }
        )
    }

    const handleDelete = (id) => {
        dispatch(deleteStaff(id)).then((data) => {
            if (
                data?.payload?.success === false &&
                data?.payload?.message === 'Không đủ quyền xóa nhân viên này'
            ) {
                document.getElementById('my-drawer').checked = false
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
                dispatch(fetchAllStaff())
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: data.payload.message,
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(addStaff(formData)).then((data) => {
            if (
                data?.payload?.success === false &&
                data?.payload?.message ===
                    'Bạn không có quyền tạo nhân viên với vai trò này'
            ) {
                document.getElementById('my-drawer').checked = false
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
            if (
                data?.payload?.success === false &&
                data?.payload?.message === 'Username đã tồn tại'
            ) {
                document.getElementById('my-drawer').checked = false
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
                dispatch(fetchAllStaff())
                setFormData(initialState)
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: data?.payload?.message,
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    useEffect(() => {
        dispatch(fetchAllStaff())
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
            <div className="drawer drawer-end xl:drawer-open gap-2">
                <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    onChange={() => {
                        setCurrentUpdateId('')
                        setFormData(initialState)
                    }}
                />
                <div className="drawer-content">
                    <div className="my-4 flex justify-end xl:m-0">
                        <label
                            htmlFor="my-drawer"
                            className="drawer-button btn xl:hidden"
                        >
                            Thêm nhân viên
                        </label>
                    </div>
                    <ListLayout
                        listLabel={listLabel}
                        listItem={staffs}
                        labelMap={labelMap}
                        handleUpdate={getStaffData}
                        handleDelete={handleDelete}
                    />
                </div>
                <div className="drawer-side rounded-lg">
                    <label
                        htmlFor="my-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu w-sm flex min-h-screen bg-white p-8">
                        <div className="flex justify-between">
                            <button
                                className="md:hidden"
                                onClick={() =>
                                    (document.getElementById(
                                        'my-drawer'
                                    ).checked = false)
                                }
                            >
                                <ChevronLeft />
                            </button>
                            <p className="p-4 text-2xl font-semibold">
                                {currentUpdateId
                                    ? 'Cập nhật nhân viên'
                                    : 'Thêm nhân viên'}
                            </p>
                            <button
                                onClick={() => {
                                    setFormData(initialState)
                                    setCurrentUpdateId('')
                                }}
                            >
                                <RotateCcw />
                            </button>
                        </div>
                        <div className="m-4">
                            <CommonForm
                                formControls={
                                    currentUpdateId
                                        ? updateStaffForm
                                        : addStaffForm
                                }
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={
                                    currentUpdateId
                                        ? (event) => {
                                              event.preventDefault()
                                              handleUpdate(currentUpdateId)
                                          }
                                        : onSubmit
                                }
                                buttonText={
                                    currentUpdateId
                                        ? 'Cập nhật nhân viên'
                                        : 'Thêm nhân viên'
                                }
                                isButtonDisabled={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Staffs
