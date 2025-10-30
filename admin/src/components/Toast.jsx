// ===== IMPORTS =====
import React from 'react'

// ===== COMPONENT =====
const Toast = ({ showToast }) => {
    // ===== RENDER =====
    if (!showToast.isShow) return null

    return (
        <div
            className="toast toast-top toast-end"
            key={showToast.type + showToast.text}
        >
            <div className={`alert alert-${showToast.type}`}>
                <span>{showToast.text}</span>
            </div>
        </div>
    )
}

// ===== EXPORTS =====
export default Toast
