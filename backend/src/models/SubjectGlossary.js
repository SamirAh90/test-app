const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const SubjectGlossary = sequelize.define(
  "SubjectGlossary",
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

    word: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    definition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "subject_glossary",
    timestamps: true,
  },
);

module.exports = SubjectGlossary;
