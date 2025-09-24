import React from 'react'
import { EllipsisVertical } from 'lucide-react'

const ListLayout = ({
    listLabel,
    listItem,
    handleUpdate,
    handleDelete,
    labelMap,
}) => {
    return (
        <ul className="list rounded-lg bg-white text-xs md:text-lg">
            <li
                className={`grid-cols-[repeat(${listLabel.length},2fr)_1fr] list-row grid items-center font-semibold`}
            >
                {listLabel.map((label, index) => (
                    <div className="text-center" key={index}>
                        {label}
                    </div>
                ))}
            </li>
            {Object.values(listItem).map((item, index) => (
                <li
                    className={`grid-cols-[repeat(${listLabel.length},2fr)_1fr] list-row grid items-center`}
                    key={index}
                >
                    <div>{item.name}</div>
                    <div className="text-center">{item.quantity}</div>
                    <div className="text-center">
                        {labelMap[item.unit] || item.unit}
                    </div>
                    <div className="text-center">{item.threshold}</div>
                    <div className="dropdown dropdown-bottom dropdown-end flex justify-center bg-white">
                        <div
                            tabIndex={0}
                            role="button"
                            className="bg-white p-1"
                        >
                            <EllipsisVertical />
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu rounded-box z-1 w-30 gap-2 bg-white p-2 shadow-sm"
                        >
                            <li>
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        handleUpdate(item._id)
                                        document.activeElement.blur()
                                    }}
                                >
                                    Cập nhật
                                </button>
                            </li>
                            <li>
                                <button
                                    className="btn btn-error"
                                    onClick={() => {
                                        handleDelete(item._id)
                                        document.activeElement.blur()
                                    }}
                                >
                                    Xóa
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default ListLayout
