const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// API Dashboard hiện có
router.get(
  "/dashboard",
  protect,
  authorize("admin", "superadmin"),
  getDashboardStats,
);

// API Sync Data Mới (Chỉ dành cho Admin)

module.exports = router;
