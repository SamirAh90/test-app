const { Op } = require("sequelize");

const PremiumCode = require("../models/PremiumCode");

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const validatePremiumCodePayload = ({
  code,
  usageLimit,
  validFrom,
  validUntil,
}) => {
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return {
      error: "Premiumkoden måste anges.",
    };
  }

  let normalizedUsageLimit = null;

  if (usageLimit !== null && usageLimit !== undefined && usageLimit !== "") {
    normalizedUsageLimit = Number(usageLimit);

    if (!Number.isInteger(normalizedUsageLimit) || normalizedUsageLimit <= 0) {
      return {
        error: "Användningsgränsen måste vara ett positivt heltal.",
      };
    }
  }

  const normalizedValidFrom = validFrom ? new Date(validFrom) : null;

  const normalizedValidUntil = validUntil ? new Date(validUntil) : null;

  if (normalizedValidFrom && Number.isNaN(normalizedValidFrom.getTime())) {
    return {
      error: "Startdatumet är ogiltigt.",
    };
  }

  if (normalizedValidUntil && Number.isNaN(normalizedValidUntil.getTime())) {
    return {
      error: "Slutdatumet är ogiltigt.",
    };
  }

  if (
    normalizedValidFrom &&
    normalizedValidUntil &&
    normalizedValidUntil < normalizedValidFrom
  ) {
    return {
      error: "Slutdatumet kan inte vara före startdatumet.",
    };
  }

  return {
    values: {
      code: normalizedCode,
      usageLimit: normalizedUsageLimit,
      validFrom: normalizedValidFrom,
      validUntil: normalizedValidUntil,
    },
  };
};

/* -------------------------------- */
/* Get all premium codes            */
/* -------------------------------- */

const getAdminPremiumCodes = async (req, res) => {
  try {
    const premiumCodes = await PremiumCode.findAll({
      order: [
        ["isActive", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      premiumCodes,
    });
  } catch (error) {
    console.error("Admin get premium codes error:", error);

    return res.status(500).json({
      message: "Premiumkoderna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one premium code             */
/* -------------------------------- */

const getAdminPremiumCode = async (req, res) => {
  try {
    const premiumCode = await PremiumCode.findByPk(req.params.premiumCodeId);

    if (!premiumCode) {
      return res.status(404).json({
        message: "Premiumkoden hittades inte.",
      });
    }

    return res.status(200).json({
      premiumCode,
    });
  } catch (error) {
    console.error("Admin get premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Create premium code              */
/* -------------------------------- */

const createAdminPremiumCode = async (req, res) => {
  try {
    const validation = validatePremiumCodePayload(req.body);

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    const existingPremiumCode = await PremiumCode.findOne({
      where: {
        code: validation.values.code,
      },
    });

    if (existingPremiumCode) {
      return res.status(409).json({
        message: "Det finns redan en premiumkod med denna kod.",
      });
    }

    const premiumCode = await PremiumCode.create({
      ...validation.values,
      usageCount: 0,
      isActive:
        typeof req.body.isActive === "boolean" ? req.body.isActive : true,
    });

    return res.status(201).json({
      message: "Premiumkoden skapades.",
      premiumCode,
    });
  } catch (error) {
    console.error("Admin create premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte skapas.",
    });
  }
};

/* -------------------------------- */
/* Update premium code              */
/* -------------------------------- */

const updateAdminPremiumCode = async (req, res) => {
  try {
    const premiumCode = await PremiumCode.findByPk(req.params.premiumCodeId);

    if (!premiumCode) {
      return res.status(404).json({
        message: "Premiumkoden hittades inte.",
      });
    }

    const validation = validatePremiumCodePayload({
      code: req.body.code !== undefined ? req.body.code : premiumCode.code,

      usageLimit:
        req.body.usageLimit !== undefined
          ? req.body.usageLimit
          : premiumCode.usageLimit,

      validFrom:
        req.body.validFrom !== undefined
          ? req.body.validFrom
          : premiumCode.validFrom,

      validUntil:
        req.body.validUntil !== undefined
          ? req.body.validUntil
          : premiumCode.validUntil,
    });

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    const duplicatePremiumCode = await PremiumCode.findOne({
      where: {
        code: validation.values.code,

        id: {
          [Op.ne]: premiumCode.id,
        },
      },
    });

    if (duplicatePremiumCode) {
      return res.status(409).json({
        message: "Det finns redan en premiumkod med denna kod.",
      });
    }

    if (
      validation.values.usageLimit !== null &&
      validation.values.usageLimit < premiumCode.usageCount
    ) {
      return res.status(400).json({
        message:
          "Användningsgränsen kan inte vara lägre än antal redan använda koder.",
      });
    }

    await premiumCode.update({
      ...validation.values,

      isActive:
        typeof req.body.isActive === "boolean"
          ? req.body.isActive
          : premiumCode.isActive,
    });

    return res.status(200).json({
      message: "Premiumkoden uppdaterades.",
      premiumCode,
    });
  } catch (error) {
    console.error("Admin update premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Delete premium code              */
/* -------------------------------- */

const deleteAdminPremiumCode = async (req, res) => {
  try {
    const premiumCode = await PremiumCode.findByPk(req.params.premiumCodeId);

    if (!premiumCode) {
      return res.status(404).json({
        message: "Premiumkoden hittades inte.",
      });
    }

    if (premiumCode.usageCount > 0) {
      return res.status(400).json({
        message:
          "En premiumkod som redan har använts kan inte tas bort. Inaktivera den i stället.",
      });
    }

    await premiumCode.destroy();

    return res.status(200).json({
      message: "Premiumkoden togs bort.",
    });
  } catch (error) {
    console.error("Admin delete premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminPremiumCodes,
  getAdminPremiumCode,
  createAdminPremiumCode,
  updateAdminPremiumCode,
  deleteAdminPremiumCode,
};
