const { OAuth2Client } = require("google-auth-library");
const { randomBytes } = require("node:crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const client = new OAuth2Client();

exports.googleLogin = async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google-inloggning är ännu inte aktiverad." });
  }
  const { credential } = req.body;
  if (typeof credential !== "string" || credential.length > 10000) {
    return res.status(400).json({ message: "Google-inloggning saknas eller är ogiltig." });
  }
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || payload.email_verified !== true) throw new Error("Unverified email");
  } catch {
    return res.status(401).json({ message: "Google-inloggningen kunde inte verifieras. Försök igen." });
  }
  try {
    let user = await User.findOne({ where: { googleSubject: payload.sub } });
    if (!user) {
      const email = payload.email.trim().toLowerCase();
      user = await User.findOne({ where: { email } });
      // Only Google-controlled email addresses may link an existing account.
      if (user && (user.role !== "user" || user.googleSubject || (!email.endsWith("@gmail.com") && !payload.hd))) {
        return res.status(409).json({ message: "Kontot finns redan. Logga in med e-post och lösenord." });
      }
      if (user && !user.isActive) return res.status(403).json({ message: "Ditt konto är inaktiverat. Kontakta administratören." });
      if (user) {
        await user.update({ googleSubject: payload.sub, emailVerified: true });
      } else {
        user = await User.create({
          firstName: payload.given_name || payload.name || "Google-användare",
          lastName: payload.family_name || "",
          email,
          googleSubject: payload.sub,
          emailVerified: true,
          password: await bcrypt.hash(randomBytes(32).toString("hex"), 12),
          role: "user",
          isPremium: false,
        });
      }
    }
    if (!user.isActive) return res.status(403).json({ message: "Ditt konto är inaktiverat. Kontakta administratören." });
    await user.update({ lastLoginAt: new Date() });
    const { id, firstName, lastName, email, role, isPremium } = user;
    return res.json({ token: generateToken(id), user: { id, firstName, lastName, email, role, isPremium } });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Kontot ändrades samtidigt. Försök logga in igen." });
    }
    console.error("Google login failed:", error.name);
    return res.status(500).json({ message: "Google-inloggningen misslyckades. Försök igen." });
  }
};
