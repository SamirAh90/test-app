const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
      defaultValue: "medium",
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  },
);

module.exports = Question;
