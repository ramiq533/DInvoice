import { BuyerService } from "../services/buyer.service.js";

export const BuyerController = {
  async create(req, res) {
    try {
      const buyer = await BuyerService.createBuyer(req.body);
      res.status(201).json({ success: true, data: buyer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const buyers = await BuyerService.getAllBuyers();
      res.status(200).json({ success: true, data: buyers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const buyer = await BuyerService.getBuyerById(req.params.id);
      if (!buyer)
        return res
          .status(404)
          .json({ success: false, message: "Buyer not found" });
      res.status(200).json({ success: true, data: buyer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const buyer = await BuyerService.updateBuyer(req.params.id, req.body);
      if (!buyer)
        return res
          .status(404)
          .json({ success: false, message: "Buyer not found" });
      res.status(200).json({ success: true, data: buyer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const buyer = await BuyerService.deleteBuyer(req.params.id);
      if (!buyer)
        return res
          .status(404)
          .json({ success: false, message: "Buyer not found" });
      res
        .status(200)
        .json({ success: true, message: "Buyer deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
