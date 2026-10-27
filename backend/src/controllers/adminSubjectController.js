const Subject = require("../models/Subject");
const Question = require("../models/Question");
const SubjectMaterial = require("../models/SubjectMaterial");
const SubjectGlossary = require("../models/SubjectGlossary");
const SubjectSource = require("../models/SubjectSource");

const getAdminSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt",
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      subjects,
    });
  } catch (error) {
    console.error("Admin get subjects error:", error);

    return res.status(500).json({
      message: "Ämnena kunde inte hämtas.",
    });
  }
};

const getAdminSubjectById = async (req, res) => {
  try {
    const subjectId = Number(req.params.subjectId);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const subject = await Subject.findByPk(subjectId, {
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    return res.status(200).json({
      subject,
    });
  } catch (error) {
    console.error("Admin get subject error:", error);

    return res.status(500).json({
      message: "Ämnet kunde inte hämtas.",
    });
  }
};

const updateAdminSubject = async (req, res) => {
  try {
    const subjectId = Number(req.params.subjectId);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const { name, slug, description } = req.body;

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({
        message: "Namn och slug måste fyllas i.",
      });
    }

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const subjectWithSameName = await Subject.findOne({
      where: {
        name: normalizedName,
      },
    });

    if (subjectWithSameName && subjectWithSameName.id !== subject.id) {
      return res.status(409).json({
        message: "Det finns redan ett ämne med detta namn.",
      });
    }

    const subjectWithSameSlug = await Subject.findOne({
      where: {
        slug: normalizedSlug,
      },
    });

    if (subjectWithSameSlug && subjectWithSameSlug.id !== subject.id) {
      return res.status(409).json({
        message: "Det finns redan ett ämne med denna slug.",
      });
    }

    subject.name = normalizedName;
    subject.slug = normalizedSlug;
    subject.description = description?.trim() || null;

    await subject.save();

    return res.status(200).json({
      message: "Ämnet uppdaterades.",
      subject: {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin update subject error:", error);

    return res.status(500).json({
      message: "Ämnet kunde inte uppdateras.",
    });
  }
};
const createAdminSubject = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({
        message: "Namn och slug måste fyllas i.",
      });
    }

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const validSlugPattern = /^[a-z0-9-]+$/;

    if (!validSlugPattern.test(normalizedSlug)) {
      return res.status(400).json({
        message:
          "Slug får endast innehålla små bokstäver, siffror och bindestreck.",
      });
    }

    const subjectWithSameName = await Subject.findOne({
      where: {
        name: normalizedName,
      },
    });

    if (subjectWithSameName) {
      return res.status(409).json({
        message: "Det finns redan ett ämne med detta namn.",
      });
    }

    const subjectWithSameSlug = await Subject.findOne({
      where: {
        slug: normalizedSlug,
      },
    });

    if (subjectWithSameSlug) {
      return res.status(409).json({
        message: "Det finns redan ett ämne med denna slug.",
      });
    }

    const subject = await Subject.create({
      name: normalizedName,
      slug: normalizedSlug,
      description: description?.trim() || null,
    });

    return res.status(201).json({
      message: "Ämnet skapades.",
      subject,
    });
  } catch (error) {
    console.error("Admin create subject error:", error);

    return res.status(500).json({
      message: "Ämnet kunde inte skapas.",
    });
  }
};

const deleteAdminSubject = async (req, res) => {
  try {
    const subjectId = Number(req.params.subjectId);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    const [questionCount, materialCount, glossaryCount, sourceCount] =
      await Promise.all([
        Question.count({
          where: {
            subjectId,
          },
        }),

        SubjectMaterial.count({
          where: {
            subjectId,
          },
        }),

        SubjectGlossary.count({
          where: {
            subjectId,
          },
        }),

        SubjectSource.count({
          where: {
            subjectId,
          },
        }),
      ]);

    const hasConnectedContent =
      questionCount > 0 ||
      materialCount > 0 ||
      glossaryCount > 0 ||
      sourceCount > 0;

    if (hasConnectedContent) {
      return res.status(409).json({
        message:
          "Ämnet kan inte tas bort eftersom det innehåller kopplat innehåll.",
        connectedContent: {
          questions: questionCount,
          studyMaterials: materialCount,
          glossaryTerms: glossaryCount,
          sources: sourceCount,
        },
      });
    }

    await subject.destroy();

    return res.status(200).json({
      message: "Ämnet togs bort.",
    });
  } catch (error) {
    console.error("Admin delete subject error:", error);

    return res.status(500).json({
      message: "Ämnet kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminSubjects,
  getAdminSubjectById,
  createAdminSubject,
  updateAdminSubject,
  deleteAdminSubject,
};
