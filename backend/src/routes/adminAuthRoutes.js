const express = require("express");

const {
  adminLogin,
  getCurrentAdmin,
} = require("../controllers/adminAuthController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.post("/login", adminLogin);

router.get("/me", authMiddleware, requireEditor, getCurrentAdmin);

module.exports = router;
