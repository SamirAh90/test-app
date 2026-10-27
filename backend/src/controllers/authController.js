const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/* -------------------------------- */
/* Safe user response               */
/* -------------------------------- */

const formatUserResponse = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isPremium: user.isPremium,
});

/* -------------------------------- */
/* Register                         */
/* -------------------------------- */

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Alla fält måste fyllas i.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Lösenordet måste innehålla minst 8 tecken.",
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
        message: "Det finns redan ett konto med denna e-postadress.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      isPremium: false,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      message: "Kontot skapades.",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Kontot kunde inte skapas. Försök igen.",
    });
  }
};

/* -------------------------------- */
/* Login                            */
/* -------------------------------- */

const login = async (req, res) => {
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

    const token = generateToken(user.id);

    return res.status(200).json({
      message: "Du är nu inloggad.",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Inloggningen misslyckades. Försök igen.",
    });
  }
};

/* -------------------------------- */
/* Current user                     */
/* -------------------------------- */

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: formatUserResponse(req.user),
  });
};

/* -------------------------------- */
/* Update profile                   */
/* -------------------------------- */

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { firstName, lastName, email, newPassword = "" } = req.body;

    if (!firstName?.trim()) {
      return res.status(400).json({
        message: "Förnamn måste fyllas i.",
      });
    }

    if (!lastName?.trim()) {
      return res.status(400).json({
        message: "Efternamn måste fyllas i.",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        message: "E-post måste fyllas i.",
      });
    }

    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({
        message: "Det nya lösenordet måste innehålla minst 8 tecken.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Kontot kunde inte hittas.",
      });
    }

    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Det finns redan ett konto med denna e-postadress.",
        });
      }
    }

    const updates = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
    };

    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    await user.update(updates);

    return res.status(200).json({
      message: "Profilen uppdaterades.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Profilen kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Delete account                   */
/* -------------------------------- */

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Ange ditt lösenord för att ta bort kontot.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Kontot kunde inte hittas.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Fel lösenord.",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "Kontot har tagits bort.",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      message: "Kontot kunde inte tas bort.",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  deleteAccount,
};
