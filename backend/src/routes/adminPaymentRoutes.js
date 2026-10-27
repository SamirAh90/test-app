const express = require("express");

const {
  getPaymentStats,
  getTransactions,
  getTransactionById,
} = require("../controllers/adminPaymentController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect payment routes           */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* Payment statistics               */
/* -------------------------------- */

router.get("/stats", getPaymentStats);

/* -------------------------------- */
/* Transactions                     */
/* -------------------------------- */

router.get("/", getTransactions);

router.get("/:transactionId", getTransactionById);

module.exports = router;
