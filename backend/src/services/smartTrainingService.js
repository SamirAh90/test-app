const QuizAnswer = require("../models/QuizAnswer");
const QuizAttempt = require("../models/QuizAttempt");
const Subject = require("../models/Subject");

const { buildQuiz } = require("./quizEngine");

const { normalizeTranslationLanguage } = require("./questionContentService");

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const DEFAULT_SMART_QUESTION_LIMIT = 20;
const MAX_SMART_QUESTION_LIMIT = 20;
const MAX_RECOMMENDED_SUBJECTS = 3;

/* -------------------------------- */
/* Normalize limit                  */
/* -------------------------------- */

const normalizeSmartLimit = (limit) => {
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_SMART_QUESTION_LIMIT;
  }

  return Math.min(parsedLimit, MAX_SMART_QUESTION_LIMIT);
};

/* -------------------------------- */
/* Load user answer history         */
/* -------------------------------- */

const getUserAnswerHistory = async (userId) => {
  const answers = await QuizAnswer.findAll({
    attributes: [
      "id",
      "subjectId",
      "questionId",
      "correct",
      "createdAt",
      "updatedAt",
    ],

    include: [
      {
        model: QuizAttempt,

        attributes: ["id", "quizType", "status"],

        where: {
          userId,
        },

        required: true,
      },

      {
        model: Subject,

        attributes: ["id", "name", "slug"],

        required: true,
      },
    ],

    order: [
      ["createdAt", "ASC"],
      ["id", "ASC"],
    ],
  });

  return answers;
};

/* -------------------------------- */
/* Latest answer per question       */
/* -------------------------------- */

const getLatestAnswersByQuestion = (answers) => {
  const latestAnswerMap = new Map();

  answers.forEach((answer) => {
    const questionId = Number(answer.questionId);

    if (!Number.isInteger(questionId)) {
      return;
    }

    /*
      Because history is ordered
      oldest → newest, the latest
      answer replaces earlier answers
      for the same question.
    */

    latestAnswerMap.set(questionId, answer);
  });

  return Array.from(latestAnswerMap.values());
};

/* -------------------------------- */
/* Calculate subject performance    */
/* -------------------------------- */

const calculateSubjectPerformance = (latestAnswers) => {
  const subjectMap = new Map();

  latestAnswers.forEach((answer) => {
    const subjectId = Number(answer.subjectId);

    if (!Number.isInteger(subjectId)) {
      return;
    }

    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, {
        subjectId,

        subject: {
          id: subjectId,

          name: answer.Subject?.name || "",

          slug: answer.Subject?.slug || "",
        },

        totalAnswers: 0,

        correctAnswers: 0,

        wrongAnswers: 0,

        percentage: 0,
      });
    }

    const subjectResult = subjectMap.get(subjectId);

    subjectResult.totalAnswers += 1;

    if (Boolean(answer.correct)) {
      subjectResult.correctAnswers += 1;
    } else {
      subjectResult.wrongAnswers += 1;
    }
  });

  return Array.from(subjectMap.values()).map((subjectResult) => {
    const percentage =
      subjectResult.totalAnswers > 0
        ? Math.round(
            (subjectResult.correctAnswers / subjectResult.totalAnswers) * 100,
          )
        : 0;

    return {
      ...subjectResult,
      percentage,
    };
  });
};

/* -------------------------------- */
/* Rank weakest subjects            */
/* -------------------------------- */

const rankWeakestSubjects = (subjectPerformance) => {
  return [...subjectPerformance].sort((firstSubject, secondSubject) => {
    if (firstSubject.percentage !== secondSubject.percentage) {
      return firstSubject.percentage - secondSubject.percentage;
    }

    if (firstSubject.wrongAnswers !== secondSubject.wrongAnswers) {
      return secondSubject.wrongAnswers - firstSubject.wrongAnswers;
    }

    return secondSubject.totalAnswers - firstSubject.totalAnswers;
  });
};

/* -------------------------------- */
/* Build Smart Training session     */
/* -------------------------------- */

const buildSmartTrainingSession = async (
  userId,
  {
    limit = DEFAULT_SMART_QUESTION_LIMIT,

    translationLanguage = null,
  } = {},
) => {
  const sessionLimit = normalizeSmartLimit(limit);

  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  /* -------------------------------- */
  /* Load history                     */
  /* -------------------------------- */

  const answerHistory = await getUserAnswerHistory(userId);

  if (answerHistory.length === 0) {
    return {
      strategy: "no_history",

      translationLanguage: normalizedLanguage,

      recommendedSubjects: [],

      unresolvedWrongQuestions: 0,

      requestedQuestions: sessionLimit,

      totalQuestions: 0,

      questions: [],
    };
  }

  /* -------------------------------- */
  /* Latest state per question        */
  /* -------------------------------- */

  const latestAnswers = getLatestAnswersByQuestion(answerHistory);

  if (latestAnswers.length === 0) {
    return {
      strategy: "no_history",

      translationLanguage: normalizedLanguage,

      recommendedSubjects: [],

      unresolvedWrongQuestions: 0,

      requestedQuestions: sessionLimit,

      totalQuestions: 0,

      questions: [],
    };
  }

  /* -------------------------------- */
  /* Subject performance              */
  /* -------------------------------- */

  const subjectPerformance = calculateSubjectPerformance(latestAnswers);

  const rankedSubjects = rankWeakestSubjects(subjectPerformance);

  const recommendedSubjects = rankedSubjects.slice(0, MAX_RECOMMENDED_SUBJECTS);

  const recommendedSubjectIds = recommendedSubjects
    .map((subject) => Number(subject.subjectId))
    .filter((subjectId) => Number.isInteger(subjectId));

  /* -------------------------------- */
  /* Current unresolved wrong answers */
  /* -------------------------------- */

  const wrongQuestionIds = latestAnswers
    .filter((answer) => !Boolean(answer.correct))
    .map((answer) => Number(answer.questionId))
    .filter((questionId) => Number.isInteger(questionId));

  /* -------------------------------- */
  /* Currently correct questions      */
  /* -------------------------------- */

  const currentlyCorrectQuestionIds = latestAnswers
    .filter((answer) => Boolean(answer.correct))
    .map((answer) => Number(answer.questionId))
    .filter((questionId) => Number.isInteger(questionId));

  /* -------------------------------- */
  /* Selected questions               */
  /* -------------------------------- */

  const selectedQuestions = [];

  const selectedQuestionIds = new Set();

  const addQuestions = (questions) => {
    questions.forEach((question) => {
      if (selectedQuestions.length >= sessionLimit) {
        return;
      }

      const questionId = Number(question.id);

      if (
        !Number.isInteger(questionId) ||
        selectedQuestionIds.has(questionId)
      ) {
        return;
      }

      selectedQuestionIds.add(questionId);

      selectedQuestions.push(question);
    });
  };

  /* -------------------------------- */
  /* 1. Unresolved wrong questions    */
  /* -------------------------------- */

  if (wrongQuestionIds.length > 0) {
    const wrongQuiz = await buildQuiz({
      strategy: "smart_wrong_questions",

      questionIds: wrongQuestionIds,

      limit: sessionLimit,

      randomize: true,

      translationLanguage: normalizedLanguage,
    });

    addQuestions(wrongQuiz.questions);
  }

  /* -------------------------------- */
  /* 2. New questions from weak areas */
  /* -------------------------------- */

  const remainingAfterWrong = sessionLimit - selectedQuestions.length;

  if (remainingAfterWrong > 0 && recommendedSubjectIds.length > 0) {
    const weakSubjectQuiz = await buildQuiz({
      strategy: "smart_weak_subjects",

      subjectIds: recommendedSubjectIds,

      excludeQuestionIds: [
        ...selectedQuestionIds,

        ...currentlyCorrectQuestionIds,
      ],

      limit: remainingAfterWrong,

      randomize: true,

      translationLanguage: normalizedLanguage,
    });

    addQuestions(weakSubjectQuiz.questions);
  }

  /* -------------------------------- */
  /* 3. Weak subject fallback         */
  /* -------------------------------- */

  const remainingAfterNewWeak = sessionLimit - selectedQuestions.length;

  if (remainingAfterNewWeak > 0 && recommendedSubjectIds.length > 0) {
    const weakSubjectFallback = await buildQuiz({
      strategy: "smart_weak_subject_fallback",

      subjectIds: recommendedSubjectIds,

      excludeQuestionIds: [...selectedQuestionIds],

      limit: remainingAfterNewWeak,

      randomize: true,

      translationLanguage: normalizedLanguage,
    });

    addQuestions(weakSubjectFallback.questions);
  }

  /* -------------------------------- */
  /* 4. Fill remaining from full bank */
  /* -------------------------------- */

  const remainingFinal = sessionLimit - selectedQuestions.length;

  if (remainingFinal > 0) {
    const fallbackQuiz = await buildQuiz({
      strategy: "smart_bank_fallback",

      excludeQuestionIds: [...selectedQuestionIds],

      limit: remainingFinal,

      randomize: true,

      translationLanguage: normalizedLanguage,
    });

    addQuestions(fallbackQuiz.questions);
  }

  /* -------------------------------- */
  /* Response                         */
  /* -------------------------------- */

  return {
    strategy: "adaptive",

    translationLanguage: normalizedLanguage,

    recommendedSubjects,

    unresolvedWrongQuestions: wrongQuestionIds.length,

    requestedQuestions: sessionLimit,

    totalQuestions: selectedQuestions.length,

    questions: selectedQuestions,
  };
};

module.exports = {
  DEFAULT_SMART_QUESTION_LIMIT,
  MAX_SMART_QUESTION_LIMIT,
  buildSmartTrainingSession,
};
