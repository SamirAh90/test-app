const Question = require("../models/Question");

const { buildQuiz } = require("./quizEngine");

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const DEFAULT_PREMIUM_SESSION_SIZE = 60;
const MAX_PREMIUM_SESSION_SIZE = 60;

/* -------------------------------- */
/* Normalize session size           */
/* -------------------------------- */

const normalizePremiumLimit = (limit) => {
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_PREMIUM_SESSION_SIZE;
  }

  return Math.min(parsedLimit, MAX_PREMIUM_SESSION_SIZE);
};

/* -------------------------------- */
/* Build Premium training session   */
/* -------------------------------- */

const buildPremiumTrainingSession = async ({
  limit = DEFAULT_PREMIUM_SESSION_SIZE,
  translationLanguage = null,
} = {}) => {
  const sessionLimit = normalizePremiumLimit(limit);

  const [quiz, totalBankQuestions] = await Promise.all([
    buildQuiz({
      strategy: "premium",

      limit: sessionLimit,

      randomize: true,

      translationLanguage,
    }),

    Question.count(),
  ]);

  return {
    strategy: "premium",

    translationLanguage: quiz.translationLanguage,

    sessionSize: quiz.totalQuestions,

    totalBankQuestions,

    totalQuestions: quiz.totalQuestions,

    questions: quiz.questions,
  };
};

module.exports = {
  DEFAULT_PREMIUM_SESSION_SIZE,
  MAX_PREMIUM_SESSION_SIZE,
  buildPremiumTrainingSession,
};
