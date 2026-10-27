const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { connectDatabase, sequelize } = require("./config/database");

/* -------------------------------- */
/* Models                           */
/* -------------------------------- */

const User = require("./models/User");
const Subject = require("./models/Subject");
const Question = require("./models/Question");
const Answer = require("./models/Answer");
const QuestionTranslation = require("./models/QuestionTranslation");
const AnswerTranslation = require("./models/AnswerTranslation");
const QuizAttempt = require("./models/QuizAttempt");
const QuizAnswer = require("./models/QuizAnswer");
const SubjectMaterial = require("./models/SubjectMaterial");
const SubjectGlossary = require("./models/SubjectGlossary");
const SubjectSource = require("./models/SubjectSource");
const AnalyticsEvent = require("./models/AnalyticsEvent");
const AppSetting = require("./models/AppSetting");
const PaymentTransaction = require("./models/PaymentTransaction");
const Coupon = require("./models/Coupon");
const PremiumCode = require("./models/PremiumCode");

/* -------------------------------- */
/* Routes                           */
/* -------------------------------- */

const subjectRoutes = require("./routes/subjectRoutes");
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const studyRoutes = require("./routes/studyRoutes");
const glossaryRoutes = require("./routes/glossaryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const trainingSessionRoutes = require("./routes/trainingSessionRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminSubjectRoutes = require("./routes/adminSubjectRoutes");
const adminMaterialRoutes = require("./routes/adminMaterialRoutes");
const adminGlossaryRoutes = require("./routes/adminGlossaryRoutes");
const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
const adminSourceRoutes = require("./routes/adminSourceRoutes");
const adminTranslationRoutes = require("./routes/adminTranslationRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");
const adminPaymentSettingsRoutes = require("./routes/adminPaymentSettingsRoutes");
const adminCouponRoutes = require("./routes/adminCouponRoutes");
const adminPremiumCodeRoutes = require("./routes/adminPremiumCodeRoutes");
const paymentSettingsRoutes = require("./routes/paymentSettingsRoutes");
const paymentCodeRoutes = require("./routes/paymentCodeRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const smartTrainingRoutes = require("./routes/smartTrainingRoutes");
const freeTrainingRoutes = require("./routes/freeTrainingRoutes");
const premiumTrainingRoutes = require("./routes/premiumTrainingRoutes");
const simulatorRoutes = require("./routes/simulatorRoutes");

/* -------------------------------- */
/* Associations                     */
/* -------------------------------- */

/* Subject and Question */

Subject.hasMany(Question, {
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

Question.belongsTo(Subject, {
  foreignKey: "subjectId",
});

/* Question and Answer */

Question.hasMany(Answer, {
  foreignKey: "questionId",
  onDelete: "CASCADE",
});

Answer.belongsTo(Question, {
  foreignKey: "questionId",
});

/* Question translations */

Question.hasMany(QuestionTranslation, {
  foreignKey: "questionId",
  onDelete: "CASCADE",
});

QuestionTranslation.belongsTo(Question, {
  foreignKey: "questionId",
});

/* Answer translations */

Answer.hasMany(AnswerTranslation, {
  foreignKey: "answerId",
  onDelete: "CASCADE",
});

AnswerTranslation.belongsTo(Answer, {
  foreignKey: "answerId",
});

/* User progress */

User.hasMany(QuizAttempt, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

QuizAttempt.belongsTo(User, {
  foreignKey: "userId",
});

/* Attempt answers */

QuizAttempt.hasMany(QuizAnswer, {
  foreignKey: "attemptId",
  onDelete: "CASCADE",
});

QuizAnswer.belongsTo(QuizAttempt, {
  foreignKey: "attemptId",
});

/* Saved answer and question */

Question.hasMany(QuizAnswer, {
  foreignKey: "questionId",
  onDelete: "CASCADE",
});

QuizAnswer.belongsTo(Question, {
  foreignKey: "questionId",
});

/* Saved answer and subject */

Subject.hasMany(QuizAnswer, {
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

QuizAnswer.belongsTo(Subject, {
  foreignKey: "subjectId",
});

/* Selected answer */

Answer.hasMany(QuizAnswer, {
  foreignKey: "selectedAnswerId",
  onDelete: "CASCADE",
});

QuizAnswer.belongsTo(Answer, {
  foreignKey: "selectedAnswerId",
});

/* Subject material */

Subject.hasOne(SubjectMaterial, {
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

SubjectMaterial.belongsTo(Subject, {
  foreignKey: "subjectId",
});

/* Subject glossary */

Subject.hasMany(SubjectGlossary, {
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

SubjectGlossary.belongsTo(Subject, {
  foreignKey: "subjectId",
});

/* Subject sources */

Subject.hasMany(SubjectSource, {
  foreignKey: "subjectId",
  onDelete: "CASCADE",
});

SubjectSource.belongsTo(Subject, {
  foreignKey: "subjectId",
});

/* Analytics events */

User.hasMany(AnalyticsEvent, {
  foreignKey: "userId",
  onDelete: "SET NULL",
});

AnalyticsEvent.belongsTo(User, {
  foreignKey: "userId",
});

/* Payment transactions */

User.hasMany(PaymentTransaction, {
  foreignKey: "userId",
  as: "paymentTransactions",
  onDelete: "SET NULL",
});

PaymentTransaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/* -------------------------------- */
/* Express application              */
/* -------------------------------- */

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------------------- */
/* Public API                       */
/* -------------------------------- */

app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/glossary", glossaryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);
app.use("/api/payment-codes", paymentCodeRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/smart-training", smartTrainingRoutes);
app.use("/api/free-training", freeTrainingRoutes);
app.use("/api/premium-training", premiumTrainingRoutes);
app.use("/api/training-sessions", trainingSessionRoutes);
app.use("/api/simulator", simulatorRoutes);

/* -------------------------------- */
/* Admin API                        */
/* -------------------------------- */

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/subjects", adminSubjectRoutes);
app.use("/api/admin/materials", adminMaterialRoutes);
app.use("/api/admin/glossary", adminGlossaryRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/admin/sources", adminSourceRoutes);
app.use("/api/admin/translations", adminTranslationRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/payment-settings", adminPaymentSettingsRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);
app.use("/api/admin/premium-codes", adminPremiumCodeRoutes);

/* -------------------------------- */
/* Health check                     */
/* -------------------------------- */

app.get("/", (req, res) => {
  res.json({
    message: "MedborgaTest API is running 🚀",
  });
});

/* -------------------------------- */
/* Start server                     */
/* -------------------------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    await sequelize.sync();

    console.log("✅ Database tables synchronized Samir!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server could not start:", error);

    process.exit(1);
  }
};

startServer();
