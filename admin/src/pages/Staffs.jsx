// ===== IMPORTS =====
import { ChevronLeft, RotateCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CommonForm from '../components/CommonForm'
import ListLayout from '../components/ListLayout'
import Toast from '../components/Toast'
import { addStaffForm, updateStaffForm } from '../config/form'
import { useCrudHandlers } from '../hooks/useCrudHandlers'
import { useFormWithToast } from '../hooks/useFormWithToast'
import {
    addStaff,
    deleteStaff,
    getAllStaff,
    getStaff,
    updateStaff,
} from '../store/admin/staffSlice'

// ===== CONSTANTS =====
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

// ===== COMPONENT =====
const Staffs = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { staffs = [] } = useSelector((state) => state.adminStaff)

    // ===== LOCAL STATE =====
    const [currentUpdateId, setCurrentUpdateId] = useState('')

    // ===== CUSTOM HOOKS =====
    const { formData, setFormData, resetForm, showToast, showToastMessage } =
        useFormWithToast(initialState)
    const { handleCrudAction } = useCrudHandlers({
        showToastMessage,
        resetForm,
        setCurrentUpdateId,
        dispatch,
        refetch: getAllStaff,
    })

    // ===== EFFECTS =====
    useEffect(() => {
        dispatch(getAllStaff())
    }, [dispatch])

    // ===== HANDLERS =====
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
        handleCrudAction(
            dispatch(updateStaff({ id: currentUpdateId, formData })),
            {
                errorConditions: [
                    {
                        message: 'Không có quyền truy cập',
                        displayMessage:
                            'Bạn không có quyền cập nhật vai trò này',
                    },
                ],
            }
        )
    }

    const handleDelete = (id) => {
        handleCrudAction(dispatch(deleteStaff(id)), {
            errorConditions: [{ message: 'Không đủ quyền xóa nhân viên này' }],
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleCrudAction(dispatch(addStaff(formData)), {
            errorConditions: [
                {
                    message: 'Bạn không có quyền tạo nhân viên với vai trò này',
                },
                { message: 'Username đã tồn tại' },
            ],
            shouldResetForm: true,
        })
    }

    // ===== RENDER =====
    return (
        <>
            <Toast showToast={showToast} />
            <div className="drawer drawer-end xl:drawer-open gap-2">
                <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    onChange={() => {
                        setCurrentUpdateId('')
                        resetForm()
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
                                    resetForm()
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

// ===== EXPORTS =====
export default Staffs
