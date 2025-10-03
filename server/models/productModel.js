import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, enum: ['coffee', 'mixed', 'milktea', 'yogurt'], required: true },
        basePrice: { type: Number, required: true },
        sizes: [
            {
                name: { type: String },
                price: { type: Number },
            },
        ],
        temperature: [
            {
                type: {
                    type: String,
                    enum: ["hot", "ice", 'hot_ice'],
                    required: true,
                },
                isDefault: { type: Boolean, default: false },
            },
        ],
        ingredients: [
            {
                ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "storage" },
                amount: Number,
            },
        ],
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true },
        available: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
)

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export { productModel }