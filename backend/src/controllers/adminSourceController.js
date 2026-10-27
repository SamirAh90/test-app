const Subject = require("../models/Subject");
const SubjectSource = require("../models/SubjectSource");

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const isValidHttpUrl = (value) => {
  try {
    const parsedUrl = new URL(value);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeSourceData = (body = {}) => {
  const subjectId = Number(body.subjectId);
  const title = body.title?.trim();
  const url = body.url?.trim();
  const displayOrder = Number(body.displayOrder);

  return {
    subjectId,
    title,
    url,
    displayOrder,
  };
};

/* -------------------------------- */
/* Get all sources                  */
/* -------------------------------- */

const getAdminSources = async (req, res) => {
  try {
    const requestedSubjectId = req.query.subjectId
      ? Number(req.query.subjectId)
      : null;

    if (
      requestedSubjectId !== null &&
      (!Number.isInteger(requestedSubjectId) || requestedSubjectId <= 0)
    ) {
      return res.status(400).json({
        message: "Ämnets id är ogiltigt.",
      });
    }

    const where = requestedSubjectId
      ? {
          subjectId: requestedSubjectId,
        }
      : {};

    const sources = await SubjectSource.findAll({
      attributes: [
        "id",
        "subjectId",
        "title",
        "url",
        "displayOrder",
        "createdAt",
        "updatedAt",
      ],
      where,
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
          required: true,
        },
      ],
      order: [
        ["subjectId", "ASC"],
        ["displayOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.status(200).json({
      sources,
    });
  } catch (error) {
    console.error("Admin get sources error:", error);

    return res.status(500).json({
      message: "Källorna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one source                   */
/* -------------------------------- */

const getAdminSource = async (req, res) => {
  try {
    const sourceId = Number(req.params.sourceId);

    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return res.status(400).json({
        message: "Källans id är ogiltigt.",
      });
    }

    const source = await SubjectSource.findByPk(sourceId, {
      attributes: [
        "id",
        "subjectId",
        "title",
        "url",
        "displayOrder",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "slug"],
          required: true,
        },
      ],
    });

    if (!source) {
      return res.status(404).json({
        message: "Källan kunde inte hittas.",
      });
    }

    return res.status(200).json({
      source,
    });
  } catch (error) {
    console.error("Admin get source error:", error);

    return res.status(500).json({
      message: "Källan kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Create source                    */
/* -------------------------------- */

const createAdminSource = async (req, res) => {
  try {
    const { subjectId, title, url, displayOrder } = normalizeSourceData(
      req.body,
    );

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Välj ett giltigt ämne.",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Källans titel måste fyllas i.",
      });
    }

    if (!url || !isValidHttpUrl(url)) {
      return res.status(400).json({
        message: "Ange en giltig webbadress som börjar med http eller https.",
      });
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
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

    const createdSource = await SubjectSource.create({
      subjectId,
      title,
      url,
      displayOrder,
    });

    const source = await SubjectSource.findByPk(createdSource.id, {
      attributes: [
        "id",
        "subjectId",
        "title",
        "url",
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

    return res.status(201).json({
      message: "Källan skapades.",
      source,
    });
  } catch (error) {
    console.error("Admin create source error:", error);

    return res.status(500).json({
      message: "Källan kunde inte skapas.",
    });
  }
};

/* -------------------------------- */
/* Update source                    */
/* -------------------------------- */

const updateAdminSource = async (req, res) => {
  try {
    const sourceId = Number(req.params.sourceId);

    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return res.status(400).json({
        message: "Källans id är ogiltigt.",
      });
    }

    const { subjectId, title, url, displayOrder } = normalizeSourceData(
      req.body,
    );

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        message: "Välj ett giltigt ämne.",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Källans titel måste fyllas i.",
      });
    }

    if (!url || !isValidHttpUrl(url)) {
      return res.status(400).json({
        message: "Ange en giltig webbadress som börjar med http eller https.",
      });
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      return res.status(400).json({
        message: "Visningsordningen måste vara ett heltal från 0.",
      });
    }

    const [source, subject] = await Promise.all([
      SubjectSource.findByPk(sourceId),
      Subject.findByPk(subjectId),
    ]);

    if (!source) {
      return res.status(404).json({
        message: "Källan kunde inte hittas.",
      });
    }

    if (!subject) {
      return res.status(404).json({
        message: "Ämnet kunde inte hittas.",
      });
    }

    source.subjectId = subjectId;
    source.title = title;
    source.url = url;
    source.displayOrder = displayOrder;

    await source.save();

    const updatedSource = await SubjectSource.findByPk(source.id, {
      attributes: [
        "id",
        "subjectId",
        "title",
        "url",
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

    return res.status(200).json({
      message: "Källan uppdaterades.",
      source: updatedSource,
    });
  } catch (error) {
    console.error("Admin update source error:", error);

    return res.status(500).json({
      message: "Källan kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Delete source                    */
/* -------------------------------- */

const deleteAdminSource = async (req, res) => {
  try {
    const sourceId = Number(req.params.sourceId);

    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return res.status(400).json({
        message: "Källans id är ogiltigt.",
      });
    }

    const source = await SubjectSource.findByPk(sourceId);

    if (!source) {
      return res.status(404).json({
        message: "Källan kunde inte hittas.",
      });
    }

    await source.destroy();

    return res.status(200).json({
      message: "Källan togs bort.",
    });
  } catch (error) {
    console.error("Admin delete source error:", error);

    return res.status(500).json({
      message: "Källan kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminSources,
  getAdminSource,
  createAdminSource,
  updateAdminSource,
  deleteAdminSource,
};
