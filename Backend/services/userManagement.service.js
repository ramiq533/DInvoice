import { UserManagement } from "../models/userManagement.model.js";

// ➕ Create User
export const createUserService = async (data) => {
  const user = new UserManagement(data);
  return await user.save();
};

// 📋 Get all Users
export const getAllUsersService = async () => {
  return await UserManagement.find().sort({ createdAt: -1 });
};

// 🔍 Get User by ID
export const getUserByIdService = async (id) => {
  return await UserManagement.findById(id);
};

// ✏️ Update User
export const updateUserService = async (id, data) => {
  return await UserManagement.findByIdAndUpdate(id, data, { new: true });
};

// ❌ Delete User
export const deleteUserService = async (id) => {
  return await UserManagement.findByIdAndDelete(id);
};
