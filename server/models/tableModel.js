import mongoose from "mongoose"

const tableSchema = new mongoose.Schema(
    {
        tableName: { type: String, unique: true, required: true },
        status: { type: String, enum: ["available", "occupied", "closed"], default: "available" },
        activeCartId: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    },
    { timestamps: true }
)

const tableModel = mongoose.models.table || mongoose.model("table", tableSchema)

export { tableModel }