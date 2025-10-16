import mongoose from "mongoose"

const roomSchema = new mongoose.Schema(
    {
        tableId: { type: String, unique: true, required: true },
        status: { type: String, enum: ["available", "occupied", "closed"], default: "available" },
        activeCartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    },
    { timestamps: true }
)

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema)

export { roomModel }