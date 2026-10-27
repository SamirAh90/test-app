const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");

const { buildQuiz } = require("./quizEngine");

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const FREE_ACCOUNT_QUESTION_LIMIT = 30;
const DEFAULT_SESSION_SIZE = 15;

/* -------------------------------- */
/* Get already-used free questions  */
/* -------------------------------- */

const getUsedFreeQuestionIds = async (userId) => {
  const answers = await QuizAnswer.findAll({
    attributes: ["questionId"],

    include: [
      {
        model: QuizAttempt,

        attributes: [],

        required: true,

        where: {
          userId,
          quizType: "free",
        },
      },
    ],

    group: ["QuizAnswer.questionId"],

    raw: true,
  });

  return answers
    .map((answer) => Number(answer.questionId))
    .filter((questionId) => Number.isInteger(questionId));
};

/* -------------------------------- */
/* Get free-account status          */
/* -------------------------------- */

const getFreeTrainingStatus = async (userId) => {
  const usedQuestionIds = await getUsedFreeQuestionIds(userId);

  const usedQuestions = usedQuestionIds.length;

  const remainingQuestions = Math.max(
    FREE_ACCOUNT_QUESTION_LIMIT - usedQuestions,
    0,
  );

  return {
    limit: FREE_ACCOUNT_QUESTION_LIMIT,

    usedQuestions,

    remainingQuestions,

    usedQuestionIds,
  };
};

/* -------------------------------- */
/* Build free training session      */
/* -------------------------------- */

const buildFreeTrainingSession = async (
  userId,
  { limit = DEFAULT_SESSION_SIZE, translationLanguage = null } = {},
) => {
  const status = await getFreeTrainingStatus(userId);

  /* -------------------------------- */
  /* Free limit reached               */
  /* -------------------------------- */

  if (status.remainingQuestions <= 0) {
    return {
      strategy: "free_limit_reached",

      translationLanguage: null,

      limit: status.limit,

      usedQuestions: status.usedQuestions,

      remainingQuestions: 0,

      totalQuestions: 0,

      questions: [],
    };
  }

  /* -------------------------------- */
  /* Session size                     */
  /* -------------------------------- */

  const requestedLimit =
    Number.isInteger(Number(limit)) && Number(limit) > 0
      ? Number(limit)
      : DEFAULT_SESSION_SIZE;

  const sessionLimit = Math.min(requestedLimit, status.remainingQuestions);

  /* -------------------------------- */
  /* Build candidate question pool    */
  /* -------------------------------- */

  /*
    Load more candidates than needed
    so questions already consumed by
    the free user can be excluded.
  */

  const quiz = await buildQuiz({
    strategy: "free",

    limit: FREE_ACCOUNT_QUESTION_LIMIT,

    randomize: true,

    translationLanguage,
  });

  /* -------------------------------- */
  /* Remove already-used questions    */
  /* -------------------------------- */

  const availableQuestions = quiz.questions.filter(
    (question) => !status.usedQuestionIds.includes(Number(question.id)),
  );

  const questions = availableQuestions.slice(0, sessionLimit);

  /* -------------------------------- */
  /* Response                         */
  /* -------------------------------- */

  return {
    strategy: "free",

    translationLanguage: quiz.translationLanguage,

    limit: status.limit,

    usedQuestions: status.usedQuestions,

    remainingQuestions: status.remainingQuestions,

    totalQuestions: questions.length,

    questions,
  };
};

module.exports = {
  FREE_ACCOUNT_QUESTION_LIMIT,
  getFreeTrainingStatus,
  buildFreeTrainingSession,
};
