export const buildSizesArray = (sizeOption, upsizePrice) => {
    if (sizeOption === 'upsize') {
        return [
            { name: 'M', price: 0 },
            { name: 'L', price: upsizePrice || 0 },
        ]
    }
    return [{ name: 'M', price: 0 }]
}

export const buildTemperatureArray = (tempValue, isDefaultTemperature) => {
    if (Array.isArray(tempValue)) {
        return tempValue
    }

    if (typeof tempValue === 'string' && tempValue) {
        const tempObj = { type: tempValue }
        if (tempValue === 'hot_ice' && isDefaultTemperature) {
            tempObj.defaultTemp = isDefaultTemperature
        }
        return [tempObj]
    }

    return []
}

export const buildProductPayload = (formData, image, imageUpdated = false) => {
    const payload = new FormData()
    const sizesArray = buildSizesArray(
        formData.sizeOption,
        formData.upsizePrice
    )
    const tempArr = buildTemperatureArray(
        formData.temperature,
        formData.isDefaultTemperature
    )

    payload.append('name', formData.name)
    payload.append('category', formData.category)
    payload.append('basePrice', formData.basePrice)
    payload.append('sizes', JSON.stringify(sizesArray))
    payload.append('temperature', JSON.stringify(tempArr))
    payload.append('ingredients', JSON.stringify(formData.ingredients))

    if (imageUpdated) {
        payload.append('imageUpdated', 'true')
    }
    if (image) {
        payload.append('image', image)
    }

    return payload
}
