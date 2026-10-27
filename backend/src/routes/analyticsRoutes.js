const express = require("express");

const { trackAnalyticsEvent } = require("../controllers/analyticsController");

const optionalAuth = require("../middlewares/optionalAuth");

const router = express.Router();

/* -------------------------------- */
/* Public analytics routes          */
/* -------------------------------- */

router.post("/events", optionalAuth, trackAnalyticsEvent);

module.exports = router;
