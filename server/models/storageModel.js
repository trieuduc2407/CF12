import mongoose from 'mongoose'

const storageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        unit: {
            type: String,
            required: true,
        },
        threshold: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

const storageModel =
    mongoose.models.storage || mongoose.model('storage', storageSchema)

export { storageModel }
