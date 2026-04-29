const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware"); // Middleware check token

// API Dashboard: Bắt buộc đăng nhập (protect) và có role admin (authorize)
router.get(
  "/dashboard",
  protect,
  authorize("admin", "superadmin"),
  getDashboardStats,
);

module.exports = router;
