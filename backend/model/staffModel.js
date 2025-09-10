import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, enum: ["admin", "cashier", "barista", "waiter"], required: true },
        username: { type: String, unique: true, required: true },
        passwordHash: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        lastLogin: { type: Date },
    }
);

const staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema);

export default staffModel;
