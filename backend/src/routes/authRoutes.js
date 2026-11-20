const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* -------------------------------- */
/* Public authentication            */
/* -------------------------------- */

router.post("/register", register);

router.post("/login", login);
router.post("/google", require("../controllers/googleAuthController").googleLogin);
const loginLink = require("../controllers/loginLinkController");
const loginLinkLimit = require("../middlewares/loginLinkLimit");
router.post("/email-link", loginLinkLimit, loginLink.requestLink);
router.post("/email-link/verify", loginLinkLimit, loginLink.consumeLink);

/* -------------------------------- */
/* Authenticated account            */
/* -------------------------------- */

router.get("/me", authMiddleware, getCurrentUser);

router.put("/profile", authMiddleware, updateProfile);

router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;
