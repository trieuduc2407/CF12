/**
 * Transform cart response để đổi productId → product khi đã populate
 * Giúp frontend dễ hiểu: "product" (object) thay vì "productId" (confusing)
 * @param {Object} cart - Cart document from DB
 * @param {Boolean} stripLockState - If true, remove locked/lockedBy fields (for broadcast events)
 */
const transformCartResponse = (cart, stripLockState = false) => {
    if (!cart) return null

    const cartObj = cart.toObject()

    if (cartObj.items && Array.isArray(cartObj.items)) {
        cartObj.items = cartObj.items.map((item) => {
            const { productId, ...rest } = item

            if (stripLockState) {
                const { locked, lockedBy, ...itemWithoutLock } = rest
                return {
                    ...itemWithoutLock,
                    product: productId,
                }
            }

            return {
                ...rest,
                product: productId,
            }
        })
    }

    return cartObj
}

export { transformCartResponse }
