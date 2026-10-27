const express = require("express");

const { getAdminDashboard } = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.get("/dashboard", authMiddleware, requireEditor, getAdminDashboard);

module.exports = router;
