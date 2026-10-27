const express = require("express");

const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Subject = require("../models/Subject");
const SubjectSource = require("../models/SubjectSource");

const {
  normalizeTranslationLanguage,
  buildQuestionTranslationInclude,
  buildAnswerTranslationInclude,
  getQuestionTranslation,
  formatPublicQuestions,
} = require("../services/questionContentService");

const router = express.Router();

/* -------------------------------- */
/* Build question includes          */
/* -------------------------------- */

const buildQuestionIncludes = (language) => {
  const includes = [
    {
      model: Subject,

      attributes: ["id", "name", "slug"],
    },
  ];

  const answerInclude = {
    model: Answer,

    attributes: ["id", "answer", "displayOrder"],

    required: false,
  };

  const answerTranslationInclude = buildAnswerTranslationInclude(language);

  if (answerTranslationInclude) {
    answerInclude.include = [answerTranslationInclude];
  }

  includes.push(answerInclude);

  const questionTranslationInclude = buildQuestionTranslationInclude(language);

  if (questionTranslationInclude) {
    includes.push(questionTranslationInclude);
  }

  return includes;
};

/* -------------------------------- */
/* Get all questions                */
/* -------------------------------- */

router.get("/", async (req, res) => {
  try {
    const language = normalizeTranslationLanguage(req.query.language);

    const questions = await Question.findAll({
      include: buildQuestionIncludes(language),

      order: [
        ["id", "ASC"],
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    return res.status(200).json(formatPublicQuestions(questions, language));
  } catch (error) {
    console.error("Error fetching questions:", error);

    return res.status(500).json({
      message: "Kunde inte hämta frågor",
    });
  }
});

/* -------------------------------- */
/* Get questions by subject         */
/* -------------------------------- */

router.get("/subject/:subjectId", async (req, res) => {
  try {
    const language = normalizeTranslationLanguage(req.query.language);

    const subjectId = Number(req.params.subjectId);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const questions = await Question.findAll({
      where: {
        subjectId,
      },

      include: buildQuestionIncludes(language),

      order: [
        ["id", "ASC"],
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    return res.status(200).json(formatPublicQuestions(questions, language));
  } catch (error) {
    console.error("Error fetching subject questions:", error);

    return res.status(500).json({
      message: "Kunde inte hämta frågor för ämnet",
    });
  }
});

/* -------------------------------- */
/* Check answer                     */
/* -------------------------------- */

router.post("/:questionId/answer", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    const answerId = Number(req.body.answerId);

    const language = normalizeTranslationLanguage(req.query.language);

    /* -------------------------------- */
    /* Validate IDs                     */
    /* -------------------------------- */

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    if (!Number.isInteger(answerId) || answerId <= 0) {
      return res.status(400).json({
        message: "answerId krävs.",
      });
    }

    /* -------------------------------- */
    /* Validate selected answer          */
    /* -------------------------------- */

    const answer = await Answer.findOne({
      where: {
        id: answerId,
        questionId,
      },
    });

    if (!answer) {
      return res.status(404).json({
        message: "Svaret hittades inte.",
      });
    }

    /* -------------------------------- */
    /* Build question includes           */
    /* -------------------------------- */

    const questionIncludes = [
      {
        model: Subject,

        attributes: ["id", "name", "slug"],

        required: true,

        include: [
          {
            model: SubjectSource,

            attributes: ["id", "title", "url", "displayOrder"],

            required: false,
          },
        ],
      },
    ];

    const translationInclude = buildQuestionTranslationInclude(language);

    if (translationInclude) {
      questionIncludes.push(translationInclude);
    }

    /* -------------------------------- */
    /* Load canonical question           */
    /* -------------------------------- */

    const question = await Question.findByPk(questionId, {
      attributes: ["id", "subjectId", "question", "explanation", "difficulty"],

      include: questionIncludes,

      order: [
        [Subject, SubjectSource, "displayOrder", "ASC"],

        [Subject, SubjectSource, "id", "ASC"],
      ],
    });

    if (!question) {
      return res.status(404).json({
        message: "Frågan hittades inte.",
      });
    }

    /* -------------------------------- */
    /* Translation                      */
    /* -------------------------------- */

    const translation = getQuestionTranslation(question, language);

    /* -------------------------------- */
    /* Sources                          */
    /* -------------------------------- */

    const sources = Array.isArray(question.Subject?.SubjectSources)
      ? question.Subject.SubjectSources.map((source) => ({
          id: Number(source.id),

          title: source.title,

          url: source.url,

          displayOrder: Number(source.displayOrder || 0),
        }))
      : [];

    /* -------------------------------- */
    /* Response                         */
    /* -------------------------------- */

    return res.status(200).json({
      correct: Boolean(answer.isCorrect),

      /*
       * Swedish is always canonical.
       */
      explanation: question.explanation || "",

      /*
       * Optional learning translation.
       */
      translation: translation
        ? {
            language: translation.language,

            explanation: translation.explanation,
          }
        : null,

      sources,
    });
  } catch (error) {
    console.error("Error checking answer:", error);

    return res.status(500).json({
      message: "Kunde inte kontrollera svaret",
    });
  }
});

module.exports = router;
