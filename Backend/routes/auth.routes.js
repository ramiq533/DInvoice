import express from "express";
import { getAllUsers, login, register } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
export default router;
