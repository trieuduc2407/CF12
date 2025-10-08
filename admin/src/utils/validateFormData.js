const validateFormData = (formControls, formData) => {
    const errors = {}
    formControls.forEach(control => {
        const value = formData[control.name]
        if (control.required && (value === undefined || value === null || value === '')) {
            errors[control.name] = `${control.label || control.name} không được để trống`
        }

        if (control.type === 'number' && value !== undefined && value !== null && value !== '') {
            if (isNaN(Number(value))) {
                errors[control.name] = `${control.label || control.name} phải là số`
            }

            if (control.required && value <= 0) {
                errors[control.name] = `${control.label || control.name} phải lớn hơn 0`
            }
        }
        // Có thể bổ sung kiểm tra cho select, email, password, v.v.
    })

    return errors
}
export default validateFormData