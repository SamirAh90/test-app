const express = require("express");

const {
  getPublicPaymentSettings,
} = require("../controllers/adminPaymentSettingsController");

const router = express.Router();

router.get("/", getPublicPaymentSettings);

module.exports = router;
