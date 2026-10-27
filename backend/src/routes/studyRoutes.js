const express = require("express");

const Subject = require("../models/Subject");
const SubjectMaterial = require("../models/SubjectMaterial");
const SubjectGlossary = require("../models/SubjectGlossary");
const SubjectSource = require("../models/SubjectSource");

const router = express.Router();

// GET study material by subject slug or subject ID
router.get("/:subjectIdentifier", async (req, res) => {
  try {
    const { subjectIdentifier } = req.params;

    const subject = await Subject.findOne({
      where: Number.isInteger(Number(subjectIdentifier))
        ? {
            id: Number(subjectIdentifier),
          }
        : {
            slug: subjectIdentifier,
          },
      attributes: ["id", "name", "slug"],
      include: [
        {
          model: SubjectMaterial,
          attributes: [
            "id",
            "title",
            "introduction",
            "body",
            "createdAt",
            "updatedAt",
          ],
          required: false,
        },
        {
          model: SubjectGlossary,
          attributes: ["id", "word", "definition", "displayOrder"],
          required: false,
        },
        {
          model: SubjectSource,
          attributes: ["id", "title", "url", "displayOrder"],
          required: false,
        },
      ],
      order: [
        [SubjectGlossary, "displayOrder", "ASC"],
        [SubjectGlossary, "id", "ASC"],
        [SubjectSource, "displayOrder", "ASC"],
        [SubjectSource, "id", "ASC"],
      ],
    });

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    res.json({
      subject: {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
      },
      material: subject.SubjectMaterial || null,
      glossary: Array.isArray(subject.SubjectGlossaries)
        ? subject.SubjectGlossaries
        : [],
      sources: Array.isArray(subject.SubjectSources)
        ? subject.SubjectSources
        : [],
    });
  } catch (error) {
    console.error("Error fetching study material:", error);

    res.status(500).json({
      message: "Kunde inte hämta studiematerialet.",
    });
  }
});

module.exports = router;
