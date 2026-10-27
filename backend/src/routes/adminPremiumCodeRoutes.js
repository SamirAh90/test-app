const express = require("express");

const {
  getAdminPremiumCodes,
  getAdminPremiumCode,
  createAdminPremiumCode,
  updateAdminPremiumCode,
  deleteAdminPremiumCode,
} = require("../controllers/adminPremiumCodeController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect premium code routes      */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* Premium code routes              */
/* -------------------------------- */

router.get("/", getAdminPremiumCodes);

router.get("/:premiumCodeId", getAdminPremiumCode);

router.post("/", createAdminPremiumCode);

router.put("/:premiumCodeId", updateAdminPremiumCode);

router.delete("/:premiumCodeId", deleteAdminPremiumCode);

module.exports = router;
