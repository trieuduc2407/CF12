const sortItem = (cartItems) => {
    if (!Array.isArray(cartItems)) return []

    return [...cartItems].sort((a, b) => {
        const nameCompare =
            a.product?.name?.localeCompare(b.product?.name || '') || 0
        if (nameCompare !== 0) return nameCompare

        const sizeA = a.selectedSize || ''
        const sizeB = b.selectedSize || ''
        const sizeCompare = sizeA.localeCompare(sizeB)
        if (sizeCompare !== 0) return sizeCompare

        const tempA = a.selectedTemperature || ''
        const tempB = b.selectedTemperature || ''
        return tempA.localeCompare(tempB)
    })
}
export default sortItem
