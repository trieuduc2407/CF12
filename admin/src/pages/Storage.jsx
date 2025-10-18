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
import { addIngredientForm } from '../config/form'
import { useDebounce } from '../hooks/useDebounce'
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
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })
    const [sortBy, setSortBy] = useState('ratio')
    const [sortOrder, setSortOrder] = useState('asc')

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)
    const [searchResults, setSearchResults] = useState([])
    const [showMobileSearch, setShowMobileSearch] = useState(false)

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
                    data?.payload?.message ===
                        'Xảy ra lỗi khi cập nhật nguyên liệu: Tên nguyên liệu đã tồn tại'
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

    const onChange = (event) => {
        setQuery(event.target.value)
    }

    // Mobile searchbar: ẩn khi blur và input rỗng
    const handleMobileSearchBlur = () => {
        setTimeout(() => {
            if (!query && showMobileSearch) {
                setShowMobileSearch(false)
            }
        }, 150)
    }

    // Mobile searchbar: ẩn khi bấm X
    const handleMobileSearchClose = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowMobileSearch(false)
        setQuery('')
    }

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
    }, [debouncedQuery])

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
                        setFormData(initialState)
                    }}
                />
                <div className="drawer-content">
                    {/* FAB for mobile */}
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

                    {/* Desktop searchbar */}
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

                    {/* List layout */}
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
