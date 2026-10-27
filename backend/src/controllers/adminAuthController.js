const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const formatAdminResponse = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  isPremium: user.isPremium,
  emailVerified: user.emailVerified,
  lastLoginAt: user.lastLoginAt,
});

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "E-post och lösenord måste fyllas i.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Fel e-postadress eller lösenord.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Fel e-postadress eller lösenord.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Kontot är inaktiverat. Kontakta en administratör.",
      });
    }

    const allowedRoles = ["editor", "admin"];

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Du har inte behörighet att logga in i adminportalen.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user.id);

    return res.status(200).json({
      message: "Du är nu inloggad i adminportalen.",
      token,
      user: formatAdminResponse(user),
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Admininloggningen misslyckades. Försök igen.",
    });
  }
};

const getCurrentAdmin = async (req, res) => {
  return res.status(200).json({
    user: formatAdminResponse(req.user),
  });
};

module.exports = {
  adminLogin,
  getCurrentAdmin,
};
