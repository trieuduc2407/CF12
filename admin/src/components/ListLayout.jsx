import { ChevronDown, ChevronUp, EllipsisVertical } from 'lucide-react'
import React from 'react'

import formatNumber from '../utils/formatNumber'

const mapList = ['unit', 'role', 'status']

const ListLayout = ({
    listLabel,
    listItem,
    handleUpdate,
    handleDelete,
    labelMap,
    handleSort,
    sortBy,
    sortOrder,
}) => {
    return (
        <ul className="list rounded-lg bg-white text-xs md:text-lg">
            <li
                className={'list-row items-center font-semibold'}
                style={{
                    gridTemplateColumns: `repeat(${listLabel.length}, 2fr) 1fr`,
                }}
            >
                {listLabel.map((key, index) => (
                    <div
                        className="flex cursor-pointer select-none items-center justify-center text-center"
                        key={index}
                        onClick={() => handleSort(key.name)}
                    >
                        {key.label}
                        {sortBy === key.name && (
                            <span>
                                {sortOrder === 'asc' ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </span>
                        )}
                    </div>
                ))}
            </li>
            {Array.isArray(listItem) &&
                listItem.map((item, index) => (
                    <li
                        className={'list-row items-center'}
                        key={index}
                        style={{
                            gridTemplateColumns: `repeat(${listLabel.length}, 2fr) 1fr`,
                        }}
                    >
                        {listLabel.map((key, i) => (
                            <div className="text-center" key={i}>
                                {mapList.includes(key.name)
                                    ? labelMap[item[key.name]] || item[key.name]
                                    : formatNumber(item[key.name] ?? '')}
                            </div>
                        ))}
                        <div className="dropdown dropdown-top dropdown-end flex justify-center bg-white">
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
