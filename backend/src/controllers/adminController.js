const User = require("../models/User");
const Subject = require("../models/Subject");
const Question = require("../models/Question");
const QuestionTranslation = require("../models/QuestionTranslation");
const SubjectMaterial = require("../models/SubjectMaterial");
const SubjectGlossary = require("../models/SubjectGlossary");
const SubjectSource = require("../models/SubjectSource");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      subjectCount,
      materialCount,
      glossaryCount,
      sourceCount,
      questionCount,
      translationCount,
    ] = await Promise.all([
      Subject.count(),
      SubjectMaterial.count(),
      SubjectGlossary.count(),
      SubjectSource.count(),
      Question.count(),
      QuestionTranslation.count(),
    ]);

    const dashboard = {
      currentUser: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
      },

      content: {
        subjects: subjectCount,
        studyMaterials: materialCount,
        glossaryTerms: glossaryCount,
        officialSources: sourceCount,
        questions: questionCount,
        questionTranslations: translationCount,
      },
    };

    if (req.user.role === "admin") {
      const [totalUsers, activeUsers, premiumUsers, editors, admins] =
        await Promise.all([
          User.count(),

          User.count({
            where: {
              isActive: true,
            },
          }),

          User.count({
            where: {
              isPremium: true,
            },
          }),

          User.count({
            where: {
              role: "editor",
            },
          }),

          User.count({
            where: {
              role: "admin",
            },
          }),
        ]);

      dashboard.users = {
        total: totalUsers,
        active: activeUsers,
        premium: premiumUsers,
        editors,
        admins,
      };
    }

    return res.status(200).json({
      message: "Adminpanelen kunde hämtas.",
      dashboard,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Adminpanelen kunde inte hämtas.",
    });
  }
};

module.exports = {
  getAdminDashboard,
};
