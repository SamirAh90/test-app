const express = require("express");

const {
  getAdminMaterials,
  getAdminMaterialBySubject,
  saveAdminMaterial,
  deleteAdminMaterial,
} = require("../controllers/adminMaterialController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireEditor = require("../middlewares/requireEditor");

const router = express.Router();

router.use(authMiddleware);
router.use(requireEditor);

router.get("/", getAdminMaterials);

router.get("/:subjectId", getAdminMaterialBySubject);

router.put("/:subjectId", saveAdminMaterial);

router.delete("/:subjectId", deleteAdminMaterial);

module.exports = router;
