import { validateProductFields } from './validateProductFields.js'

export const parseAndValidateProductFields = (req) => {
    const { name, category, basePrice } = req.body
    const sizes = JSON.parse(req.body.sizes || '[]')
    const temperature = JSON.parse(req.body.temperature || '[]')
    const ingredients = JSON.parse(req.body.ingredients || '[]')
    const isValid = validateProductFields({
        name,
        category,
        basePrice,
        sizes,
        temperature,
        ingredients,
    })
    return {
        isValid,
        fields: { name, category, basePrice, sizes, temperature, ingredients },
    }
}
