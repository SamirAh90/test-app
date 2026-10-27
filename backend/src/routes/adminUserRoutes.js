const express = require("express");

const {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  activateAdminUser,
  deleteAdminUser,
} = require("../controllers/adminUserController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect all user admin routes     */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* User routes                       */
/* -------------------------------- */

router.get("/", getAdminUsers);

router.post("/", createAdminUser);

router.get("/:userId", getAdminUser);

router.put("/:userId", updateAdminUser);

router.patch("/:userId/deactivate", deactivateAdminUser);

router.patch("/:userId/activate", activateAdminUser);

router.delete("/:userId", deleteAdminUser);

module.exports = router;
