const { randomBytes, createHash } = require("node:crypto");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("../models/User");
const LoginLink = require("../models/LoginLink");
const mail = require("../utils/loginEmail");
const generateToken = require("../utils/generateToken");

const hash = token => createHash("sha256").update(token).digest("hex");
const invalidMessage = "Länken är ogiltig, har gått ut eller har redan använts. Begär en ny inloggningslänk.";

exports.requestLink = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Ange en giltig e-postadress." });
  }
  if (!mail.emailConfigured()) {
    return res.status(503).json({ message: "Inloggning via e-postlänk är ännu inte aktiverad. Använd lösenord tills vidare." });
  }
  try {
    const base = new URL(process.env.FRONTEND_URL);
    if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))) throw new Error("Invalid frontend URL");
    const user = await User.findOne({ where: { email, isActive: true, role: "user" } });
    if (user) {
      const token = randomBytes(32).toString("hex");
      const link = new URL("/login/email", base);
      // Fragment keeps the credential out of HTTP access logs and referrers.
      link.hash = token;
      await LoginLink.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } });
      const record = await LoginLink.create({ tokenHash: hash(token), userId: user.id, email, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
      try { await mail.sendLoginEmail(email, link.toString()); }
      catch (error) {
        await record.destroy();
        // Keep response identical for existing and unknown addresses.
        console.error("Login email delivery failed:", error.code || "delivery_error");
      }
    }
    return res.json({ message: "Om adressen tillhör ett aktivt användarkonto skickas en inloggningslänk. Kontrollera inkorgen och skräpposten. Länken gäller i 15 minuter." });
  } catch (error) {
    console.error("Login link request failed:", error.name);
    return res.status(500).json({ message: "Inloggningslänken kunde inte begäras. Försök igen senare." });
  }
};

exports.consumeLink = async (req, res) => {
  const { token } = req.body;
  res.set("Cache-Control", "no-store");
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return res.status(400).json({ message: invalidMessage });
  try {
    const result = await sequelize.transaction(async transaction => {
      const record = await LoginLink.findByPk(hash(token), { transaction, lock: transaction.LOCK.UPDATE });
      if (!record || record.usedAt || record.expiresAt <= new Date()) return null;
      const user = await User.findByPk(record.userId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!user || !user.isActive || user.role !== "user" || user.email.toLowerCase() !== record.email) return null;
      await record.update({ usedAt: new Date() }, { transaction });
      await user.update({ emailVerified: true, lastLoginAt: new Date() }, { transaction });
      const { id, firstName, lastName, email, role, isPremium } = user;
      return { token: generateToken(id), user: { id, firstName, lastName, email, role, isPremium } };
    });
    if (!result) return res.status(401).json({ message: invalidMessage });
    return res.json(result);
  } catch (error) {
    console.error("Login link verification failed:", error.name);
    return res.status(500).json({ message: "Inloggningen misslyckades. Försök igen." });
  }
};
