const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const SubjectSource = sequelize.define(
  "SubjectSource",
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

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "subject_sources",
    timestamps: true,
  },
);

module.exports = SubjectSource;
