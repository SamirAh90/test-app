const express = require("express");

const {
  getAdminPaymentSettings,
  updateAdminPaymentSettings,
} = require("../controllers/adminPaymentSettingsController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect payment settings routes  */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* Payment settings                 */
/* -------------------------------- */

router.get("/", getAdminPaymentSettings);

router.put("/", updateAdminPaymentSettings);

module.exports = router;
