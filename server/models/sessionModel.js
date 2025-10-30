import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
    {
        tableName: {
            type: String,
            required: true,
            ref: 'table',
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
            default: null,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'order',
            },
        ],
        totalAmount: {
            type: Number,
            default: 0,
        },
        pointsUsed: {
            type: Number,
            default: 0,
            min: 0,
        },
        pointsDiscount: {
            type: Number,
            default: 0,
            min: 0,
        },
        finalPrice: {
            type: Number,
            default: 0,
        },
        pointsEarned: {
            type: Number,
            default: 0,
            min: 0,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null,
        },
        customerName: {
            type: String,
            default: null,
        },
        customerPhone: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true }
)

sessionSchema.index({ tableName: 1, status: 1 })
sessionSchema.index({ status: 1 })

const sessionModel =
    mongoose.models.session || mongoose.model('session', sessionSchema)

export { sessionModel }
