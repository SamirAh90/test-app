const { sequelize } = require("../config/database");

const Subject = require("../models/Subject");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const QuestionTranslation = require("../models/QuestionTranslation");
const AnswerTranslation = require("../models/AnswerTranslation");

const SUPPORTED_LANGUAGES = ["en", "ar", "fa"];

const LANGUAGE_LABELS = {
  en: "English",
  ar: "Arabiska",
  fa: "Persiska / Dari",
};

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const getSupportedLanguages = () =>
  SUPPORTED_LANGUAGES.map((language) => ({
    code: language,
    label: LANGUAGE_LABELS[language],
  }));

const formatTranslationStatus = (question) => {
  const answers = Array.isArray(question.Answers) ? question.Answers : [];

  return SUPPORTED_LANGUAGES.reduce((status, language) => {
    const questionTranslation = (question.QuestionTranslations || []).find(
      (translation) => translation.language === language,
    );

    const questionTranslated = Boolean(
      questionTranslation?.translatedQuestion?.trim(),
    );

    const explanationTranslated = Boolean(
      questionTranslation?.translatedExplanation?.trim(),
    );

    const translatedAnswerCount = answers.filter((answer) =>
      (answer.AnswerTranslations || []).some(
        (translation) =>
          translation.language === language &&
          translation.translatedAnswer?.trim(),
      ),
    ).length;

    status[language] = {
      language,
      label: LANGUAGE_LABELS[language],
      questionTranslated,
      explanationTranslated,
      translatedAnswerCount,
      totalAnswers: answers.length,
      complete:
        questionTranslated &&
        answers.length > 0 &&
        translatedAnswerCount === answers.length,
    };

    return status;
  }, {});
};

const formatQuestionForTranslation = (question) => {
  const translations = SUPPORTED_LANGUAGES.reduce(
    (languageTranslations, language) => {
      const existingTranslation = (question.QuestionTranslations || []).find(
        (translation) => translation.language === language,
      );

      languageTranslations[language] = {
        translatedQuestion: existingTranslation?.translatedQuestion || "",
        translatedExplanation: existingTranslation?.translatedExplanation || "",
      };

      return languageTranslations;
    },
    {},
  );

  const answers = [...(question.Answers || [])]
    .sort(
      (firstAnswer, secondAnswer) =>
        firstAnswer.displayOrder - secondAnswer.displayOrder,
    )
    .map((answer) => {
      const answerTranslations = SUPPORTED_LANGUAGES.reduce(
        (languageTranslations, language) => {
          const existingTranslation = (answer.AnswerTranslations || []).find(
            (translation) => translation.language === language,
          );

          languageTranslations[language] =
            existingTranslation?.translatedAnswer || "";

          return languageTranslations;
        },
        {},
      );

      return {
        id: answer.id,
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect: answer.isCorrect,
        displayOrder: answer.displayOrder,
        translations: answerTranslations,
      };
    });

  return {
    id: question.id,
    subjectId: question.subjectId,
    question: question.question,
    explanation: question.explanation || "",
    difficulty: question.difficulty,

    subject: question.Subject
      ? {
          id: question.Subject.id,
          name: question.Subject.name,
          slug: question.Subject.slug,
        }
      : null,

    translations,
    answers,
  };
};

/* -------------------------------- */
/* Get all translation questions    */
/* -------------------------------- */

const getAdminTranslationQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      attributes: [
        "id",
        "subjectId",
        "question",
        "explanation",
        "difficulty",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
        {
          model: QuestionTranslation,
          attributes: [
            "id",
            "questionId",
            "language",
            "translatedQuestion",
            "translatedExplanation",
          ],
          required: false,
        },
        {
          model: Answer,
          attributes: [
            "id",
            "questionId",
            "answer",
            "isCorrect",
            "displayOrder",
          ],
          required: false,
          include: [
            {
              model: AnswerTranslation,
              attributes: ["id", "answerId", "language", "translatedAnswer"],
              required: false,
            },
          ],
        },
      ],
      order: [
        ["id", "ASC"],
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    const formattedQuestions = questions.map((question) => ({
      id: question.id,
      subjectId: question.subjectId,
      question: question.question,
      difficulty: question.difficulty,
      updatedAt: question.updatedAt,

      subject: question.Subject
        ? {
            id: question.Subject.id,
            name: question.Subject.name,
            slug: question.Subject.slug,
          }
        : null,

      answerCount: Array.isArray(question.Answers)
        ? question.Answers.length
        : 0,

      translationStatus: formatTranslationStatus(question),
    }));

    return res.status(200).json({
      questions: formattedQuestions,
      supportedLanguages: getSupportedLanguages(),
    });
  } catch (error) {
    console.error("Admin get translation questions error:", error);

    return res.status(500).json({
      message: "Översättningarna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get translations for question    */
/* -------------------------------- */

const getAdminQuestionTranslations = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    const question = await Question.findByPk(questionId, {
      attributes: ["id", "subjectId", "question", "explanation", "difficulty"],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
        {
          model: QuestionTranslation,
          attributes: [
            "id",
            "questionId",
            "language",
            "translatedQuestion",
            "translatedExplanation",
          ],
          required: false,
        },
        {
          model: Answer,
          attributes: [
            "id",
            "questionId",
            "answer",
            "isCorrect",
            "displayOrder",
          ],
          required: false,
          include: [
            {
              model: AnswerTranslation,
              attributes: ["id", "answerId", "language", "translatedAnswer"],
              required: false,
            },
          ],
        },
      ],
      order: [
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    if (!question) {
      return res.status(404).json({
        message: "Frågan kunde inte hittas.",
      });
    }

    return res.status(200).json({
      question: formatQuestionForTranslation(question),
      supportedLanguages: getSupportedLanguages(),
    });
  } catch (error) {
    console.error("Admin get question translations error:", error);

    return res.status(500).json({
      message: "Översättningarna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Save translations                */
/* -------------------------------- */

const saveAdminQuestionTranslations = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const { translations } = req.body;

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    if (!translations || typeof translations !== "object") {
      return res.status(400).json({
        message: "Översättningsdata saknas.",
      });
    }

    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: Answer,
          attributes: ["id", "questionId"],
          required: false,
        },
      ],
    });

    if (!question) {
      return res.status(404).json({
        message: "Frågan kunde inte hittas.",
      });
    }

    const questionAnswerIds = (question.Answers || []).map(
      (answer) => answer.id,
    );

    await sequelize.transaction(async (transaction) => {
      for (const language of SUPPORTED_LANGUAGES) {
        const languageData = translations[language] || {};

        const translatedQuestion =
          languageData.translatedQuestion?.trim() || "";

        const translatedExplanation =
          languageData.translatedExplanation?.trim() || null;

        const translatedAnswers =
          languageData.answers && typeof languageData.answers === "object"
            ? languageData.answers
            : {};

        const existingQuestionTranslation = await QuestionTranslation.findOne({
          where: {
            questionId,
            language,
          },
          transaction,
        });

        if (translatedQuestion) {
          if (existingQuestionTranslation) {
            existingQuestionTranslation.translatedQuestion = translatedQuestion;

            existingQuestionTranslation.translatedExplanation =
              translatedExplanation;

            await existingQuestionTranslation.save({
              transaction,
            });
          } else {
            await QuestionTranslation.create(
              {
                questionId,
                language,
                translatedQuestion,
                translatedExplanation,
              },
              {
                transaction,
              },
            );
          }
        } else if (existingQuestionTranslation) {
          await existingQuestionTranslation.destroy({
            transaction,
          });
        }

        for (const answerId of questionAnswerIds) {
          const translatedAnswer =
            translatedAnswers[String(answerId)]?.trim() ||
            translatedAnswers[answerId]?.trim() ||
            "";

          const existingAnswerTranslation = await AnswerTranslation.findOne({
            where: {
              answerId,
              language,
            },
            transaction,
          });

          if (translatedAnswer) {
            if (existingAnswerTranslation) {
              existingAnswerTranslation.translatedAnswer = translatedAnswer;

              await existingAnswerTranslation.save({
                transaction,
              });
            } else {
              await AnswerTranslation.create(
                {
                  answerId,
                  language,
                  translatedAnswer,
                },
                {
                  transaction,
                },
              );
            }
          } else if (existingAnswerTranslation) {
            await existingAnswerTranslation.destroy({
              transaction,
            });
          }
        }
      }
    });

    const updatedQuestion = await Question.findByPk(questionId, {
      attributes: ["id", "subjectId", "question", "explanation", "difficulty"],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
        {
          model: QuestionTranslation,
          attributes: [
            "id",
            "questionId",
            "language",
            "translatedQuestion",
            "translatedExplanation",
          ],
          required: false,
        },
        {
          model: Answer,
          attributes: [
            "id",
            "questionId",
            "answer",
            "isCorrect",
            "displayOrder",
          ],
          required: false,
          include: [
            {
              model: AnswerTranslation,
              attributes: ["id", "answerId", "language", "translatedAnswer"],
              required: false,
            },
          ],
        },
      ],
      order: [
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    return res.status(200).json({
      message: "Översättningarna sparades.",
      question: formatQuestionForTranslation(updatedQuestion),
    });
  } catch (error) {
    console.error("Admin save question translations error:", error);

    return res.status(500).json({
      message: "Översättningarna kunde inte sparas.",
    });
  }
};

module.exports = {
  getAdminTranslationQuestions,
  getAdminQuestionTranslations,
  saveAdminQuestionTranslations,
};
