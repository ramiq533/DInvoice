import express from "express";
import {
  getAllUsers,
  login,
  register,
  verifyOtpController,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtpController);
router.get("/users", getAllUsers);

export default router;
