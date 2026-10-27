const express = require("express");

const {
  validateCoupon,
  validatePremiumCode,
  redeemPremiumCode,
} = require("../controllers/paymentCodeController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Public validation routes         */
/* -------------------------------- */

router.post("/coupon/validate", validateCoupon);

router.post("/premium/validate", validatePremiumCode);

/* -------------------------------- */
/* Authenticated redemption route   */
/* -------------------------------- */

router.post("/premium/redeem", authMiddleware, redeemPremiumCode);

module.exports = router;
