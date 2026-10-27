const express = require("express");

const {
  getPremiumTrainingSession,
} = require("../controllers/premiumTrainingController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Premium Training                 */
/* -------------------------------- */

router.get("/", authMiddleware, getPremiumTrainingSession);

module.exports = router;
