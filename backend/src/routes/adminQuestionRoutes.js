const express = require("express");

const {
  getAdminQuestions,
  getAdminQuestion,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} = require("../controllers/adminQuestionController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/", getAdminQuestions);
router.get("/:questionId", getAdminQuestion);

router.post("/", createAdminQuestion);
router.put("/:questionId", updateAdminQuestion);
router.delete("/:questionId", deleteAdminQuestion);

module.exports = router;
