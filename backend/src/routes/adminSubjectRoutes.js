const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const {
  getAdminSubjects,
  getAdminSubjectById,
  createAdminSubject,
  updateAdminSubject,
  deleteAdminSubject,
} = require("../controllers/adminSubjectController");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/", getAdminSubjects);

router.get("/:subjectId", getAdminSubjectById);

router.post("/", createAdminSubject);

router.put("/:subjectId", updateAdminSubject);

router.delete("/:subjectId", deleteAdminSubject);

module.exports = router;
