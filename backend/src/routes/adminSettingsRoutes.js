const express = require("express");

const {
  getAdminSettings,
  updateUserCleanupSettings,
  previewUserCleanup,
  runUserCleanup,
} = require("../controllers/adminSettingsController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect all settings routes      */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);
router.put('/announcement', require('../controllers/announcementController').updateAnnouncement);

/* -------------------------------- */
/* Settings routes                  */
/* -------------------------------- */

router.get("/", getAdminSettings);

router.put("/user-cleanup", updateUserCleanupSettings);

router.get("/user-cleanup/preview", previewUserCleanup);

router.post("/user-cleanup/run", runUserCleanup);

module.exports = router;
