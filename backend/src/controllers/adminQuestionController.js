const Subject = require("../models/Subject");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const QuestionTranslation = require("../models/QuestionTranslation");
const AnswerTranslation = require("../models/AnswerTranslation");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");
const QuizAnswer = require("../models/QuizAnswer");

/* -------------------------------- */
/* Get all questions                */
/* -------------------------------- */

const getAdminQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      attributes: [
        "id",
        "subjectId",
        "question",
        "explanation",
        "difficulty",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
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
        },
        {
          model: QuestionTranslation,
          attributes: ["id", "questionId", "language"],
          required: false,
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
      explanation: question.explanation,
      difficulty: question.difficulty,
      createdAt: question.createdAt,
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

      translationCount: Array.isArray(question.QuestionTranslations)
        ? question.QuestionTranslations.length
        : 0,

      answers: Array.isArray(question.Answers) ? question.Answers : [],
    }));

    return res.status(200).json({
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Admin get questions error:", error);

    return res.status(500).json({
      message: "Frågorna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one question                 */
/* -------------------------------- */

const getAdminQuestion = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    const question = await Question.findByPk(questionId, {
      attributes: [
        "id",
        "subjectId",
        "question",
        "explanation",
        "difficulty",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
        {
          model: Answer,
          attributes: [
            "id",
            "questionId",
            "answer",
            "isCorrect",
            "displayOrder",
            "createdAt",
            "updatedAt",
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
        {
          model: QuestionTranslation,
          attributes: [
            "id",
            "questionId",
            "language",
            "translatedQuestion",
            "translatedExplanation",
            "createdAt",
            "updatedAt",
          ],
          required: false,
        },
      ],
      order: [[Answer, "displayOrder", "ASC"]],
    });

    if (!question) {
      return res.status(404).json({
        message: "Frågan kunde inte hittas.",
      });
    }

    return res.status(200).json({
      question,
    });
  } catch (error) {
    console.error("Admin get question error:", error);

    return res.status(500).json({
      message: "Frågan kunde inte hämtas.",
    });
  }
};
const updateAdminQuestion = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    const { subjectId, question, explanation, difficulty, answers } = req.body;

    const normalizedSubjectId = Number(subjectId);
    const normalizedQuestion = question?.trim();
    const normalizedExplanation = explanation?.trim() || null;

    if (!Number.isInteger(normalizedSubjectId) || normalizedSubjectId <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Välj ett giltigt ämne.",
      });
    }

    if (!normalizedQuestion) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Frågan måste fyllas i.",
      });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Svårighetsgraden är ogiltig.",
      });
    }

    if (!Array.isArray(answers) || answers.length !== 4) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Frågan måste innehålla exakt fyra svar.",
      });
    }

    const normalizedAnswers = answers.map((answer, index) => ({
      id: Number(answer.id),
      answer: answer.answer?.trim(),
      displayOrder: index + 1,
      isCorrect: Boolean(answer.isCorrect),
    }));

    if (
      normalizedAnswers.some(
        (answer) =>
          !Number.isInteger(answer.id) || answer.id <= 0 || !answer.answer,
      )
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Alla fyra svar måste vara giltiga.",
      });
    }

    const correctAnswerCount = normalizedAnswers.filter(
      (answer) => answer.isCorrect,
    ).length;

    if (correctAnswerCount !== 1) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Exakt ett svar måste vara korrekt.",
      });
    }

    const subject = await Subject.findByPk(normalizedSubjectId, {
      transaction,
    });

    if (!subject) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const existingQuestion = await Question.findByPk(questionId, {
      include: [
        {
          model: Answer,
          required: false,
        },
      ],
      transaction,
    });

    if (!existingQuestion) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Frågan kunde inte hittas.",
      });
    }

    const existingAnswerIds = new Set(
      (existingQuestion.Answers || []).map((answer) => answer.id),
    );

    const submittedAnswerIds = new Set(
      normalizedAnswers.map((answer) => answer.id),
    );

    if (
      existingAnswerIds.size !== 4 ||
      submittedAnswerIds.size !== 4 ||
      [...submittedAnswerIds].some(
        (answerId) => !existingAnswerIds.has(answerId),
      )
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Svarsalternativen matchar inte frågan.",
      });
    }

    existingQuestion.subjectId = normalizedSubjectId;
    existingQuestion.question = normalizedQuestion;
    existingQuestion.explanation = normalizedExplanation;
    existingQuestion.difficulty = difficulty;

    await existingQuestion.save({
      transaction,
    });

    await Promise.all(
      normalizedAnswers.map((answerData) =>
        Answer.update(
          {
            answer: answerData.answer,
            isCorrect: answerData.isCorrect,
            displayOrder: answerData.displayOrder,
          },
          {
            where: {
              id: answerData.id,
              questionId,
            },
            transaction,
          },
        ),
      ),
    );

    await transaction.commit();

    const updatedQuestion = await Question.findByPk(questionId, {
      attributes: [
        "id",
        "subjectId",
        "question",
        "explanation",
        "difficulty",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
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
        },
      ],
      order: [[Answer, "displayOrder", "ASC"]],
    });

    return res.status(200).json({
      message: "Frågan uppdaterades.",
      question: updatedQuestion,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Admin update question error:", error);

    return res.status(500).json({
      message: "Frågan kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Create question                  */
/* -------------------------------- */

const createAdminQuestion = async (req, res) => {
  try {
    const { subjectId, question, explanation, difficulty, answers } = req.body;

    const normalizedSubjectId = Number(subjectId);
    const normalizedQuestion = question?.trim();
    const normalizedExplanation = explanation?.trim() || null;

    if (!Number.isInteger(normalizedSubjectId) || normalizedSubjectId <= 0) {
      return res.status(400).json({
        message: "Välj ett giltigt ämne.",
      });
    }

    if (!normalizedQuestion) {
      return res.status(400).json({
        message: "Frågan måste fyllas i.",
      });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Svårighetsgraden är ogiltig.",
      });
    }

    if (!Array.isArray(answers) || answers.length !== 4) {
      return res.status(400).json({
        message: "Frågan måste innehålla exakt fyra svar.",
      });
    }

    const normalizedAnswers = answers.map((answer, index) => ({
      answer: answer.answer?.trim(),
      displayOrder: index + 1,
      isCorrect: Boolean(answer.isCorrect),
    }));

    if (normalizedAnswers.some((answer) => !answer.answer)) {
      return res.status(400).json({
        message: "Alla fyra svar måste fyllas i.",
      });
    }

    const correctAnswerCount = normalizedAnswers.filter(
      (answer) => answer.isCorrect,
    ).length;

    if (correctAnswerCount !== 1) {
      return res.status(400).json({
        message: "Exakt ett svar måste vara korrekt.",
      });
    }

    const subject = await Subject.findByPk(normalizedSubjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const createdQuestionId = await sequelize.transaction(
      async (transaction) => {
        const createdQuestion = await Question.create(
          {
            subjectId: normalizedSubjectId,
            question: normalizedQuestion,
            explanation: normalizedExplanation,
            difficulty,
          },
          {
            transaction,
          },
        );

        await Answer.bulkCreate(
          normalizedAnswers.map((answer) => ({
            questionId: createdQuestion.id,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
            displayOrder: answer.displayOrder,
          })),
          {
            transaction,
          },
        );

        return createdQuestion.id;
      },
    );

    const createdQuestion = await Question.findByPk(createdQuestionId, {
      attributes: [
        "id",
        "subjectId",
        "question",
        "explanation",
        "difficulty",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
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
        },
      ],
      order: [
        [Answer, "displayOrder", "ASC"],
        [Answer, "id", "ASC"],
      ],
    });

    return res.status(201).json({
      message: "Frågan skapades.",
      question: createdQuestion,
    });
  } catch (error) {
    console.error("Admin create question error:", error);

    return res.status(500).json({
      message: "Frågan kunde inte skapas.",
    });
  }
};

/* -------------------------------- */
/* Delete question                  */
/* -------------------------------- */

const deleteAdminQuestion = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        message: "Frågans id är ogiltigt.",
      });
    }

    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: Answer,
          attributes: ["id"],
          required: false,
        },
      ],
    });

    if (!question) {
      return res.status(404).json({
        message: "Frågan kunde inte hittas.",
      });
    }

    const answerIds = (question.Answers || []).map((answer) => answer.id);

    await sequelize.transaction(async (transaction) => {
      // Remove saved quiz results connected to the question.
      await QuizAnswer.destroy({
        where: {
          questionId,
        },
        transaction,
      });

      // Remove translations connected to the answers.
      if (answerIds.length > 0) {
        await AnswerTranslation.destroy({
          where: {
            answerId: {
              [Op.in]: answerIds,
            },
          },
          transaction,
        });
      }

      // Remove answer options.
      await Answer.destroy({
        where: {
          questionId,
        },
        transaction,
      });

      // Remove question translations.
      await QuestionTranslation.destroy({
        where: {
          questionId,
        },
        transaction,
      });

      // Remove the question.
      await Question.destroy({
        where: {
          id: questionId,
        },
        transaction,
      });
    });

    return res.status(200).json({
      message: "Frågan togs bort.",
    });
  } catch (error) {
    console.error("Admin delete question error:", error);

    return res.status(500).json({
      message: "Frågan kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminQuestions,
  getAdminQuestion,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
};
