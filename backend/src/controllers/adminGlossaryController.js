const Subject = require("../models/Subject");
const SubjectGlossary = require("../models/SubjectGlossary");

const getAdminGlossary = async (req, res) => {
  try {
    const subjectId = Number(req.query.subjectId);

    const where = {};

    if (req.query.subjectId) {
      if (!Number.isInteger(subjectId) || subjectId <= 0) {
        return res.status(400).json({
          message: "Ämnets id är ogiltigt.",
        });
      }

      where.subjectId = subjectId;
    }

    const terms = await SubjectGlossary.findAll({
      where,
      attributes: [
        "id",
        "subjectId",
        "word",
        "definition",
        "displayOrder",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [
        ["subjectId", "ASC"],
        ["displayOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.status(200).json({
      terms,
    });
  } catch (error) {
    console.error("Admin get glossary error:", error);

    return res.status(500).json({
      message: "Begreppen kunde inte hämtas.",
    });
  }
};

const getAdminGlossaryTerm = async (req, res) => {
  try {
    const termId = Number(req.params.termId);

    if (!Number.isInteger(termId) || termId <= 0) {
      return res.status(400).json({
        message: "Begreppets id är ogiltigt.",
      });
    }

    const term = await SubjectGlossary.findByPk(termId, {
      attributes: [
        "id",
        "subjectId",
        "word",
        "definition",
        "displayOrder",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!term) {
      return res.status(404).json({
        message: "Begreppet kunde inte hittas.",
      });
    }

    return res.status(200).json({
      term,
    });
  } catch (error) {
    console.error("Admin get glossary term error:", error);

    return res.status(500).json({
      message: "Begreppet kunde inte hämtas.",
    });
  }
};

const createAdminGlossaryTerm = async (req, res) => {
  try {
    const subjectId = Number(req.body.subjectId);
    const { word, definition, displayOrder = 0 } = req.body;

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    if (!word?.trim() || !definition?.trim()) {
      return res.status(400).json({
        message: "Begrepp och förklaring måste fyllas i.",
      });
    }

    const normalizedDisplayOrder = Number(displayOrder);

    if (
      !Number.isInteger(normalizedDisplayOrder) ||
      normalizedDisplayOrder < 0
    ) {
      return res.status(400).json({
        message: "Visningsordningen måste vara ett heltal från 0.",
      });
    }

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const existingTerm = await SubjectGlossary.findOne({
      where: {
        subjectId,
        word: word.trim(),
      },
    });

    if (existingTerm) {
      return res.status(409).json({
        message: "Begreppet finns redan i detta ämne.",
      });
    }

    const term = await SubjectGlossary.create({
      subjectId,
      word: word.trim(),
      definition: definition.trim(),
      displayOrder: normalizedDisplayOrder,
    });

    const createdTerm = await SubjectGlossary.findByPk(term.id, {
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    return res.status(201).json({
      message: "Begreppet skapades.",
      term: createdTerm,
    });
  } catch (error) {
    console.error("Admin create glossary term error:", error);

    return res.status(500).json({
      message: "Begreppet kunde inte skapas.",
    });
  }
};

const updateAdminGlossaryTerm = async (req, res) => {
  try {
    const termId = Number(req.params.termId);
    const subjectId = Number(req.body.subjectId);

    const { word, definition, displayOrder = 0 } = req.body;

    if (!Number.isInteger(termId) || termId <= 0) {
      return res.status(400).json({
        message: "Begreppets id är ogiltigt.",
      });
    }

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    if (!word?.trim() || !definition?.trim()) {
      return res.status(400).json({
        message: "Begrepp och förklaring måste fyllas i.",
      });
    }

    const normalizedDisplayOrder = Number(displayOrder);

    if (
      !Number.isInteger(normalizedDisplayOrder) ||
      normalizedDisplayOrder < 0
    ) {
      return res.status(400).json({
        message: "Visningsordningen måste vara ett heltal från 0.",
      });
    }

    const term = await SubjectGlossary.findByPk(termId);

    if (!term) {
      return res.status(404).json({
        message: "Begreppet kunde inte hittas.",
      });
    }

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const duplicateTerm = await SubjectGlossary.findOne({
      where: {
        subjectId,
        word: word.trim(),
      },
    });

    if (duplicateTerm && duplicateTerm.id !== term.id) {
      return res.status(409).json({
        message: "Begreppet finns redan i detta ämne.",
      });
    }

    term.subjectId = subjectId;
    term.word = word.trim();
    term.definition = definition.trim();
    term.displayOrder = normalizedDisplayOrder;

    await term.save();

    const updatedTerm = await SubjectGlossary.findByPk(term.id, {
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    return res.status(200).json({
      message: "Begreppet uppdaterades.",
      term: updatedTerm,
    });
  } catch (error) {
    console.error("Admin update glossary term error:", error);

    return res.status(500).json({
      message: "Begreppet kunde inte uppdateras.",
    });
  }
};

const deleteAdminGlossaryTerm = async (req, res) => {
  try {
    const termId = Number(req.params.termId);

    if (!Number.isInteger(termId) || termId <= 0) {
      return res.status(400).json({
        message: "Begreppets id är ogiltigt.",
      });
    }

    const term = await SubjectGlossary.findByPk(termId);

    if (!term) {
      return res.status(404).json({
        message: "Begreppet kunde inte hittas.",
      });
    }

    await term.destroy();

    return res.status(200).json({
      message: "Begreppet togs bort.",
    });
  } catch (error) {
    console.error("Admin delete glossary term error:", error);

    return res.status(500).json({
      message: "Begreppet kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminGlossary,
  getAdminGlossaryTerm,
  createAdminGlossaryTerm,
  updateAdminGlossaryTerm,
  deleteAdminGlossaryTerm,
};
