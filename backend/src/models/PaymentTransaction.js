const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Amount stored in smallest currency unit, e.g. öre.",
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "SEK",
    },

    paymentMethod: {
      type: DataTypes.ENUM("card", "swish", "klarna"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    provider: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    providerTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "payment_transactions",
    timestamps: true,

    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["paymentMethod"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  },
);

module.exports = PaymentTransaction;
