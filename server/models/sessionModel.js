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
