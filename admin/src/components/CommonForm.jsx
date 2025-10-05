import React, { Fragment } from 'react'

const CommonForm = ({
    formControls = [],
    formData = {},
    setFormData,
    onSubmit,
    buttonText,
    isButtonDisabled,
}) => {
    const renderInput = (controlItem, parentName, index) => {
        let element = null

        const getValue = () => {
            if (!parentName) return formData[controlItem.name] ?? ''
            if (typeof index === 'number') {
                return (
                    (formData[parentName] && formData[parentName][index]
                        ? formData[parentName][index][controlItem.name]
                        : '') ?? ''
                )
            }

            return (
                (formData[parentName] &&
                    formData[parentName][controlItem.name]) ??
                ''
            )
        }

        const value = getValue()

        const setValue = (next) => {
            if (!parentName) {
                setFormData({ ...formData, [controlItem.name]: next })
                return
            }

            if (typeof index === 'number') {
                const arr = [...(formData[parentName] || [])]
                arr[index] = { ...(arr[index] || {}) }
                arr[index][controlItem.name] = next
                setFormData({ ...formData, [parentName]: arr })
                return
            }

            setFormData({
                ...formData,
                [parentName]: {
                    ...(formData[parentName] || {}),
                    [controlItem.name]: next,
                },
            })
        }

        switch (controlItem.component) {
            case 'input': {
                let display = value
                if (controlItem.type === 'number') {
                    if (
                        value === '' ||
                        value === null ||
                        value === undefined ||
                        value === 0
                    ) {
                        display = ''
                    } else if (typeof value === 'number') {
                        display = value.toString()
                    }
                }

                element = (
                    <input
                        id={controlItem.name}
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        className={`${controlItem?.disabled ? 'cursor-not-allowed disabled:bg-gray-50' : ''} rounded-lg border border-gray-300 p-2 focus-visible:border-gray-500 focus-visible:outline-none`}
                        value={display}
                        onChange={(e) => setValue(e.target.value)}
                        {...(controlItem?.disabled ? { disabled: true } : null)}
                    />
                )
                break
            }

            case 'select': {
                let selectValue = value
                if (selectValue === undefined || selectValue === null)
                    selectValue = ''

                if (Array.isArray(selectValue)) selectValue = ''

                element = (
                    <select
                        className="rounded-lg border border-gray-300 p-2 focus-visible:border-gray-500 focus-visible:outline-none"
                        value={selectValue}
                        onChange={(e) => setValue(e.target.value)}
                    >
                        <option value="" disabled>
                            {controlItem.placeholder}
                        </option>
                        {controlItem.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )
                break
            }

            case 'switch':
                element = (
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => setValue(e.target.checked)}
                    />
                )
                break

            default:
                element = null
        }

        return element
    }

    const renderDynamicArray = (controlItem) => {
        const array = formData[controlItem.name] || []

        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label>{controlItem.label}</label>
                    <button
                        type="button"
                        className="btn btn-sm shadow-none"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                [controlItem.name]: [
                                    ...array,
                                    Object.fromEntries(
                                        controlItem.fields.map((f) => [
                                            f.name,
                                            f.type === 'number' ? '' : '',
                                        ])
                                    ),
                                ],
                            })
                        }
                    >
                        Thêm
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {array.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            {controlItem.fields.map((f) => (
                                <div
                                    key={f.name}
                                    className="flex flex-col gap-1"
                                >
                                    <p className="text-sm">{f.label}</p>
                                    {renderInput(f, controlItem.name, idx)}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm shadow-none"
                                onClick={() => {
                                    const next = array.filter(
                                        (_, i) => i !== idx
                                    )
                                    setFormData({
                                        ...formData,
                                        [controlItem.name]: next,
                                    })
                                }}
                            >
                                Xoá
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderDynamicField = (controlItem) => {
        const array = formData[controlItem.name] || []

        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label>{controlItem.label}</label>
                    <button
                        type="button"
                        className="btn btn-sm shadow-none"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                [controlItem.name]: [
                                    ...array,
                                    Object.fromEntries(
                                        controlItem.fields.map((f) => [
                                            f.name,
                                            f.type === 'number'
                                                ? ''
                                                : f.component === 'switch'
                                                  ? false
                                                  : '',
                                        ])
                                    ),
                                ],
                            })
                        }
                    >
                        Thêm
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {array.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            {controlItem.fields.map((f) => (
                                <div
                                    key={f.name}
                                    className="flex flex-col gap-1"
                                >
                                    <p className="text-sm">{f.label}</p>
                                    {renderInput(f, controlItem.name, idx)}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm shadow-none"
                                onClick={() => {
                                    const next = array.filter(
                                        (_, i) => i !== idx
                                    )
                                    setFormData({
                                        ...formData,
                                        [controlItem.name]: next,
                                    })
                                }}
                            >
                                Xoá
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
                {formControls.map((controlItem) => {
                    if (controlItem.type === 'dynamicArray') {
                        return (
                            <Fragment key={controlItem.name}>
                                {renderDynamicArray(controlItem)}
                            </Fragment>
                        )
                    }

                    if (controlItem.type === 'dynamicField') {
                        return (
                            <Fragment key={controlItem.name}>
                                {renderDynamicField(controlItem)}
                            </Fragment>
                        )
                    }

                    if (controlItem.name === 'temperature') {
                        return (
                            <div
                                key={controlItem.name}
                                className="flex flex-col gap-2"
                            >
                                <p>{controlItem.label}</p>
                                {renderInput(controlItem)}
                            </div>
                        )
                    }

                    if (controlItem.name === 'isDefaultTemperature') {
                        if (formData.temperature === 'hot_ice') {
                            return (
                                <div
                                    key={controlItem.name}
                                    className="flex flex-col gap-2"
                                >
                                    <p>{controlItem.label}</p>
                                    {renderInput(controlItem)}
                                </div>
                            )
                        }
                        return null
                    }

                    return (
                        <div
                            key={controlItem.name}
                            className="flex flex-col gap-2"
                        >
                            <p>{controlItem.label}</p>
                            {renderInput(controlItem)}
                        </div>
                    )
                })}

                <button
                    type="submit"
                    className="btn rounded-lg border-2 border-gray-500"
                    disabled={isButtonDisabled}
                >
                    {buttonText || 'Gửi'}
                </button>
            </div>
        </form>
    )
}

export default CommonForm
