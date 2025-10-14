import jwt from "jsonwebtoken";
import { loginUser, registerUser, User } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);

    // ✅ Generate token immediately after registration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      token, // include token here
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user,
      token, // already generated in loginUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.status(200).json({
      message: "All users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
