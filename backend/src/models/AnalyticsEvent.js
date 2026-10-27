const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const AnalyticsEvent = sequelize.define(
  "AnalyticsEvent",
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

    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    eventName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    pagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "analytics_events",
    timestamps: true,

    indexes: [
      {
        fields: ["eventName"],
      },
      {
        fields: ["sessionId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  },
);

module.exports = AnalyticsEvent;
