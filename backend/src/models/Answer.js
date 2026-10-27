const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Answer = sequelize.define(
  "Answer",
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

    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "answers",
    timestamps: true,
  },
);

module.exports = Answer;
