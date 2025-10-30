import {
    ChevronLeft,
    CircleEllipsis,
    CirclePlus,
    RotateCcw,
    Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CommonForm from '../components/CommonForm'
import ListLayout from '../components/ListLayout'
import Searchbar from '../components/Searchbar'
import Toast from '../components/Toast'
import { addIngredientForm } from '../config/form'
import { useCrudHandlers } from '../hooks/useCrudHandlers'
import { useDebounce } from '../hooks/useDebounce'
import { useFormWithToast } from '../hooks/useFormWithToast'
import {
    addIngredient,
    deleteIngredient,
    getAllIngredients,
    getIngredient,
    searchIngredient,
    updateIngredient,
} from '../store/admin/storageSlice'
import validateFormData from '../utils/validateFormData'

const initialState = {
    name: '',
    quantity: '',
    unit: '',
    threshold: '',
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
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [sortBy, setSortBy] = useState('ratio')
    const [sortOrder, setSortOrder] = useState('asc')
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showMobileSearch, setShowMobileSearch] = useState(false)

    const { formData, setFormData, resetForm, showToast, showToastMessage } =
        useFormWithToast(initialState)
    const debouncedQuery = useDebounce(query, 500)
    const errors = validateFormData(addIngredientForm, formData)
    const dispatch = useDispatch()
    const { ingredients = [] } = useSelector((state) => state.adminStorage)

    const { handleCrudAction } = useCrudHandlers({
        showToastMessage,
        resetForm,
        setCurrentUpdateId,
        dispatch,
        refetch: getAllIngredients,
    })

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

    useEffect(() => {
        dispatch(getAllIngredients())
    }, [dispatch])

    useEffect(() => {
        if (debouncedQuery) {
            dispatch(searchIngredient(debouncedQuery)).then((data) => {
                if (data?.payload?.success) {
                    setSearchResults(data.payload.data)
                }
            })
        }
    }, [debouncedQuery, dispatch])

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }
    }

    const onChange = (event) => {
        setQuery(event.target.value)
    }

    const handleMobileSearchBlur = () => {
        setTimeout(() => {
            if (!query && showMobileSearch) {
                setShowMobileSearch(false)
            }
        }, 150)
    }

    const handleMobileSearchClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowMobileSearch(false)
        setQuery('')
    }

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
        handleCrudAction(
            dispatch(updateIngredient({ id: currentUpdateId, formData })),
            {
                successMessage: 'Cập nhật nguyên liệu thành công',
                errorConditions: [
                    {
                        message:
                            'Xảy ra lỗi khi cập nhật nguyên liệu: Tên nguyên liệu đã tồn tại',
                    },
                ],
                shouldResetForm: true,
            }
        )
    }

    const handleDelete = (id) => {
        handleCrudAction(dispatch(deleteIngredient(id)), {
            successMessage: 'Xóa nguyên liệu thành công',
            toastType: 'error',
            shouldCloseDrawer: false,
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        handleCrudAction(dispatch(addIngredient(formData)), {
            successMessage: 'Thêm nguyên liệu thành công',
            errorConditions: [{ message: 'Nguyên liệu đã tồn tại' }],
            shouldResetForm: true,
        })
    }

    return (
        <>
            <Toast showToast={showToast} />

            <div
                id="search-bar"
                className={`fixed left-0 right-0 top-0 z-30 bg-white pt-4 shadow-md transition-all duration-200 md:hidden ${showMobileSearch ? '' : 'hidden'}`}
            >
                <Searchbar
                    searchName="nguyên liệu"
                    onChange={onChange}
                    value={query}
                    onBlur={handleMobileSearchBlur}
                    onClose={handleMobileSearchClose}
                />
            </div>

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
                    <div className="fab z-20 md:hidden" id="main-fab-storage">
                        <div
                            id="main-fab-storage-trigger"
                            tabIndex={0}
                            role="button"
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                        >
                            <CircleEllipsis />
                        </div>
                        <button
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                            onClick={(e) => {
                                document.getElementById('my-drawer').checked =
                                    true
                                document
                                    .getElementById('main-fab-storage-trigger')
                                    .blur()
                                e.currentTarget.blur()
                            }}
                        >
                            <CirclePlus />
                        </button>
                        <button
                            className="btn btn-lg btn-circle border-0 bg-amber-500"
                            onClick={(e) => {
                                setShowMobileSearch(true)
                                setTimeout(() => {
                                    const input =
                                        document.getElementById('menu-search')
                                    if (input) input.focus()
                                }, 50)
                                document
                                    .getElementById('main-fab-storage-trigger')
                                    .blur()
                                e.currentTarget.blur()
                            }}
                        >
                            <Search />
                        </button>
                    </div>

                    <div className="my-4 hidden items-center justify-end md:flex xl:m-0">
                        <Searchbar
                            searchName="nguyên liệu"
                            onChange={onChange}
                            value={query}
                        />
                        <label
                            htmlFor="my-drawer"
                            className="drawer-button btn mb-4 ml-2 xl:hidden"
                        >
                            Thêm nguyên liệu
                        </label>
                    </div>

                    {debouncedQuery ? (
                        searchResults.length > 0 ? (
                            <ListLayout
                                listLabel={listLabel}
                                listItem={searchResults}
                                handleUpdate={getIngredientData}
                                handleDelete={handleDelete}
                                labelMap={unitMap}
                                handleSort={handleSort}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                            />
                        ) : (
                            <p className="text-center text-lg font-semibold">
                                Không tìm thấy nguyên liệu
                            </p>
                        )
                    ) : (
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
                    )}
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
                                    resetForm()
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
