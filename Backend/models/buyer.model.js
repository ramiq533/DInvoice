import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    itemNames: [
      {
        type: String,
        required: true,
      },
    ],
    buyerAddress: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Buyer", buyerSchema);
