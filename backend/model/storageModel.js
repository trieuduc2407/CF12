import mongoose from "mongoose";

const storageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        unit: { type: String, required: true }, // "gram", "ml", "piece"
        threshold: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now },

    }
);

const storageModel = mongoose.models.storage || mongoose.model("storage", storageSchema);

export default storageModel;