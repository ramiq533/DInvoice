import mongoose from "mongoose";

const userManagementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    userType: {
      type: String,
      enum: ["Admin", "Customer", "Employee"],
      default: "Customer",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const UserManagement = mongoose.model(
  "UserManagement",
  userManagementSchema
);
