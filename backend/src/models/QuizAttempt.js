const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quizType: {
      type: DataTypes.ENUM(
        "demo",
        "free",
        "premium",
        "subject",
        "smart",
        "simulator",
      ),
      allowNull: false,
      defaultValue: "demo",
    },

    /* -------------------------------- */
    /* Session status                   */
    /* -------------------------------- */

    status: {
      type: DataTypes.ENUM("in_progress", "completed", "abandoned"),

      allowNull: false,
      defaultValue: "completed",
    },

    /* -------------------------------- */
    /* Current score                    */
    /* -------------------------------- */

    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    /* -------------------------------- */
    /* Planned number of questions      */
    /* -------------------------------- */

    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /* -------------------------------- */
    /* Current / final percentage       */
    /* -------------------------------- */

    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    /* -------------------------------- */
    /* Simulator question order         */
    /* -------------------------------- */

    simulatorQuestionIds: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,

      /*
        Used only by Provsimulator.

        Example:
        [14, 3, 22, 8, 41, ...]

        This preserves the exact questions
        and their exact order when the user
        leaves and later resumes the exam.
      */
    },
 /* -------------------------------- */
/* Simulator flagged questions      */
/* -------------------------------- */

flaggedQuestionIds: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: null,

  /*
    Used by Provsimulator.

    Stores question IDs that the user has
    flagged for later review during the
    current simulator attempt.

    Example:
    [3, 19, 7]
  */
},

    /* -------------------------------- */
    /* Session start                    */
    /* -------------------------------- */

    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    /* -------------------------------- */
    /* Session completion               */
    /* -------------------------------- */

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "quiz_attempts",
    timestamps: true,
  },
);

module.exports = QuizAttempt;
