import React from 'react'

const InsufficientIngredientsModal = ({
    isOpen,
    onClose,
    unavailableItems,
}) => {
    if (!isOpen || !unavailableItems || unavailableItems.length === 0) {
        return null
    }

    return (
        <dialog
            id="insufficient_ingredients_modal"
            className="modal"
            open={isOpen}
        >
            <div className="modal-box rounded-lg bg-white">
                <h3 className="text-lg font-bold text-red-500">
                    Không đủ nguyên liệu
                </h3>
                <p className="py-2 text-sm">
                    Một số món trong giỏ hàng không đủ nguyên liệu để chế biến:
                </p>
                <div className="space-y-2">
                    {unavailableItems.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-lg bg-red-50 p-2 text-sm"
                        >
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-gray-600">
                                Yêu cầu: {item.requested} phần | Còn lại:{' '}
                                {item.available} phần
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                    Vui lòng giảm số lượng hoặc xóa món khỏi giỏ hàng.
                </p>
                <div className="modal-action">
                    <button
                        className="btn rounded-lg border-0 bg-amber-500 text-white"
                        onClick={onClose}
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    )
}

export default InsufficientIngredientsModal
