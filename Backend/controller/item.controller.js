import {
  createItemService,
  getAllItemsService,
  getItemByIdService,
  updateItemService,
  deleteItemService,
} from "../services/item.service.js";

// controller/item.controller.js
export const createItem = async (req, res) => {
  try {
    const item = await createItemService(req.body);
    res.status(201).json({ success: true, message: "Item created", item });
  } catch (error) {
    const isValidationError =
      error.message.includes("required") ||
      error.message.includes("%") ||
      error.message.includes("Schedule");
    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await updateItemService(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ success: true, message: "Item updated", item });
  } catch (error) {
    const isValidationError =
      error.message.includes("required") ||
      error.message.includes("%") ||
      error.message.includes("Schedule");
    res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await getAllItemsService();
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await getItemByIdService(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// controller/item.controller.js
export const deleteItem = async (req, res) => {
  try {
    const item = await deleteItemService(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "Item deleted successfully", item });
  } catch (error) {
    console.error("❌ Delete Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
