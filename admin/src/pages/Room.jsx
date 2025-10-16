import React from 'react'
import { useState } from 'react'

const initialState = {
    tableId: '',
    status: 'available',
    activeCartId: '',
}

const listLabel = [
    { name: 'tableId', label: 'Mã bàn' },
    { name: 'status', label: 'Trạng thái' }
]

const Room = () => {
    const [formData, setFormData] = useState(initialState)
    const [currentUpdateId, setCurrentUpdateId] = useState('')
    // const [showToast, setShowToast] = useState({
    //     isShow: false,
    //     type: '',
    //     text: '',
    // })

    // const dispatch = useDispatch()
    // const { staffs = [] } = useSelector((state) => state.adminStaff)

    return (
        <>
            {/* {showToast.isShow &&
                (console.log('showToast', showToast) || (
                    <div className="toast toast-top toast-end">
                        <div className={`alert alert-${showToast.type}`}>
                            <span>{showToast.text}</span>
                        </div>
                    </div>
                ))} */}
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

export default Room
