import React, { Fragment, useCallback, useEffect, useState } from 'react'

import {
    getTouchedKey,
    isFormDataEmpty,
    unformatNumber,
} from '../helpers/formHelpers'
import formatNumber from '../utils/formatNumber'

const CommonForm = ({
    formControls = [],
    formData = {},
    setFormData,
    onSubmit,
    buttonText,
    isButtonDisabled,
    errors = {},
    setErrors,
}) => {
    const [showToast, setShowToast] = useState({
        show: false,
        type: '',
        text: '',
    })
    const [touched, setTouched] = useState({})

    // Get value from formData
    const getValue = useCallback(
        (controlItem, parentName, index) => {
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
        },
        [formData]
    )

    // Set value into formData
    const setValue = useCallback(
        (controlItem, next, parentName, index) => {
            let processed = next
            if (controlItem.name === 'price' || controlItem.type === 'number') {
                processed = unformatNumber(next)
                processed = processed === '' ? '' : Number(processed)
            }
            if (!parentName) {
                setFormData({ ...formData, [controlItem.name]: processed })
                return
            }
            if (typeof index === 'number') {
                const arr = [...(formData[parentName] || [])]
                arr[index] = { ...(arr[index] || {}) }
                arr[index][controlItem.name] = processed
                setFormData({ ...formData, [parentName]: arr })
                return
            }
            setFormData({
                ...formData,
                [parentName]: {
                    ...(formData[parentName] || {}),
                    [controlItem.name]: processed,
                },
            })
        },
        [formData, setFormData]
    )

    // Mark field as touched
    const setFieldTouched = useCallback((key) => {
        setTouched((prev) => ({ ...prev, [key]: true }))
    }, [])

    // Render input/select/switch control
    const renderInput = (controlItem, parentName, index) => {
        const value = getValue(controlItem, parentName, index)
        const key = getTouchedKey(controlItem.name, parentName, index)
        const showError = errors && errors[controlItem.name] && touched[key]
        const errorClass = showError ? 'border-red-500' : 'border-gray-300'

        if (controlItem.component === 'input') {
            let display = value
            if (controlItem.name === 'price' || controlItem.type === 'number') {
                display =
                    value === '' ||
                    value === null ||
                    value === undefined ||
                    value === 0
                        ? ''
                        : formatNumber(value)
            }
            return (
                <input
                    id={
                        typeof index === 'number'
                            ? parentName
                                ? `${parentName}-${index}-${controlItem.name}`
                                : `${controlItem.name}-${index}`
                            : controlItem.name
                    }
                    type="text"
                    inputMode={
                        controlItem.type === 'number' ||
                        controlItem.name === 'price'
                            ? 'numeric'
                            : undefined
                    }
                    placeholder={controlItem.placeholder}
                    // Make inputs responsive: full width on small viewports, fixed w-72 on sm+
                    className={`${controlItem?.disabled ? 'cursor-not-allowed disabled:bg-gray-50' : ''} w-auto rounded-lg border xl:text-base ${errorClass} p-2 text-xs focus-visible:border-gray-500 focus-visible:outline-none sm:text-sm md:text-base`}
                    value={display}
                    onChange={(e) =>
                        setValue(controlItem, e.target.value, parentName, index)
                    }
                    onBlur={() => setFieldTouched(key)}
                    {...(controlItem?.disabled ? { disabled: true } : null)}
                />
            )
        }
        if (controlItem.component === 'select') {
            let selectValue = value
            if (
                selectValue === undefined ||
                selectValue === null ||
                Array.isArray(selectValue)
            )
                selectValue = ''
            return (
                <select
                    className={`select w-full rounded-lg border bg-white ${errorClass} p-2 text-xs focus-visible:border-gray-500 focus-visible:outline-none sm:text-sm md:text-base xl:text-base`}
                    value={selectValue}
                    onChange={(e) =>
                        setValue(controlItem, e.target.value, parentName, index)
                    }
                    onBlur={() => setFieldTouched(key)}
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
        }
        if (controlItem.component === 'switch') {
            return (
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) =>
                        setValue(
                            controlItem,
                            e.target.checked,
                            parentName,
                            index
                        )
                    }
                />
            )
        }
        return null
    }

    // Render dynamic array field
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
                        // allow wrapping on small screens so two inputs don't overflow
                        <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2"
                        >
                            {controlItem.fields.map((f) => {
                                const key = getTouchedKey(
                                    f.name,
                                    controlItem.name,
                                    idx
                                )
                                return (
                                    <div
                                        key={f.name}
                                        // let children shrink and take full width on small screens
                                        className="flex min-w-0 flex-1 flex-col gap-1 text-xs sm:text-sm md:text-base"
                                    >
                                        <p className="text-sm">{f.label}</p>
                                        {renderInput(f, controlItem.name, idx)}
                                        {typeof errors === 'object' &&
                                            errors[f.name] &&
                                            touched[key] && (
                                                <span className="text-xs text-red-500">
                                                    {errors[f.name]}
                                                </span>
                                            )}
                                    </div>
                                )
                            })}
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

    // Render dynamic field (array of objects)
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
                        <div
                            key={idx}
                            className="flex flex-wrap items-center gap-4"
                        >
                            {controlItem.fields.map((f) => (
                                <div
                                    key={f.name}
                                    className="flex min-w-0 flex-1 flex-col gap-1 text-xs sm:text-sm md:text-base"
                                >
                                    <p className="text-xs">{f.label}</p>
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

    // Render each top-level control
    const renderControl = (controlItem) => {
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
        // Special case: only show isDefaultTemperature if temperature is hot_ice
        if (
            controlItem.name === 'isDefaultTemperature' &&
            formData.temperature !== 'hot_ice'
        ) {
            return null
        }
        const key = getTouchedKey(controlItem.name)
        return (
            <div key={controlItem.name} className="flex flex-col gap-2">
                <p>{controlItem.label}</p>
                {renderInput(controlItem)}
                {typeof errors === 'object' &&
                    errors[controlItem.name] &&
                    touched[key] && (
                        <span className="text-xs text-red-500">
                            {errors[controlItem.name]}
                        </span>
                    )}
            </div>
        )
    }

    // Reset touched and errors when formData is cleared (after submit)
    useEffect(() => {
        if (Object.keys(formData).length === 0 || isFormDataEmpty(formData)) {
            setTouched({})
            if (typeof setErrors === 'function') setErrors({})
        }
    }, [formData, setErrors])

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
                        return
                    }
                    if (onSubmit) {
                        onSubmit(event)
                        setTouched({})
                        if (typeof setErrors === 'function') setErrors({})
                    }
                }}
            >
                <div className="flex flex-col gap-4">
                    {formControls.map(renderControl)}
                    <button
                        type="submit"
                        className={`${isButtonDisabled ? 'cursor-not-allowed border-none bg-gray-400' : ''} btn rounded-lg`}
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
