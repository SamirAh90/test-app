const express = require("express");

const {
  getAdminSources,
  getAdminSource,
  createAdminSource,
  updateAdminSource,
  deleteAdminSource,
} = require("../controllers/adminSourceController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/", getAdminSources);
router.get("/:sourceId", getAdminSource);

router.post("/", createAdminSource);
router.put("/:sourceId", updateAdminSource);
router.delete("/:sourceId", deleteAdminSource);

module.exports = router;
