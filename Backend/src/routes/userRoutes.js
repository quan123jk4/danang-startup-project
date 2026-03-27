const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import trạm kiểm soát

// Tất cả các route ở đây đều phải đi qua trạm kiểm soát (protect)
router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);

module.exports = router;
