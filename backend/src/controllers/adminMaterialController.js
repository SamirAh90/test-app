const Subject = require("../models/Subject");
const SubjectMaterial = require("../models/SubjectMaterial");

/* -------------------------------- */
/* Get all study materials          */
/* -------------------------------- */

const getAdminMaterials = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: ["id", "name", "slug", "description"],
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
      ],
      order: [["id", "ASC"]],
    });

    const materials = subjects.map((subject) => ({
      subject: {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      },

      material: subject.SubjectMaterial || null,

      hasMaterial: Boolean(subject.SubjectMaterial),
    }));

    return res.status(200).json({
      materials,
    });
  } catch (error) {
    console.error("Admin get study materials error:", error);

    return res.status(500).json({
      message: "Studiematerialet kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one study material           */
/* -------------------------------- */

const getAdminMaterialBySubject = async (req, res) => {
  try {
    const subjectId = Number(req.params.subjectId);

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const subject = await Subject.findByPk(subjectId, {
      attributes: ["id", "name", "slug", "description"],
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
      ],
    });

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    return res.status(200).json({
      subject: {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
      },

      material: subject.SubjectMaterial || null,
    });
  } catch (error) {
    console.error("Admin get study material error:", error);

    return res.status(500).json({
      message: "Studiematerialet kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Create / Update study material   */
/* -------------------------------- */

const saveAdminMaterial = async (req, res) => {
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

    const { title, introduction, body } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Rubriken måste fyllas i.",
      });
    }

    if (!body?.trim()) {
      return res.status(400).json({
        message: "Studiematerialets innehåll måste fyllas i.",
      });
    }

    const normalizedMaterial = {
      title: title.trim(),
      introduction: introduction?.trim() || null,
      body: body.trim(),
    };

    let material = await SubjectMaterial.findOne({
      where: {
        subjectId,
      },
    });

    let created = false;

    if (material) {
      material.title = normalizedMaterial.title;
      material.introduction = normalizedMaterial.introduction;
      material.body = normalizedMaterial.body;

      await material.save();
    } else {
      material = await SubjectMaterial.create({
        subjectId,
        ...normalizedMaterial,
      });

      created = true;
    }

    return res.status(created ? 201 : 200).json({
      message: created
        ? "Studiematerialet skapades."
        : "Studiematerialet uppdaterades.",

      material: {
        id: material.id,
        subjectId: material.subjectId,
        title: material.title,
        introduction: material.introduction,
        body: material.body,
        createdAt: material.createdAt,
        updatedAt: material.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin save study material error:", error);

    return res.status(500).json({
      message: "Studiematerialet kunde inte sparas.",
    });
  }
};

/* -------------------------------- */
/* Delete study material            */
/* -------------------------------- */

const deleteAdminMaterial = async (req, res) => {
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

    const material = await SubjectMaterial.findOne({
      where: {
        subjectId,
      },
    });

    if (!material) {
      return res.status(404).json({
        message: "Det finns inget studiematerial att ta bort.",
      });
    }

    await material.destroy();

    return res.status(200).json({
      message: "Studiematerialet togs bort.",
    });
  } catch (error) {
    console.error("Admin delete study material error:", error);

    return res.status(500).json({
      message: "Studiematerialet kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminMaterials,
  getAdminMaterialBySubject,
  saveAdminMaterial,
  deleteAdminMaterial,
};
