const express = require("express");

const {
  startTrainingSession,
  saveTrainingAnswer,
  saveTrainingFlags,
  completeTrainingSession,
} = require("../controllers/trainingSessionController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Start / resume training session  */
/* -------------------------------- */

router.post("/start", authMiddleware, startTrainingSession);

/* -------------------------------- */
/* Save one answered question       */
/* -------------------------------- */

router.post("/:attemptId/answer", authMiddleware, saveTrainingAnswer);

/* -------------------------------- */
/* Save simulator flags             */
/* -------------------------------- */

router.put("/:attemptId/flags", authMiddleware, saveTrainingFlags);

/* -------------------------------- */
/* Complete training session        */
/* -------------------------------- */

router.post("/:attemptId/complete", authMiddleware, completeTrainingSession);

module.exports = router;
