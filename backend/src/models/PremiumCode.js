const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const PremiumCode = sequelize.define(
  "PremiumCode",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Null means unlimited usage.",
    },

    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    validFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "premium_codes",
    timestamps: true,

    indexes: [
      {
        fields: ["code"],
      },
      {
        fields: ["isActive"],
      },
      {
        fields: ["validUntil"],
      },
    ],
  },
);

module.exports = PremiumCode;
