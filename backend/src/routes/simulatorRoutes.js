const express = require("express");

const {
  getSimulatorSession,
} = require("../controllers/simulatorController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Simulator                        */
/* -------------------------------- */

router.get(
  "/",
  authMiddleware,
  getSimulatorSession,
);

module.exports = router;