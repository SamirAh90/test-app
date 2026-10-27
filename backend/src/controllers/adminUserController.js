const bcrypt = require("bcryptjs");

const { sequelize } = require("../config/database");

const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");

/* -------------------------------- */
/* Constants                        */
/* -------------------------------- */

const USER_ATTRIBUTES = [
  "id",
  "firstName",
  "lastName",
  "email",
  "role",
  "isActive",
  "deactivatedAt",
  "lastLoginAt",
  "isPremium",
  "emailVerified",
  "createdAt",
  "updatedAt",
];

const ALLOWED_ROLES = ["user", "editor", "admin"];

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const formatUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  deactivatedAt: user.deactivatedAt,
  lastLoginAt: user.lastLoginAt,
  isPremium: user.isPremium,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getValidatedUserId = (value) => {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

/* -------------------------------- */
/* Get all users                    */
/* -------------------------------- */

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: USER_ATTRIBUTES,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      users: users.map(formatUser),
    });
  } catch (error) {
    console.error("Admin get users error:", error);

    return res.status(500).json({
      message: "Användarna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one user                     */
/* -------------------------------- */

const getAdminUser = async (req, res) => {
  try {
    const userId = getValidatedUserId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Användarens id är ogiltigt.",
      });
    }

    const user = await User.findByPk(userId, {
      attributes: USER_ATTRIBUTES,
    });

    if (!user) {
      return res.status(404).json({
        message: "Användaren kunde inte hittas.",
      });
    }

    return res.status(200).json({
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin get user error:", error);

    return res.status(500).json({
      message: "Användaren kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Create user                      */
/* -------------------------------- */

const createAdminUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = "user",
      isPremium = false,
      emailVerified = false,
      isActive = true,
    } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Alla obligatoriska fält måste fyllas i.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Lösenordet måste innehålla minst 8 tecken.",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Användarrollen är ogiltig.",
      });
    }

    if (typeof isPremium !== "boolean") {
      return res.status(400).json({
        message: "Premiumstatusen är ogiltig.",
      });
    }

    if (typeof emailVerified !== "boolean") {
      return res.status(400).json({
        message: "Verifieringsstatusen är ogiltig.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Kontostatusen är ogiltig.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "E-postadressen används redan.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      isPremium,
      emailVerified,
      isActive,
      deactivatedAt: isActive ? null : new Date(),
    });

    return res.status(201).json({
      message: "Användaren skapades.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin create user error:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Användaruppgifterna är ogiltiga.",
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "E-postadressen används redan.",
      });
    }

    return res.status(500).json({
      message: "Användaren kunde inte skapas.",
    });
  }
};

/* -------------------------------- */
/* Update user                      */
/* -------------------------------- */

const updateAdminUser = async (req, res) => {
  try {
    const userId = getValidatedUserId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Användarens id är ogiltigt.",
      });
    }

    const { role, isPremium, emailVerified } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Användarrollen är ogiltig.",
      });
    }

    if (typeof isPremium !== "boolean") {
      return res.status(400).json({
        message: "Premiumstatusen är ogiltig.",
      });
    }

    if (typeof emailVerified !== "boolean") {
      return res.status(400).json({
        message: "Verifieringsstatusen är ogiltig.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Användaren kunde inte hittas.",
      });
    }

    if (req.user.id === userId && role !== "admin") {
      return res.status(400).json({
        message: "Du kan inte ta bort din egen administratörsroll.",
      });
    }

    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.count({
        where: {
          role: "admin",
        },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message:
            "Den sista administratören kan inte ändras till en annan roll.",
        });
      }
    }

    user.role = role;
    user.isPremium = isPremium;
    user.emailVerified = emailVerified;

    await user.save();

    return res.status(200).json({
      message: "Användaren uppdaterades.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin update user error:", error);

    return res.status(500).json({
      message: "Användaren kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Deactivate user                  */
/* -------------------------------- */

const deactivateAdminUser = async (req, res) => {
  try {
    const userId = getValidatedUserId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Användarens id är ogiltigt.",
      });
    }

    if (req.user.id === userId) {
      return res.status(400).json({
        message: "Du kan inte inaktivera ditt eget konto.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Användaren kunde inte hittas.",
      });
    }

    if (!user.isActive) {
      return res.status(409).json({
        message: "Användaren är redan inaktiverad.",
      });
    }

    if (user.role === "admin") {
      const activeAdminCount = await User.count({
        where: {
          role: "admin",
          isActive: true,
        },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          message: "Den sista aktiva administratören kan inte inaktiveras.",
        });
      }
    }

    user.isActive = false;
    user.deactivatedAt = new Date();

    await user.save();

    return res.status(200).json({
      message: "Användaren inaktiverades.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin deactivate user error:", error);

    return res.status(500).json({
      message: "Användaren kunde inte inaktiveras.",
    });
  }
};

/* -------------------------------- */
/* Activate user                    */
/* -------------------------------- */

const activateAdminUser = async (req, res) => {
  try {
    const userId = getValidatedUserId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Användarens id är ogiltigt.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Användaren kunde inte hittas.",
      });
    }

    if (user.isActive) {
      return res.status(409).json({
        message: "Användaren är redan aktiv.",
      });
    }

    user.isActive = true;
    user.deactivatedAt = null;

    await user.save();

    return res.status(200).json({
      message: "Användaren aktiverades.",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Admin activate user error:", error);

    return res.status(500).json({
      message: "Användaren kunde inte aktiveras.",
    });
  }
};

/* -------------------------------- */
/* Delete user permanently          */
/* -------------------------------- */

const deleteAdminUser = async (req, res) => {
  try {
    const userId = getValidatedUserId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        message: "Användarens id är ogiltigt.",
      });
    }

    if (req.user.id === userId) {
      return res.status(400).json({
        message: "Du kan inte ta bort ditt eget konto.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Användaren kunde inte hittas.",
      });
    }

    if (user.role === "admin") {
      const adminCount = await User.count({
        where: {
          role: "admin",
        },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Den sista administratören kan inte tas bort.",
        });
      }
    }

    await sequelize.transaction(async (transaction) => {
      const attempts = await QuizAttempt.findAll({
        where: {
          userId,
        },
        attributes: ["id"],
        transaction,
      });

      const attemptIds = attempts.map((attempt) => attempt.id);

      if (attemptIds.length > 0) {
        await QuizAnswer.destroy({
          where: {
            attemptId: attemptIds,
          },
          transaction,
        });
      }

      await QuizAttempt.destroy({
        where: {
          userId,
        },
        transaction,
      });

      await user.destroy({
        transaction,
      });
    });

    return res.status(200).json({
      message: "Användaren och all tillhörande statistik togs bort.",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);

    return res.status(500).json({
      message: "Användaren kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  activateAdminUser,
  deleteAdminUser,
};
