const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const {
  getAdminGlossary,
  getAdminGlossaryTerm,
  createAdminGlossaryTerm,
  updateAdminGlossaryTerm,
  deleteAdminGlossaryTerm,
} = require("../controllers/adminGlossaryController");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/", getAdminGlossary);

router.get("/:termId", getAdminGlossaryTerm);

router.post("/", createAdminGlossaryTerm);

router.put("/:termId", updateAdminGlossaryTerm);

router.delete("/:termId", deleteAdminGlossaryTerm);

module.exports = router;
