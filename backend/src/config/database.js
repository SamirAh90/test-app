const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
  },
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL connected successfully Samir!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

module.exports = {
  sequelize,
  connectDatabase,
};
