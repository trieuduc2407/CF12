import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    points: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export { userModel }
