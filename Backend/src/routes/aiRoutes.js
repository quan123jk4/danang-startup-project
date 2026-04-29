const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Khai báo route POST
router.post("/ai-suggest", aiController.getAiSuggestion);

module.exports = router;
