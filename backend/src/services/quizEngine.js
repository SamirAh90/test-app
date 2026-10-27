const { Op } = require("sequelize");

const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Subject = require("../models/Subject");

const {
  normalizeTranslationLanguage,
  buildQuestionTranslationInclude,
  buildAnswerTranslationInclude,
  formatPublicQuestions,
} = require("./questionContentService");

/* -------------------------------- */
/* Configuration                    */
/* -------------------------------- */

const DEFAULT_LIMIT = 15;
const MAX_LIMIT = 60;

/* -------------------------------- */
/* Normalize question limit         */
/* -------------------------------- */

const normalizeLimit = (limit) => {
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedLimit, MAX_LIMIT);
};

/* -------------------------------- */
/* Normalize ID arrays              */
/* -------------------------------- */

const normalizeIds = (ids = []) => {
  if (!Array.isArray(ids)) {
    return [];
  }

  return [
    ...new Set(
      ids.map((id) => Number(id)).filter((id) => Number.isInteger(id)),
    ),
  ];
};

/* -------------------------------- */
/* Shuffle questions                */
/* -------------------------------- */

const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

/* -------------------------------- */
/* Build Sequelize includes         */
/* -------------------------------- */

const buildQuestionIncludes = (translationLanguage) => {
  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  const includes = [
    {
      model: Subject,

      attributes: ["id", "name", "slug"],
    },
  ];

  /* -------------------------------- */
  /* Answers                          */
  /* -------------------------------- */

  const answerInclude = {
    model: Answer,

    attributes: ["id", "answer", "displayOrder"],

    separate: true,

    order: [
      ["displayOrder", "ASC"],
      ["id", "ASC"],
    ],
  };

  const answerTranslationInclude =
    buildAnswerTranslationInclude(normalizedLanguage);

  if (answerTranslationInclude) {
    answerInclude.include = [answerTranslationInclude];
  }

  includes.push(answerInclude);

  /* -------------------------------- */
  /* Question translation             */
  /* -------------------------------- */

  const questionTranslationInclude =
    buildQuestionTranslationInclude(normalizedLanguage);

  if (questionTranslationInclude) {
    includes.push(questionTranslationInclude);
  }

  return includes;
};

/* -------------------------------- */
/* Load questions                   */
/* -------------------------------- */

const loadQuestions = async ({
  subjectIds = [],
  questionIds = [],
  excludeQuestionIds = [],
  difficulty = null,
  limit = DEFAULT_LIMIT,
  randomize = true,
  translationLanguage = null,
} = {}) => {
  const safeLimit = normalizeLimit(limit);

  const normalizedSubjectIds = normalizeIds(subjectIds);

  const normalizedQuestionIds = normalizeIds(questionIds);

  const normalizedExcludedIds = normalizeIds(excludeQuestionIds);

  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  /* -------------------------------- */
  /* Build WHERE                     */
  /* -------------------------------- */

  const where = {};

  if (normalizedSubjectIds.length > 0) {
    where.subjectId = {
      [Op.in]: normalizedSubjectIds,
    };
  }

  if (normalizedQuestionIds.length > 0) {
    where.id = {
      [Op.in]: normalizedQuestionIds,
    };
  }

  if (normalizedExcludedIds.length > 0) {
    if (where.id) {
      where.id = {
        ...where.id,

        [Op.notIn]: normalizedExcludedIds,
      };
    } else {
      where.id = {
        [Op.notIn]: normalizedExcludedIds,
      };
    }
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  /* -------------------------------- */
  /* Load from database              */
  /* -------------------------------- */

  const questions = await Question.findAll({
    where,

    include: buildQuestionIncludes(normalizedLanguage),

    order: [["id", "ASC"]],
  });

  /* -------------------------------- */
  /* Randomize                       */
  /* -------------------------------- */

  const preparedQuestions = randomize ? shuffleArray(questions) : questions;

  const limitedQuestions = preparedQuestions.slice(0, safeLimit);

  /* -------------------------------- */
  /* Normalize public question shape */
  /* -------------------------------- */

  return formatPublicQuestions(limitedQuestions, normalizedLanguage);
};

/* -------------------------------- */
/* Build quiz                       */
/* -------------------------------- */

const buildQuiz = async ({
  strategy,
  subjectIds = [],
  questionIds = [],
  excludeQuestionIds = [],
  difficulty = null,
  limit = DEFAULT_LIMIT,
  randomize = true,
  translationLanguage = null,
} = {}) => {
  if (!strategy) {
    throw new Error("Quiz strategy is required.");
  }

  const normalizedLanguage = normalizeTranslationLanguage(translationLanguage);

  const questions = await loadQuestions({
    subjectIds,
    questionIds,
    excludeQuestionIds,
    difficulty,
    limit,
    randomize,

    translationLanguage: normalizedLanguage,
  });

  return {
    strategy,

    translationLanguage: normalizedLanguage,

    totalQuestions: questions.length,

    questions,
  };
};

module.exports = {
  buildQuiz,
  loadQuestions,
};
