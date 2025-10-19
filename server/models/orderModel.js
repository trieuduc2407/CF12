import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table',
        required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            name: String,
            selectedSize: { type: String, enum: ['small', 'medium', 'large'] },
            selectedTemperature: { type: String, enum: ['hot', 'ice'] },
            quantity: Number,
            price: Number,
        },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'banking'] },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending',
    },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'staff' },
    createdAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export { orderModel }
