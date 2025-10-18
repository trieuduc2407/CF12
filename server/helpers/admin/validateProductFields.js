export const validateProductFields = (product) => {
    const { name, category, basePrice, sizes, temperature, ingredients } =
        product
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return { valid: false, message: 'Tên sản phẩm không được để trống' }
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
        return { valid: false, message: 'Danh mục không được để trống' }
    }
    const price = Number(basePrice)
    if (
        basePrice === null ||
        basePrice === undefined ||
        isNaN(price) ||
        price < 0
    ) {
        return { valid: false, message: 'Giá sản phẩm không hợp lệ' }
    }
    if (!Array.isArray(sizes) || sizes.length === 0) {
        return { valid: false, message: 'Kích thước không hợp lệ' }
    }
    if (
        !temperature ||
        (Array.isArray(temperature) && temperature.length === 0) ||
        (!Array.isArray(temperature) && typeof temperature !== 'object')
    ) {
        return { valid: false, message: 'Nhiệt độ không hợp lệ' }
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return { valid: false, message: 'Nguyên liệu không hợp lệ' }
    }
    return { valid: true }
}
