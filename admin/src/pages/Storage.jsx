import { ChevronLeft, RotateCcw } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CommonForm from '../components/CommonForm'
import ListLayout from '../components/ListLayout'
import { addIngredientForm } from '../config/form'
import {
    addIngredient,
    deleteIngredient,
    getAllIngredients,
    getIngredient,
    updateIngredient,
} from '../store/admin/storageSlice'
import validateFormData from '../utils/validateFormData'

const initialState = {
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
}

const unitMap = {
    gam: 'gam',
    ml: 'ml',
    fruit: 'quả',
}

const listLabel = [
    { name: 'name', label: 'Tên' },
    { name: 'quantity', label: 'Số lượng' },
    { name: 'unit', label: 'Đơn vị' },
    { name: 'threshold', label: 'Ngưỡng cảnh báo' },
]

const Storage = () => {
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })
    const [sortBy, setSortBy] = useState('ratio')
    const [sortOrder, setSortOrder] = useState('asc')
    const errors = validateFormData(addIngredientForm, formData)

    const dispatch = useDispatch()
    const { ingredients = [] } = useSelector((state) => state.adminStorage)

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }

    const sortedIngredients = useMemo(() => {
        if (!sortBy) return ingredients
        return [...ingredients].sort((a, b) => {
            if (sortBy === 'ratio') {
                const ratioA =
                    a.threshold === 0 ? Infinity : a.quantity / a.threshold
                const ratioB =
                    b.threshold === 0 ? Infinity : b.quantity / b.threshold
                if (ratioA < ratioB) return sortOrder === 'asc' ? -1 : 1
                if (ratioA > ratioB) return sortOrder === 'asc' ? 1 : -1
                return 0
            } else {
                if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
                if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
                return 0
            }
        })
    }, [ingredients, sortBy, sortOrder])

    const getIngredientData = (id) => {
        dispatch(getIngredient(id)).then((data) => {
            if (data?.payload?.success) {
                setFormData(data.payload.data)
                setCurrentUpdateId(data.payload.data._id)
                document.getElementById('my-drawer').checked = true
            }
        })
    }

    const handleUpdate = () => {
        dispatch(updateIngredient({ id: currentUpdateId, formData })).then(
            (data) => {
                if (
                    data?.payload?.success === false &&
                    data?.payload?.message === 'Tên nguyên liệu đã tồn tại'
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
                    dispatch(getAllIngredients())
                    setFormData(initialState)
                    setCurrentUpdateId('')
                    document.getElementById('my-drawer').checked = false
                    setShowToast({
                        isShow: true,
                        type: 'success',
                        text:
                            data?.payload?.message ||
                            'Cập nhật nguyên liệu thành công',
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
        dispatch(deleteIngredient(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getAllIngredients())
                setShowToast({
                    isShow: true,
                    type: 'error',
                    text:
                        data?.payload?.message || 'Xóa nguyên liệu thành công',
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
        dispatch(addIngredient(formData)).then((data) => {
            if (
                data?.payload?.success === false &&
                data?.payload?.message === 'Nguyên liệu đã tồn tại'
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
                dispatch(getAllIngredients())
                setFormData(initialState)
                document.getElementById('my-drawer').checked = false
                setShowToast({
                    isShow: true,
                    type: 'success',
                    text:
                        data?.payload?.message || 'Thêm nguyên liệu thành công',
                })
                setTimeout(
                    () => setShowToast({ isShow: false, text: '' }),
                    2000
                )
            }
        })
    }

    useEffect(() => {
        dispatch(getAllIngredients())
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
                            Thêm nguyên liệu
                        </label>
                    </div>
                    <ListLayout
                        listLabel={listLabel}
                        listItem={sortedIngredients}
                        handleUpdate={getIngredientData}
                        handleDelete={handleDelete}
                        labelMap={unitMap}
                        handleSort={handleSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
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
                                    ? 'Cập nhật nguyên liệu'
                                    : 'Thêm nguyên liệu'}
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
                                formControls={addIngredientForm}
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
                                        ? 'Cập nhật nguyên liệu'
                                        : 'Thêm nguyên liệu'
                                }
                                isButtonDisabled={
                                    Object.keys(errors).length > 0
                                        ? true
                                        : false
                                }
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Storage
