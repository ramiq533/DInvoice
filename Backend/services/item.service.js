import Item from "../models/item.model.js";

const sanitizeNumber = (value) => {
  if (typeof value === "string") {
    return Number(value.replace("%", "").trim());
  }
  return value;
};

const validateItemData = (data) => {
  const errors = [];

  // Sanitize first
  data.stTax = sanitizeNumber(data.stTax);
  data.taxRate = sanitizeNumber(data.taxRate);

  if (!data.itemName || data.itemName.trim() === "") {
    errors.push("Item Name is required.");
  }

  if (!/^\d{6,8}$/.test(data.hsCode || "")) {
    errors.push("HS Code must be a 6–8 digit numeric value.");
  }

  if (data.stTax < 0 || data.stTax > 100) {
    errors.push("ST Tax must be between 0 and 100%.");
  }

  if (data.taxRate < 0 || data.taxRate > 100) {
    errors.push("Tax Rate must be between 0 and 100%.");
  }

  if (data.thirdSchedule) {
    if (data.saleType !== "Retail") {
      errors.push("Third Schedule items must be Retail sales only.");
    }
    if (!data.taxRate || data.taxRate !== 18) {
      errors.push("Third Schedule items must have a tax rate of 18%.");
    }
  }

  const validSaleTypes = ["Retail", "Wholesale", "Service"];
  if (!validSaleTypes.includes(data.saleType)) {
    errors.push("Sale Type must be Retail, Wholesale, or Service.");
  }

  if (data.description && data.description.length > 250) {
    errors.push("Description must not exceed 250 characters.");
  }

  return errors;
};

// 🟨 Get All Items
export const getAllItemsService = async () => {
  return await Item.find().sort({ createdAt: -1 });
};

// 🟦 Get Item by ID
export const getItemByIdService = async (id) => {
  return await Item.findById(id);
};

// 🟧 Update Item
export const updateItemService = async (id, data) => {
  const errors = validateItemData(data);
  if (errors.length > 0) throw new Error(errors.join(" | "));

  return await Item.findByIdAndUpdate(id, data, { new: true });
};

// 🟥 Delete Item
export const deleteItemService = async (id) => {
  return await Item.findByIdAndDelete(id);
};
