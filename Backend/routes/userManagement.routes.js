import express from "express";
import {
  createUserController,
  getUsersController,
  updateUserController,
  deleteUserController,
} from "../controller/userManagement.controller.js";

const router = express.Router();

router.post("/", createUserController);
router.get("/", getUsersController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
