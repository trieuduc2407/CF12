import { EllipsisVertical } from 'lucide-react'
import React from 'react'

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
                className={'list-row items-center font-semibold'}
                style={{
                    gridTemplateColumns: `repeat(${listLabel.length}, 2fr) 1fr`,
                }}
            >
                {listLabel.map((key, index) => (
                    <div className="text-center" key={index}>
                        {key.label}
                    </div>
                ))}
            </li>
            {Array.isArray(listItem)
                ? listItem.map((item, index) => (
                      <li
                          className={'list-row items-center'}
                          key={index}
                          style={{
                              gridTemplateColumns: `repeat(${listLabel.length}, 2fr) 1fr`,
                          }}
                      >
                          {listLabel.map((key, i) => (
                              <div className="text-center" key={i}>
                                  {key.name === 'unit' || key.name === 'role'
                                      ? labelMap[item[key.name]]
                                      : (item[key.name] ?? '')}
                              </div>
                          ))}
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
                                              console.log(
                                                  'Updating item:',
                                                  item._id
                                              )
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
                  ))
                : null}
        </ul>
    )
}

export default ListLayout
