import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    hsCode: { type: String, required: true },
    description: { type: String },
    stTax: { type: Number, default: 0 },
    thirdSchedule: { type: Boolean, default: false },
    saleType: {
      type: String,
      enum: ["Retail", "Wholesale", "Service"],
      default: "Retail",
    },
    taxRate: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
