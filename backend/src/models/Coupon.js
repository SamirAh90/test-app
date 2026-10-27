const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const Coupon = sequelize.define(
  "Coupon",
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

    discountType: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },

    discountValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:
        "Percentage value for percentage coupons, or amount in öre for fixed coupons.",
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
    tableName: "coupons",
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

module.exports = Coupon;
