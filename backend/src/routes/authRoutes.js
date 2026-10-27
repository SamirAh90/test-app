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

/* -------------------------------- */
/* Authenticated account            */
/* -------------------------------- */

router.get("/me", authMiddleware, getCurrentUser);

router.put("/profile", authMiddleware, updateProfile);

router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;
