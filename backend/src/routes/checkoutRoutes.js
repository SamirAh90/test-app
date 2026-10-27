const express = require("express");

const { createCheckoutSession } = require("../controllers/checkoutController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Stripe Checkout                  */
/* -------------------------------- */

router.post("/create-session", authMiddleware, createCheckoutSession);

module.exports = router;
