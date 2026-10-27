const { Op, fn, col, literal } = require("sequelize");

const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");
const Subject = require("../models/Subject");

/* -------------------------------- */
/* Save quiz attempt                */
/* -------------------------------- */

const saveAttempt = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      quizType = "demo",
      score,
      totalQuestions,
      percentage,
      answers = [],
    } = req.body;

    /* -------------------------------- */
    /* Validate result                  */
    /* -------------------------------- */

    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      !Number.isInteger(percentage)
    ) {
      return res.status(400).json({
        message: "Resultatet innehåller ogiltiga värden.",
      });
    }

    if (score < 0 || totalQuestions <= 0 || score > totalQuestions) {
      return res.status(400).json({
        message: "Poängen eller antalet frågor är ogiltigt.",
      });
    }

    const allowedQuizTypes = [
      "demo",
      "free",
      "premium",
      "subject",
      "smart",
      "simulator",
    ];

    if (!allowedQuizTypes.includes(quizType)) {
      return res.status(400).json({
        message: "Ogiltig quiztyp.",
      });
    }

    /* -------------------------------- */
    /* Save attempt                     */
    /* -------------------------------- */

    const attempt = await QuizAttempt.create({
      userId,
      quizType,
      status: "completed",
      score,
      totalQuestions,
      percentage,
      startedAt: new Date(),
      completedAt: new Date(),
    });

    /* -------------------------------- */
    /* Save answers                     */
    /* -------------------------------- */

    if (Array.isArray(answers) && answers.length > 0) {
      const formattedAnswers = answers.map((answer) => ({
        attemptId: attempt.id,

        questionId: answer.questionId,

        subjectId: answer.subjectId,

        selectedAnswerId: answer.selectedAnswerId,

        correct: Boolean(answer.correct),
      }));

      await QuizAnswer.bulkCreate(formattedAnswers);
    }

    return res.status(201).json({
      message: "Resultatet sparades.",

      attempt: {
        id: attempt.id,

        quizType: attempt.quizType,

        status: attempt.status,

        score: attempt.score,

        totalQuestions: attempt.totalQuestions,

        percentage: attempt.percentage,

        completedAt: attempt.completedAt,
      },

      savedAnswers: Array.isArray(answers) ? answers.length : 0,
    });
  } catch (error) {
    console.error("Save quiz attempt error:", error);

    return res.status(500).json({
      message: "Resultatet kunde inte sparas.",
    });
  }
};

/* -------------------------------- */
/* Get progress summary             */
/* -------------------------------- */

const getProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    /* -------------------------------- */
    /* Completed account attempts       */
    /*                                  */
    /* Used only for history / trend.   */
    /*                                  */
    /* In-progress attempts must NOT    */
    /* appear as completed results.     */
    /* -------------------------------- */

    const completedAttempts = await QuizAttempt.findAll({
      where: {
        userId,

        status: "completed",

        quizType: {
          [Op.ne]: "demo",
        },
      },

      order: [["completedAt", "DESC"]],
    });

    const latestAttempt = completedAttempts[0] || null;

    /* -------------------------------- */
    /* Live saved-answer statistics     */
    /*                                  */
    /* This is the source of truth for  */
    /* Min träning statistics.          */
    /*                                  */
    /* Includes answers from active     */
    /* sessions immediately.            */
    /* -------------------------------- */

    const answerTotals = await QuizAnswer.findOne({
      attributes: [
        [fn("COUNT", col("QuizAnswer.id")), "answeredQuestions"],

        [
          fn(
            "SUM",
            literal("CASE WHEN `QuizAnswer`.`correct` = 1 THEN 1 ELSE 0 END"),
          ),
          "correctAnswers",
        ],
      ],

      include: [
        {
          model: QuizAttempt,

          attributes: [],

          required: true,

          where: {
            userId,

            quizType: {
              [Op.ne]: "demo",
            },

            status: {
              [Op.in]: ["in_progress", "completed"],
            },
          },
        },
      ],

      raw: true,
    });

    const answeredQuestions = Number(answerTotals?.answeredQuestions || 0);

    const correctAnswers = Number(answerTotals?.correctAnswers || 0);

    const wrongAnswers = Math.max(0, answeredQuestions - correctAnswers);

    const averagePercentage =
      answeredQuestions > 0
        ? Math.round((correctAnswers / answeredQuestions) * 100)
        : 0;

    /* -------------------------------- */
    /* Active training sessions         */
    /* -------------------------------- */

    const activeAttempts = await QuizAttempt.count({
      where: {
        userId,

        status: "in_progress",

        quizType: {
          [Op.ne]: "demo",
        },
      },
    });

    /* -------------------------------- */
    /* Recent completed result trend    */
    /* Oldest → newest for chart        */
    /* -------------------------------- */

    const recentAttempts = completedAttempts
      .slice(0, 5)
      .reverse()
      .map((attempt) => ({
        id: attempt.id,

        quizType: attempt.quizType,

        score: Number(attempt.score || 0),

        totalQuestions: Number(attempt.totalQuestions || 0),

        percentage: Number(attempt.percentage || 0),

        completedAt: attempt.completedAt,
      }));

    /* -------------------------------- */
    /* Subject statistics               */
    /*                                  */
    /* Based on actual QuizAnswer rows. */
    /* Active answers count instantly.  */
    /* -------------------------------- */

    const subjectStatistics = await QuizAnswer.findAll({
      attributes: [
        "subjectId",

        [fn("COUNT", col("QuizAnswer.id")), "total"],

        [
          fn(
            "SUM",
            literal("CASE WHEN `QuizAnswer`.`correct` = 1 THEN 1 ELSE 0 END"),
          ),
          "correct",
        ],
      ],

      include: [
        {
          model: QuizAttempt,

          attributes: [],

          required: true,

          where: {
            userId,

            quizType: {
              [Op.ne]: "demo",
            },

            status: {
              [Op.in]: ["in_progress", "completed"],
            },
          },
        },

        {
          model: Subject,

          attributes: ["id", "name"],

          required: true,
        },
      ],

      group: ["QuizAnswer.subjectId", "Subject.id", "Subject.name"],

      raw: true,
      nest: true,
    });

    /* -------------------------------- */
    /* Normalize subject results        */
    /* -------------------------------- */

    const subjects = subjectStatistics.map((item) => {
      const total = Number(item.total || 0);

      const correct = Number(item.correct || 0);

      const wrong = Math.max(0, total - correct);

      return {
        id: item.Subject.id,

        name: item.Subject.name,

        total,

        correct,

        wrong,

        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });

    /* -------------------------------- */
    /* Recommended subjects             */
    /* -------------------------------- */

    const recommendedSubjects = [...subjects]
      .filter((subject) => subject.percentage < 70)
      .sort((firstSubject, secondSubject) => {
        if (firstSubject.percentage !== secondSubject.percentage) {
          return firstSubject.percentage - secondSubject.percentage;
        }

        return secondSubject.total - firstSubject.total;
      })
      .slice(0, 3);

    /* -------------------------------- */
    /* Response                         */
    /* -------------------------------- */

    return res.status(200).json({
      summary: {
        /*
         * Number of completed sessions.
         *
         * An active simulator is not counted
         * as a completed training attempt.
         */
        attempts: completedAttempts.length,

        activeAttempts,

        /*
         * Actual saved answers.
         *
         * This updates after every answer.
         */
        answeredQuestions,

        correctAnswers,

        wrongAnswers,

        averagePercentage,

        latestPercentage: Number(latestAttempt?.percentage || 0),

        testedSubjects: subjects.length,
      },

      latestAttempt: latestAttempt
        ? {
            id: latestAttempt.id,

            quizType: latestAttempt.quizType,

            score: Number(latestAttempt.score || 0),

            totalQuestions: Number(latestAttempt.totalQuestions || 0),

            percentage: Number(latestAttempt.percentage || 0),

            completedAt: latestAttempt.completedAt,
          }
        : null,

      recentAttempts,

      subjects,

      recommendedSubjects,
    });
  } catch (error) {
    console.error("Get progress summary error:", error);

    return res.status(500).json({
      message: "Statistiken kunde inte hämtas.",
    });
  }
};

module.exports = {
  saveAttempt,
  getProgressSummary,
};
