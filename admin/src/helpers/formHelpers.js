export const isFormDataEmpty = (data) => {
    if (!data || typeof data !== 'object') return true
    return Object.values(data).every((val) => {
        if (Array.isArray(val)) return val.length === 0
        if (typeof val === 'object' && val !== null) return isFormDataEmpty(val)
        return val === '' || val === null || val === undefined
    })
}
export const getTouchedKey = (name, parentName, idx) => {
    if (parentName && typeof idx === 'number') return `${parentName}-${idx}-${name}`
    if (parentName) return `${parentName}-${name}`
    return name
}

export const unformatNumber = (str) => {
    if (typeof str === 'number') return str
    return str.replace(/[^\d]/g, '')
}
