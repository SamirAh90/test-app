const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const QuizAnswer = sequelize.define(
  "QuizAnswer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    attemptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    selectedAnswerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "quiz_answers",
    timestamps: true,
  },
);

module.exports = QuizAnswer;
