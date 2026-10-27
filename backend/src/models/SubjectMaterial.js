const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const SubjectMaterial = sequelize.define(
  "SubjectMaterial",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    body: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "subject_materials",
    timestamps: true,
  },
);

module.exports = SubjectMaterial;
