import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: false,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'session',
            required: true,
        },
        tableName: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null,
        },
        items: [
            {
                itemId: String,
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                productImage: String,
                selectedSize: {
                    type: String,
                    required: true,
                },
                selectedTemperature: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                subTotal: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: [
                'pending',
                'preparing',
                'ready',
                'served',
                'paid',
                'cancelled',
            ],
            default: 'pending',
        },
        notes: {
            type: String,
            default: '',
        },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'staff',
            default: null,
        },
    },
    { timestamps: true }
)

orderSchema.index({ orderNumber: 1 }, { unique: true })
orderSchema.index({ sessionId: 1 })
orderSchema.index({ tableName: 1, status: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

orderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const count = await mongoose.models.order.countDocuments()
        const datePrefix = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '')
        this.orderNumber = `ORD${datePrefix}${String(count + 1).padStart(4, '0')}`
    }
    next()
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export { orderModel }
