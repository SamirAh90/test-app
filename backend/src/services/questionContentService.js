const QuestionTranslation = require("../models/QuestionTranslation");
const AnswerTranslation = require("../models/AnswerTranslation");

/* -------------------------------- */
/* Supported languages              */
/* -------------------------------- */

const SUPPORTED_TRANSLATION_LANGUAGES = ["en", "ar", "fa"];

/* -------------------------------- */
/* Normalize translation language   */
/* -------------------------------- */

const normalizeTranslationLanguage = (language) => {
  if (!language) {
    return null;
  }

  const normalizedLanguage = String(language)
    .trim()
    .toLowerCase()
    .split("-")[0];

  if (normalizedLanguage === "sv") {
    return null;
  }

  if (!SUPPORTED_TRANSLATION_LANGUAGES.includes(normalizedLanguage)) {
    return null;
  }

  return normalizedLanguage;
};

/* -------------------------------- */
/* Question translation include     */
/* -------------------------------- */

const buildQuestionTranslationInclude = (language) => {
  const normalizedLanguage = normalizeTranslationLanguage(language);

  if (!normalizedLanguage) {
    return null;
  }

  return {
    model: QuestionTranslation,

    attributes: ["language", "translatedQuestion", "translatedExplanation"],

    required: false,

    where: {
      language: normalizedLanguage,
    },
  };
};

/* -------------------------------- */
/* Answer translation include       */
/* -------------------------------- */

const buildAnswerTranslationInclude = (language) => {
  const normalizedLanguage = normalizeTranslationLanguage(language);

  if (!normalizedLanguage) {
    return null;
  }

  return {
    model: AnswerTranslation,

    attributes: ["language", "translatedAnswer"],

    required: false,

    where: {
      language: normalizedLanguage,
    },
  };
};

/* -------------------------------- */
/* Find question translation        */
/* -------------------------------- */

const getQuestionTranslation = (question, language) => {
  const normalizedLanguage = normalizeTranslationLanguage(language);

  if (!normalizedLanguage) {
    return null;
  }

  const translations = Array.isArray(question?.QuestionTranslations)
    ? question.QuestionTranslations
    : [];

  const translation = translations.find(
    (item) => item.language === normalizedLanguage,
  );

  if (!translation) {
    return {
      language: normalizedLanguage,
      question: "",
      explanation: "",
    };
  }

  return {
    language: normalizedLanguage,

    question: translation.translatedQuestion || "",

    explanation: translation.translatedExplanation || "",
  };
};

/* -------------------------------- */
/* Find answer translation          */
/* -------------------------------- */

const getAnswerTranslation = (answer, language) => {
  const normalizedLanguage = normalizeTranslationLanguage(language);

  if (!normalizedLanguage) {
    return null;
  }

  const translations = Array.isArray(answer?.AnswerTranslations)
    ? answer.AnswerTranslations
    : [];

  const translation = translations.find(
    (item) => item.language === normalizedLanguage,
  );

  if (!translation) {
    return null;
  }

  return translation.translatedAnswer || null;
};

/* -------------------------------- */
/* Format one public answer         */
/* -------------------------------- */

const formatPublicAnswer = (answer, language) => {
  return {
    id: Number(answer.id),

    answer: answer.answer,

    displayOrder: Number(answer.displayOrder || 0),

    translation: getAnswerTranslation(answer, language),
  };
};

/* -------------------------------- */
/* Format one public question       */
/* -------------------------------- */

const formatPublicQuestion = (question, language) => {
  const answers = Array.isArray(question?.Answers) ? [...question.Answers] : [];

  answers.sort((firstAnswer, secondAnswer) => {
    const displayOrderDifference =
      Number(firstAnswer.displayOrder || 0) -
      Number(secondAnswer.displayOrder || 0);

    if (displayOrderDifference !== 0) {
      return displayOrderDifference;
    }

    return Number(firstAnswer.id) - Number(secondAnswer.id);
  });

  return {
    id: Number(question.id),

    subjectId: Number(question.subjectId),

    question: question.question,

    explanation: question.explanation || "",

    difficulty: question.difficulty,

    Subject: question.Subject
      ? {
          id: Number(question.Subject.id),
          name: question.Subject.name,
          slug: question.Subject.slug,
        }
      : null,

    translation: getQuestionTranslation(question, language),

    Answers: answers.map((answer) => formatPublicAnswer(answer, language)),
  };
};

/* -------------------------------- */
/* Format many public questions     */
/* -------------------------------- */

const formatPublicQuestions = (questions, language) => {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions.map((question) => formatPublicQuestion(question, language));
};

module.exports = {
  SUPPORTED_TRANSLATION_LANGUAGES,

  normalizeTranslationLanguage,

  buildQuestionTranslationInclude,

  buildAnswerTranslationInclude,

  getQuestionTranslation,

  getAnswerTranslation,

  formatPublicAnswer,

  formatPublicQuestion,

  formatPublicQuestions,
};
