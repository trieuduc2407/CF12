import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        items: [
            {
                drinkId: { type: mongoose.Schema.Types.ObjectId, ref: "Drink", required: true },
                name: String,
                options: mongoose.Schema.Types.Mixed,
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        status: { type: String, enum: ["active", "locked"], default: "active" },
        version: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }
);

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
