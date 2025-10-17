import Buyer from "../models/buyer.model.js";

export const BuyerService = {
  async createBuyer(data) {
    const buyer = new Buyer(data);
    return await buyer.save();
  },

  async getAllBuyers() {
    return await Buyer.find();
  },

  async getBuyerById(id) {
    return await Buyer.findById(id);
  },

  async updateBuyer(id, data) {
    return await Buyer.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteBuyer(id) {
    return await Buyer.findByIdAndDelete(id);
  },
};
