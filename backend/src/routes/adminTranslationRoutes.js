const express = require("express");

const {
  getAdminTranslationQuestions,
  getAdminQuestionTranslations,
  saveAdminQuestionTranslations,
} = require("../controllers/adminTranslationController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/questions", getAdminTranslationQuestions);

router.get("/questions/:questionId", getAdminQuestionTranslations);

router.put("/questions/:questionId", saveAdminQuestionTranslations);

module.exports = router;
