const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");

/* -------------------------------- */
/* Allowed training types           */
/* -------------------------------- */

const ALLOWED_TRAINING_TYPES = [
  "free",
  "premium",
  "subject",
  "smart",
  "simulator",
];

/* -------------------------------- */
/* Normalize question ID array      */
/* -------------------------------- */

const normalizeQuestionIds = (value) => {
  if (!value) {
    return [];
  }

  let questionIds = value;

  if (typeof questionIds === "string") {
    try {
      questionIds = JSON.parse(questionIds);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(questionIds)) {
    return [];
  }

  return [
    ...new Set(
      questionIds
        .map((questionId) => Number(questionId))
        .filter((questionId) => Number.isInteger(questionId)),
    ),
  ];
};

/* -------------------------------- */
/* Normalize simulator question IDs */
/* -------------------------------- */

const normalizeSimulatorQuestionIds = (value) => {
  return normalizeQuestionIds(value);
};

/* -------------------------------- */
/* Calculate attempt statistics     */
/* -------------------------------- */

const calculateAttemptStatistics = ({
  attempt,
  savedAnswers,
  completed = false,
}) => {
  const answeredQuestions = savedAnswers.length;

  const correctAnswers = savedAnswers.filter((answer) =>
    Boolean(answer.correct),
  ).length;

  const wrongAnswers = answeredQuestions - correctAnswers;

  const totalQuestions = Number(attempt.totalQuestions || 0);

  const unansweredQuestions = Math.max(0, totalQuestions - answeredQuestions);

  const percentageBase =
    completed && attempt.quizType === "simulator"
      ? totalQuestions
      : answeredQuestions;

  const percentage =
    percentageBase > 0
      ? Math.round((correctAnswers / percentageBase) * 100)
      : 0;

  return {
    answeredQuestions,
    unansweredQuestions,
    correctAnswers,
    wrongAnswers,
    totalQuestions,
    percentage,
  };
};

/* -------------------------------- */
/* Start or resume training session */
/* -------------------------------- */

const startTrainingSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const { quizType, totalQuestions, simulatorQuestionIds = [] } = req.body;

    if (!ALLOWED_TRAINING_TYPES.includes(quizType)) {
      return res.status(400).json({
        message: "Ogiltig träningstyp.",
      });
    }

    if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
      return res.status(400).json({
        message: "Antalet frågor är ogiltigt.",
      });
    }

    const normalizedSimulatorQuestionIds =
      quizType === "simulator"
        ? normalizeSimulatorQuestionIds(simulatorQuestionIds)
        : [];

    if (
      quizType === "simulator" &&
      normalizedSimulatorQuestionIds.length > 0 &&
      normalizedSimulatorQuestionIds.length !== totalQuestions
    ) {
      return res.status(400).json({
        message: "Antalet simulatorfrågor stämmer inte med träningspasset.",
      });
    }

    let attempt = await QuizAttempt.findOne({
      where: {
        userId,
        quizType,
        status: "in_progress",
      },
      order: [["startedAt", "DESC"]],
    });

    if (attempt) {
      const existingSimulatorQuestionIds = normalizeSimulatorQuestionIds(
        attempt.simulatorQuestionIds,
      );

      if (
        quizType === "simulator" &&
        existingSimulatorQuestionIds.length === 0 &&
        normalizedSimulatorQuestionIds.length > 0
      ) {
        await attempt.update({
          simulatorQuestionIds: normalizedSimulatorQuestionIds,
        });
      }

      const savedAnswers = await QuizAnswer.findAll({
        where: {
          attemptId: attempt.id,
        },
        order: [["createdAt", "ASC"]],
      });

      const statistics = calculateAttemptStatistics({
        attempt,
        savedAnswers,
        completed: false,
      });

      const flaggedQuestionIds =
        attempt.quizType === "simulator"
          ? normalizeQuestionIds(attempt.flaggedQuestionIds)
          : [];

      return res.status(200).json({
        message: "Pågående träningspass hittades.",
        resumed: true,

        attempt: {
          id: attempt.id,
          quizType: attempt.quizType,
          status: attempt.status,
          score: statistics.correctAnswers,
          totalQuestions: statistics.totalQuestions,
          percentage: statistics.percentage,

          simulatorQuestionIds:
            attempt.quizType === "simulator"
              ? normalizeSimulatorQuestionIds(attempt.simulatorQuestionIds)
              : [],

          flaggedQuestionIds,

          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
        },

        answeredQuestions: statistics.answeredQuestions,

        unansweredQuestions: statistics.unansweredQuestions,

        flaggedQuestionIds,

        answers: savedAnswers.map((answer) => ({
          id: answer.id,
          questionId: answer.questionId,
          subjectId: answer.subjectId,
          selectedAnswerId: answer.selectedAnswerId,
          correct: Boolean(answer.correct),
        })),
      });
    }

    if (
      quizType === "simulator" &&
      normalizedSimulatorQuestionIds.length === 0
    ) {
      return res.status(400).json({
        message: "Provsimulatorn saknar frågor för träningspasset.",
      });
    }

    attempt = await QuizAttempt.create({
      userId,
      quizType,
      status: "in_progress",
      score: 0,
      totalQuestions,
      percentage: 0,

      simulatorQuestionIds:
        quizType === "simulator" ? normalizedSimulatorQuestionIds : null,

      flaggedQuestionIds: quizType === "simulator" ? [] : null,

      startedAt: new Date(),
      completedAt: null,
    });

    return res.status(201).json({
      message: "Träningspasset startades.",
      resumed: false,

      attempt: {
        id: attempt.id,
        quizType: attempt.quizType,
        status: attempt.status,
        score: 0,
        totalQuestions: Number(attempt.totalQuestions),
        percentage: 0,

        simulatorQuestionIds:
          attempt.quizType === "simulator"
            ? normalizeSimulatorQuestionIds(attempt.simulatorQuestionIds)
            : [],

        flaggedQuestionIds: [],

        startedAt: attempt.startedAt,
        completedAt: null,
      },

      answeredQuestions: 0,

      unansweredQuestions: Number(attempt.totalQuestions),

      flaggedQuestionIds: [],

      answers: [],
    });
  } catch (error) {
    console.error("Start training session error:", error);

    return res.status(500).json({
      message: "Träningspasset kunde inte startas.",
    });
  }
};

/* -------------------------------- */
/* Save one answered question       */
/* -------------------------------- */

const saveTrainingAnswer = async (req, res) => {
  try {
    const userId = req.user.id;

    const attemptId = Number(req.params.attemptId);

    const { questionId, subjectId, selectedAnswerId, correct } = req.body;

    if (
      !Number.isInteger(attemptId) ||
      !Number.isInteger(questionId) ||
      !Number.isInteger(subjectId) ||
      !Number.isInteger(selectedAnswerId) ||
      typeof correct !== "boolean"
    ) {
      return res.status(400).json({
        message: "Svaret innehåller ogiltiga värden.",
      });
    }

    const attempt = await QuizAttempt.findOne({
      where: {
        id: attemptId,
        userId,
        status: "in_progress",
      },
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Det aktiva träningspasset kunde inte hittas.",
      });
    }

    if (attempt.quizType === "simulator") {
      const simulatorQuestionIds = normalizeSimulatorQuestionIds(
        attempt.simulatorQuestionIds,
      );

      if (
        simulatorQuestionIds.length > 0 &&
        !simulatorQuestionIds.includes(questionId)
      ) {
        return res.status(400).json({
          message: "Frågan tillhör inte det aktuella simulatorprovet.",
        });
      }
    }

    let savedAnswer = await QuizAnswer.findOne({
      where: {
        attemptId: attempt.id,
        questionId,
      },
    });

    let answerUpdated = false;

    if (savedAnswer) {
      await savedAnswer.update({
        subjectId,
        selectedAnswerId,
        correct,
      });

      answerUpdated = true;
    } else {
      savedAnswer = await QuizAnswer.create({
        attemptId: attempt.id,
        questionId,
        subjectId,
        selectedAnswerId,
        correct,
      });
    }

    const savedAnswers = await QuizAnswer.findAll({
      where: {
        attemptId: attempt.id,
      },
    });

    const statistics = calculateAttemptStatistics({
      attempt,
      savedAnswers,
      completed: false,
    });

    await attempt.update({
      score: statistics.correctAnswers,
      percentage: statistics.percentage,
    });

    return res.status(answerUpdated ? 200 : 201).json({
      message: answerUpdated ? "Svaret uppdaterades." : "Svaret sparades.",

      alreadySaved: false,
      updated: answerUpdated,

      answer: {
        id: savedAnswer.id,
        questionId: savedAnswer.questionId,
        subjectId: savedAnswer.subjectId,
        selectedAnswerId: savedAnswer.selectedAnswerId,
        correct: Boolean(savedAnswer.correct),
      },

      progress: {
        answeredQuestions: statistics.answeredQuestions,

        unansweredQuestions: statistics.unansweredQuestions,

        correctAnswers: statistics.correctAnswers,

        wrongAnswers: statistics.wrongAnswers,

        percentage: statistics.percentage,
      },

      attempt: {
        id: attempt.id,
        quizType: attempt.quizType,
        status: attempt.status,
        score: statistics.correctAnswers,
        totalQuestions: statistics.totalQuestions,
        percentage: statistics.percentage,
      },
    });
  } catch (error) {
    console.error("Save training answer error:", error);

    return res.status(500).json({
      message: "Svaret kunde inte sparas.",
    });
  }
};

/* -------------------------------- */
/* Save simulator flagged questions */
/* -------------------------------- */

const saveTrainingFlags = async (req, res) => {
  try {
    const userId = req.user.id;

    const attemptId = Number(req.params.attemptId);

    const { flaggedQuestionIds = [] } = req.body;

    if (!Number.isInteger(attemptId)) {
      return res.status(400).json({
        message: "Ogiltigt träningspass.",
      });
    }

    if (!Array.isArray(flaggedQuestionIds)) {
      return res.status(400).json({
        message: "Flaggade frågor är ogiltiga.",
      });
    }

    const uniqueFlaggedQuestionIds = normalizeQuestionIds(flaggedQuestionIds);

    const attempt = await QuizAttempt.findOne({
      where: {
        id: attemptId,
        userId,
        quizType: "simulator",
        status: "in_progress",
      },
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Det aktiva simulatorprovet kunde inte hittas.",
      });
    }

    const simulatorQuestionIds = normalizeSimulatorQuestionIds(
      attempt.simulatorQuestionIds,
    );

    const invalidQuestionId = uniqueFlaggedQuestionIds.find(
      (questionId) => !simulatorQuestionIds.includes(questionId),
    );

    if (invalidQuestionId) {
      return res.status(400).json({
        message: "En flaggad fråga tillhör inte det aktuella simulatorprovet.",
      });
    }

    await attempt.update({
      flaggedQuestionIds: uniqueFlaggedQuestionIds,
    });

    return res.status(200).json({
      message: "Flaggade frågor sparades.",

      attemptId: attempt.id,

      flaggedQuestionIds: uniqueFlaggedQuestionIds,

      flaggedCount: uniqueFlaggedQuestionIds.length,
    });
  } catch (error) {
    console.error("Save training flags error:", error);

    return res.status(500).json({
      message: "Flaggade frågor kunde inte sparas.",
    });
  }
};

/* -------------------------------- */
/* Complete training session        */
/* -------------------------------- */

const completeTrainingSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const attemptId = Number(req.params.attemptId);

    if (!Number.isInteger(attemptId)) {
      return res.status(400).json({
        message: "Ogiltigt träningspass.",
      });
    }

    const attempt = await QuizAttempt.findOne({
      where: {
        id: attemptId,
        userId,
        status: "in_progress",
      },
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Det aktiva träningspasset kunde inte hittas.",
      });
    }

    const savedAnswers = await QuizAnswer.findAll({
      where: {
        attemptId: attempt.id,
      },
    });

    const statistics = calculateAttemptStatistics({
      attempt,
      savedAnswers,
      completed: true,
    });

    await attempt.update({
      status: "completed",
      score: statistics.correctAnswers,
      percentage: statistics.percentage,
      completedAt: new Date(),
    });

    return res.status(200).json({
      message: "Träningspasset slutfördes.",

      attempt: {
        id: attempt.id,
        quizType: attempt.quizType,
        status: attempt.status,
        score: statistics.correctAnswers,
        totalQuestions: statistics.totalQuestions,
        percentage: statistics.percentage,

        simulatorQuestionIds:
          attempt.quizType === "simulator"
            ? normalizeSimulatorQuestionIds(attempt.simulatorQuestionIds)
            : [],

        flaggedQuestionIds:
          attempt.quizType === "simulator"
            ? normalizeQuestionIds(attempt.flaggedQuestionIds)
            : [],

        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
      },

      progress: {
        answeredQuestions: statistics.answeredQuestions,

        unansweredQuestions: statistics.unansweredQuestions,

        correctAnswers: statistics.correctAnswers,

        wrongAnswers: statistics.wrongAnswers,

        totalQuestions: statistics.totalQuestions,

        percentage: statistics.percentage,
      },
    });
  } catch (error) {
    console.error("Complete training session error:", error);

    return res.status(500).json({
      message: "Träningspasset kunde inte slutföras.",
    });
  }
};

module.exports = {
  startTrainingSession,
  saveTrainingAnswer,
  saveTrainingFlags,
  completeTrainingSession,
};
