const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AnswerTranslation = sequelize.define(
  "AnswerTranslation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    answerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    translatedAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "answer_translations",
    timestamps: true,

    indexes: [
      {
        name: "uq_answer_translation_language",
        unique: true,
        fields: ["answerId", "language"],
      },
    ],
  },
);

module.exports = AnswerTranslation;
