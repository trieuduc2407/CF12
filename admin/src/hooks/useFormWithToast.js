import { useState } from 'react'

/**
 * Custom hook để quản lý form state với toast notification
 * @param {Object} initialState - Initial form state
 * @returns {Object} Form state and handlers
 */
export const useFormWithToast = (initialState) => {
    const [formData, setFormData] = useState(initialState)
    const [showToast, setShowToast] = useState({
        isShow: false,
        type: '',
        text: '',
    })

    const resetForm = () => {
        setFormData(initialState)
    }

    const showToastMessage = (type, text, duration = 2000) => {
        setShowToast({
            isShow: true,
            type,
            text,
        })
        setTimeout(() => {
            setShowToast({ isShow: false, type: '', text: '' })
        }, duration)
    }

    const hideToast = () => {
        setShowToast({ isShow: false, type: '', text: '' })
    }

    return {
        formData,
        setFormData,
        resetForm,
        showToast,
        showToastMessage,
        hideToast,
    }
}
