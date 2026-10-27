const express = require("express");

const {
  getSmartTrainingSession,
} = require("../controllers/smartTrainingController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Smart Training                   */
/* -------------------------------- */

router.get("/", authMiddleware, getSmartTrainingSession);

module.exports = router;
