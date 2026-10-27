const express = require("express");
const Subject = require("../models/Subject");

const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [["id", "ASC"]],
    });

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);

    res.status(500).json({
      message: "Kunde inte hämta ämnen",
    });
  }
});

module.exports = router;
