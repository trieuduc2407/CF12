/**
 * Tính subTotal cho 1 item dựa trên product, size, và quantity
 * @param {Object} product - Product document từ DB
 * @param {Object} item - Item object chứa selectedSize, quantity
 * @returns {Number} - subTotal
 */
const calculateItemSubTotal = (product, item) => {
    let price = product.basePrice

    if (item.selectedSize && product.sizes && product.sizes.length > 0) {
        const sizeObj = product.sizes.find((s) => s.name === item.selectedSize)
        if (sizeObj && sizeObj.price) {
            price += sizeObj.price
        }
    }

    return price * (item.quantity || 1)
}

export { calculateItemSubTotal }