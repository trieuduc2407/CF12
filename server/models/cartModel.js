import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        clients: { type: String, index: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                selectedSize: { type: String },
                selectedTemperature: { type: String, enum: ["hot", "ice"] },
                quantity: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true, default: 0 },
        status: { type: String, enum: ["active", "locked"], default: "active" },
        version: { type: Number, default: 0 },
    },
    { timestamps: true }
)

cartSchema.index({ roomId: 1, status: 1 })

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema)

export { cartModel }
