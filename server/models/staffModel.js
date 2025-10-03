import mongoose from "mongoose"

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "staff", "employee"], required: true },
        createdAt: { type: Date, default: Date.now },
    }
)

const staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema)

export { staffModel }
