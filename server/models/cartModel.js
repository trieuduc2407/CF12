import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        clientId: { type: String, index: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
                name: String,
                options: mongoose.Schema.Types.Mixed,
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        status: { type: String, enum: ["active", "locked"], default: "active" },
        version: { type: Number, default: 0 },
    },
    { timestamps: true }
)

cartSchema.index({ roomId: 1, clientId: 1 })
cartSchema.index({ roomId: 1, userId: 1 })

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema)

export { cartModel }
