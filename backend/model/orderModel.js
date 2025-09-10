import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        items: [
            {
                drinkId: { type: mongoose.Schema.Types.ObjectId, ref: "Drink" },
                name: String,
                options: mongoose.Schema.Types.Mixed,
                quantity: Number,
                price: Number,
            },
        ],
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["cash", "card", "ewallet"] },
        paymentStatus: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        createdAt: { type: Date, default: Date.now },
        paidAt: { type: Date },
    }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;