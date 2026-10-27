const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const QuestionTranslation = sequelize.define(
  "QuestionTranslation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    translatedQuestion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    translatedExplanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "question_translations",
    timestamps: true,

    indexes: [
      {
        name: "uq_question_translation_language",
        unique: true,
        fields: ["questionId", "language"],
      },
    ],
  },
);

module.exports = QuestionTranslation;
