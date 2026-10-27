const express = require("express");

const {
  saveAttempt,
  getProgressSummary,
} = require("../controllers/progressController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/attempt", authMiddleware, saveAttempt);

router.get("/summary", authMiddleware, getProgressSummary);

module.exports = router;
