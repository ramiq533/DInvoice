import {
  createUserService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
} from "../services/userManagement.service.js";

// ➕ Create User
export const createUserController = async (req, res) => {
  try {
    const { name, contact, userType, status } = req.body;

    if (!name || !contact || !userType) {
      return res.status(400).json({
        error: "Name, Contact, and User Type are required.",
      });
    }

    const newUser = await createUserService({
      name,
      contact,
      userType,
      status,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get all Users
export const getUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update User
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserService(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete User
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
