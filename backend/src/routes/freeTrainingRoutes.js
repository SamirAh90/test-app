const express = require("express");

const {
  getFreeTrainingSession,
  getFreeTrainingStatusController,
} = require("../controllers/freeTrainingController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Free Training                    */
/* -------------------------------- */

router.get("/", authMiddleware, getFreeTrainingSession);

/* -------------------------------- */
/* Free Training status             */
/* -------------------------------- */

router.get("/status", authMiddleware, getFreeTrainingStatusController);

module.exports = router;
