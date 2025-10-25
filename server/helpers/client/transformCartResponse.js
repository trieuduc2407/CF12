/**
 * Transform cart response để đổi productId → product khi đã populate
 * Giúp frontend dễ hiểu: "product" (object) thay vì "productId" (confusing)
 */
const transformCartResponse = (cart) => {
    if (!cart) return null

    const cartObj = cart.toObject()

    if (cartObj.items && Array.isArray(cartObj.items)) {
        cartObj.items = cartObj.items.map((item) => {
            const { productId, ...rest } = item
            return {
                ...rest,
                product: productId,
            }
        })
    }

    return cartObj
}

export { transformCartResponse }
