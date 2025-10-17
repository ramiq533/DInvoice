import express from "express";
import { BuyerController } from "../controller/buyer.controller.js";

const router = express.Router();

router.post("/", BuyerController.create);
router.get("/", BuyerController.getAll);
router.get("/:id", BuyerController.getById);
router.put("/:id", BuyerController.update);
router.delete("/:id", BuyerController.delete);

export default router;
