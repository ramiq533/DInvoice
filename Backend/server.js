import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
// app.use("/api/product", productRoutes);

// Example protected test route (optional)
// import { protect } from "./middleware/auth.middleware.js";
// app.get("/api/protected", protect, (req, res) => {
//   res.json({ message: `Welcome ${req.user.email}! You are authorized.` });
// });

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 DInvoice Auth API is running successfully!");
});

// ✅ 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
