const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const AppSetting = sequelize.define(
  "AppSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    valueType: {
      type: DataTypes.ENUM("string", "number", "boolean", "json"),
      allowNull: false,
      defaultValue: "string",
    },

    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "app_settings",
    timestamps: true,
  },
);

module.exports = AppSetting;
