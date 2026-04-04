const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placesController");
const {
  protect,
  authorize,
  optionalProtect,
} = require("../middleware/authMiddleware");

// Ai cũng xem được danh sách và chi tiết
router.get("/search", placeController.searchPlaces);
router.get("/", placeController.getAllPlaces);
router.get("/:id", placeController.getPlaceDetail);
router.get("/:id/insights", optionalProtect, placeController.getPlaceInsights);

// Chỉ Admin mới được thêm địa điểm (Tạm thời dùng protect để test)
router.post("/", protect, authorize("admin"), placeController.createPlace);

module.exports = router;
