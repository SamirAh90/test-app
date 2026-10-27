const express = require("express");

const {
  getAdminAnalytics,
} = require("../controllers/adminAnalyticsController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect analytics routes         */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* Analytics                        */
/* -------------------------------- */

router.get("/", getAdminAnalytics);

module.exports = router;
