const express = require("express");
const realRouter = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

realRouter.post("/register", authController.register);
realRouter.post("/login", authController.login);
realRouter.post("/verify-email", authController.verifyEmail);
realRouter.delete("/:id", protect, authorize, authController.deleteUser);
realRouter.patch(
  "/:id/role",
  protect,
  authorize,
  authController.updateUserRole,
);

module.exports = realRouter;
