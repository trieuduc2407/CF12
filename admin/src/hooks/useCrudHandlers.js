import { useCallback } from 'react'

/**
 * Custom hook để xử lý CRUD operations với pattern chung
 * @param {Object} options - Configuration options
 * @param {Function} options.showToastMessage - Toast notification function
 * @param {Function} options.resetForm - Reset form function
 * @param {Function} options.setCurrentUpdateId - Set current update ID function (optional)
 * @param {Function} options.dispatch - Redux dispatch function (optional)
 * @param {Function} options.refetch - Function to refetch data after success (optional)
 * @returns {Object} Handler functions
 */
export const useCrudHandlers = ({
    showToastMessage,
    resetForm,
    setCurrentUpdateId,
    dispatch,
    refetch,
}) => {
    const closeDrawer = useCallback(() => {
        const drawer = document.getElementById('my-drawer')
        if (drawer) drawer.checked = false
    }, [])

    /**
     * Generic handler cho add/update/delete operations
     * @param {Promise} actionPromise - Redux action promise
     * @param {Object} options - Handler options
     */
    const handleCrudAction = useCallback(
        async (
            actionPromise,
            {
                successMessage,
                errorConditions = [],
                onSuccess,
                shouldRefetch = true,
                shouldResetForm = false,
                shouldCloseDrawer = true,
                toastType = 'success',
            }
        ) => {
            const data = await actionPromise

            // Check error conditions
            for (const condition of errorConditions) {
                if (
                    data?.payload?.success === false &&
                    data?.payload?.message === condition.message
                ) {
                    showToastMessage(
                        'error',
                        condition.displayMessage || condition.message
                    )
                    if (shouldCloseDrawer) closeDrawer()
                    return false
                }
            }

            // Handle success
            if (data?.payload?.success) {
                // Await refetch để đảm bảo UI update trước khi cleanup
                if (shouldRefetch && refetch) {
                    if (dispatch) {
                        await dispatch(refetch())
                    } else {
                        await refetch()
                    }
                }

                // Show success message
                const message =
                    successMessage ||
                    data?.payload?.message ||
                    'Thao tác thành công'
                showToastMessage(toastType, message)

                // Delay cleanup để UI kịp render data mới
                await new Promise((resolve) => setTimeout(resolve, 100))

                if (shouldResetForm) resetForm()
                if (setCurrentUpdateId) setCurrentUpdateId('')
                if (shouldCloseDrawer) closeDrawer()
                if (onSuccess) onSuccess(data)
                return true
            }

            return false
        },
        [
            showToastMessage,
            resetForm,
            setCurrentUpdateId,
            dispatch,
            refetch,
            closeDrawer,
        ]
    )

    return {
        handleCrudAction,
        closeDrawer,
    }
}
