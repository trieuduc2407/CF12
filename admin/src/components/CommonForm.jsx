import React, { Fragment, useState } from 'react'

const CommonForm = ({
    formControls = [],
    formData = {},
    setFormData,
    onSubmit,
    buttonText,
    isButtonDisabled,
    errors = {},
}) => {
    const [showToast, setShowToast] = useState({
        show: false,
        type: '',
        text: '',
    })
    const [touched, setTouched] = useState({})

    // Hàm tạo key cho touched
    const getTouchedKey = (name, parentName, idx) => {
        if (parentName && typeof idx === 'number')
            return `${parentName}-${idx}-${name}`
        if (parentName) return `${parentName}-${name}`
        return name
    }

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

        // Đánh dấu field đã touched
        const key = getTouchedKey(controlItem.name, parentName, index)
        const setFieldTouched = () =>
            setTouched((prev) => ({ ...prev, [key]: true }))

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
                const showError =
                    errors && errors[controlItem.name] && touched[key]
                const errorClass = showError
                    ? 'border-red-500'
                    : 'border-gray-300'
                element = (
                    <input
                        id={controlItem.name}
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        className={`${controlItem?.disabled ? 'cursor-not-allowed disabled:bg-gray-50' : ''} rounded-lg border ${errorClass} p-2 focus-visible:border-gray-500 focus-visible:outline-none`}
                        value={display}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={setFieldTouched}
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
                const showError =
                    errors && errors[controlItem.name] && touched[key]
                const errorClass = showError
                    ? 'border-red-500'
                    : 'border-gray-300'
                element = (
                    <select
                        className={`rounded-lg border ${errorClass} p-2 focus-visible:border-gray-500 focus-visible:outline-none`}
                        value={selectValue}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={setFieldTouched}
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
                                    {/* Hiển thị lỗi nếu có */}
                                    {typeof errors === 'object' &&
                                        errors[f.name] &&
                                        touched[
                                            getTouchedKey(
                                                f.name,
                                                controlItem.name,
                                                idx
                                            )
                                        ] && (
                                            <span className="text-red-500 text-xs">
                                                {errors[f.name]}
                                            </span>
                                        )}
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

    // Hiển thị lỗi dưới input nếu có errors prop
    return (
        <>
            {showToast.show && (
                <div className="toast toast-top toast-end">
                    <div className={`alert alert-${showToast.type}`}>
                        <span>{showToast.text}</span>
                    </div>
                </div>
            )}
            <form
                onSubmit={(event) => {
                    if (isButtonDisabled) {
                        event.preventDefault()
                        setShowToast({
                            show: true,
                            type: 'error',
                            text: 'Vui lòng kiểm tra lại thông tin',
                        })
                        setTimeout(
                            () =>
                                setShowToast({
                                    show: false,
                                    type: '',
                                    text: '',
                                }),
                            2000
                        )
                    }
                    onSubmit && onSubmit(event)
                }}
            >
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
                                    {/* Hiển thị lỗi nếu có */}
                                    {typeof errors === 'object' &&
                                        errors[controlItem.name] &&
                                        touched[
                                            getTouchedKey(controlItem.name)
                                        ] && (
                                            <span className="text-red-500 text-xs">
                                                {errors[controlItem.name]}
                                            </span>
                                        )}
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
                                        {typeof errors === 'object' &&
                                            errors[controlItem.name] &&
                                            touched[
                                                getTouchedKey(controlItem.name)
                                            ] && (
                                                <span className="text-red-500 text-xs">
                                                    {errors[controlItem.name]}
                                                </span>
                                            )}
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
                                {typeof errors === 'object' &&
                                    errors[controlItem.name] &&
                                    touched[
                                        getTouchedKey(controlItem.name)
                                    ] && (
                                        <span className="text-red-500 text-xs">
                                            {errors[controlItem.name]}
                                        </span>
                                    )}
                            </div>
                        )
                    })}
                    <button
                        type="submit"
                        className={`${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed border-none' : ''} btn rounded-lg `}
                        aria-disabled={isButtonDisabled}
                    >
                        {buttonText || 'Gửi'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default CommonForm
