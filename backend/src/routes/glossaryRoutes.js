const express = require("express");

const Subject = require("../models/Subject");
const SubjectGlossary = require("../models/SubjectGlossary");

const router = express.Router();

// GET all glossary terms grouped by subject
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: ["id", "name", "slug"],
      include: [
        {
          model: SubjectGlossary,
          attributes: ["id", "word", "definition", "displayOrder"],
          required: false,
        },
      ],
      order: [
        ["id", "ASC"],
        [SubjectGlossary, "displayOrder", "ASC"],
        [SubjectGlossary, "id", "ASC"],
      ],
    });

    const result = subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      words: Array.isArray(subject.SubjectGlossaries)
        ? subject.SubjectGlossaries
        : [],
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching glossary:", error);

    res.status(500).json({
      message: "Kunde inte hämta begreppen.",
    });
  }
});

module.exports = router;
