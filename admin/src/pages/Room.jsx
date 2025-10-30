// ===== IMPORTS =====
import { ChevronLeft, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CommonForm from '../components/CommonForm'
import ListLayout from '../components/ListLayout'
import Toast from '../components/Toast'
import { addTableForm, updateTableForm } from '../config/form'
import { useCrudHandlers } from '../hooks/useCrudHandlers'
import { useFormWithToast } from '../hooks/useFormWithToast'
import {
    addTable,
    deleteTable,
    getAllTables,
    getTableById,
    updateTable,
} from '../store/admin/tableSlice'

// ===== CONSTANTS =====
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

// ===== COMPONENT =====
const Room = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { tables = [] } = useSelector((state) => state.adminTable)

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
        refetch: getAllTables,
    })

    // ===== EFFECTS =====
    useEffect(() => {
        dispatch(getAllTables())
    }, [dispatch])

    // ===== HANDLERS =====
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
        handleCrudAction(
            dispatch(updateTable({ id: currentUpdateId, formData })),
            {
                successMessage: 'Cập nhật bàn thành công',
                shouldResetForm: true,
            }
        )
    }

    const handleDelete = (id) => {
        handleCrudAction(dispatch(deleteTable(id)), {
            successMessage: 'Xóa bàn thành công',
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleCrudAction(dispatch(addTable(formData)), {
            successMessage: 'Thêm bàn thành công',
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

// ===== EXPORTS =====
export default Room
