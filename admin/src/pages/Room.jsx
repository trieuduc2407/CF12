import { ChevronLeft, RotateCcw } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CommonForm from '../components/CommonForm'
import ListLayout from '../components/ListLayout'
import { addTableForm, updateTableForm } from '../config/form'
import {
    addTable,
    deleteTable,
    getAllTables,
    getTableById,
    updateTable,
} from '../store/admin/tableSlice'

const initialState = {
    tableName: '',
    status: 'available',
    activeCartId: '',
}

const listLabel = [
    { name: 'tableName', label: 'Tên bàn' },
    { name: 'status', label: 'Trạng thái' },
]

const labelMap = {
    available: 'Có sẵn',
    occupied: 'Đang sử dụng',
    closed: 'Không sử dụng',
}

const Room = () => {
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })

    const { tables = [] } = useSelector((state) => state.adminTable)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllTables())
    }, [dispatch])

    const getTableData = (id) => {
        dispatch(getTableById(id)).then((data) => {
            if (data?.payload?.success) {
                setFormData({
                    tableName: data.payload.data.tableName,
                    status: data.payload.data.status,
                    activeCartId: data.payload.data.activeCartId,
                })
                setCurrentUpdateId(id)
                document.getElementById('my-drawer').checked = true
            }
        })
    }

    const handleUpdate = () => {
        dispatch(updateTable({ id: currentUpdateId, formData })).then(
            (data) => {
                if (data?.payload?.success) {
                    dispatch(getAllTables())
                    document.getElementById('my-drawer').checked = false
                    setShowToast({
                        isShow: true,
                        type: 'success',
                        text: 'Cập nhật bàn thành công',
                    })
                    setFormData(initialState)
                    setCurrentUpdateId('')
                    setTimeout(() => {
                        setShowToast({
                            isShow: false,
                            type: '',
                            text: '',
                        })
                    }, 2000)
                }
            }
        )
    }

    const handleDelete = (id) => {
        dispatch(deleteTable(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllTables())
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: 'Xóa bàn thành công',
                })
            }
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        dispatch(addTable(formData)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllTables())
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text: 'Thêm bàn thành công',
                })
                setFormData(initialState)
                setTimeout(() => {
                    setShowToast({
                        isShow: false,
                        type: '',
                        text: '',
                    })
                }, 2000)
            }
        })
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
                            Thêm bàn
                        </label>
                    </div>
                    <ListLayout
                        listLabel={listLabel}
                        listItem={tables}
                        labelMap={labelMap}
                        handleUpdate={getTableData}
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
                                {currentUpdateId ? 'Cập nhật bàn' : 'Thêm bàn'}
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
                                        ? updateTableForm
                                        : addTableForm
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
                                        ? 'Cập nhật bàn'
                                        : 'Thêm bàn'
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

export default Room
