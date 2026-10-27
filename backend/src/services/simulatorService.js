const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

const { buildQuiz } = require("./quizEngine");

const { normalizeTranslationLanguage } = require("./questionContentService");

/* -------------------------------- */
/* Simulator configuration          */
/* -------------------------------- */

const SIMULATOR_QUESTION_LIMIT = 60;
const SIMULATOR_DURATION_MINUTES = 90;

/* -------------------------------- */
/* Normalize saved question IDs     */
/* -------------------------------- */

const normalizeQuestionIds = (value) => {
  if (!value) {
    return [];
  }

  let questionIds = value;

  /*
    Depending on the MySQL/Sequelize setup,
    JSON may sometimes arrive as a string.
  */

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

  return questionIds
    .map((questionId) => Number(questionId))
    .filter((questionId) => Number.isInteger(questionId));
};

/* -------------------------------- */
/* Restore exact saved question set */
/* -------------------------------- */

const buildSavedSimulatorQuiz = async (
  questionIds,
  translationLanguage = null,
) => {
  const normalizedQuestionIds = normalizeQuestionIds(questionIds);

  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  if (normalizedQuestionIds.length === 0) {
    return null;
  }

  /*
    quizEngine can load questions by IDs.

    We disable randomization here because this
    is an existing simulator session.
  */

  const quiz = await buildQuiz({
    strategy: "simulator",

    questionIds: normalizedQuestionIds,

    limit: Math.min(normalizedQuestionIds.length, SIMULATOR_QUESTION_LIMIT),

    randomize: false,

    translationLanguage: normalizedLanguage,
  });

  /*
    quizEngine loads matching questions but its
    database query orders them by question ID.

    We must put them back into the exact original
    simulator order stored in quiz_attempts.
  */

  const questionMap = new Map(
    quiz.questions.map((question) => [Number(question.id), question]),
  );

  const orderedQuestions = normalizedQuestionIds
    .map((questionId) => questionMap.get(questionId))
    .filter(Boolean);

  return {
    strategy: "simulator",

    translationLanguage: quiz.translationLanguage,

    totalQuestions: orderedQuestions.length,

    questions: orderedQuestions,
  };
};

/* -------------------------------- */
/* Find active simulator attempt    */
/* -------------------------------- */

const findActiveSimulatorAttempt = async (userId) => {
  if (!userId) {
    return null;
  }

  return QuizAttempt.findOne({
    where: {
      userId,
      quizType: "simulator",
      status: "in_progress",
    },

    order: [["startedAt", "DESC"]],
  });
};

/* -------------------------------- */
/* Build simulator session          */
/* -------------------------------- */

const buildSimulatorSession = async (
  userId,
  { translationLanguage = null } = {},
) => {
  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  const totalBankQuestions = await Question.count();

  /* -------------------------------- */
  /* Look for interrupted simulator   */
  /* -------------------------------- */

  const activeAttempt = await findActiveSimulatorAttempt(userId);

  if (activeAttempt) {
    const savedQuestionIds = normalizeQuestionIds(
      activeAttempt.simulatorQuestionIds,
    );

    if (savedQuestionIds.length > 0) {
      const restoredQuiz = await buildSavedSimulatorQuiz(
        savedQuestionIds,
        normalizedLanguage,
      );

      if (restoredQuiz && restoredQuiz.questions.length > 0) {
        return {
          strategy: "simulator",

          translationLanguage: restoredQuiz.translationLanguage,

          resumed: true,

          attemptId: activeAttempt.id,

          requestedQuestions: SIMULATOR_QUESTION_LIMIT,

          totalQuestions: restoredQuiz.totalQuestions,

          durationMinutes: SIMULATOR_DURATION_MINUTES,

          totalBankQuestions,

          questionIds: savedQuestionIds,

          questions: restoredQuiz.questions,
        };
      }
    }
  }

  /* -------------------------------- */
  /* Create new random simulator set  */
  /* -------------------------------- */

  const quiz = await buildQuiz({
    strategy: "simulator",

    limit: SIMULATOR_QUESTION_LIMIT,

    randomize: true,

    translationLanguage: normalizedLanguage,
  });

  const questionIds = quiz.questions
    .map((question) => Number(question.id))
    .filter((questionId) => Number.isInteger(questionId));

  return {
    strategy: "simulator",

    translationLanguage: quiz.translationLanguage,

    resumed: false,

    attemptId: null,

    requestedQuestions: SIMULATOR_QUESTION_LIMIT,

    totalQuestions: quiz.totalQuestions,

    durationMinutes: SIMULATOR_DURATION_MINUTES,

    totalBankQuestions,

    questionIds,

    questions: quiz.questions,
  };
};

module.exports = {
  SIMULATOR_QUESTION_LIMIT,
  SIMULATOR_DURATION_MINUTES,
  normalizeQuestionIds,
  buildSimulatorSession,
};
