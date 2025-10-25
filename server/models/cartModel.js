import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
    {
        tableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'table',
            required: true,
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        clients: [
            {
                clientId: { type: String, required: true },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            },
        ],
        items: [
            {
                itemId: { type: String, required: true, unique: false },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                selectedSize: { type: String },
                selectedTemperature: { type: String, enum: ['hot', 'ice'] },
                quantity: { type: Number, required: true, min: 1 },
                subTotal: { type: Number, required: true, min: 0 },
                locked: { type: Boolean, default: false },
                lockedBy: { type: String },
            },
        ],
        totalPrice: { type: Number, required: true, default: 0, min: 0 },
        status: { type: String, enum: ['active', 'paid'], default: 'active' },
        version: { type: Number, default: 0 },
    },
    { timestamps: true }
)

cartSchema.index(
    { tableId: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } }
)

const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema)

export { cartModel }
