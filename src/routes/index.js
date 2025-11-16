// src/routes/index.js
import { Router } from "express";

// Import available route modules
import authRoutes from "./auth.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = Router();

// ----------------------------------
// Health Check Route
// ----------------------------------
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀",
  });
});

// ----------------------------------
// Mount All Routes
// ----------------------------------

// Authentication routes
router.use("/auth", authRoutes);

// Analytics routes
router.use("/analytics", analyticsRoutes);

export default router;
