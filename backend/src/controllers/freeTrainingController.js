const {
  buildFreeTrainingSession,
  getFreeTrainingStatus,
} = require("../services/freeTrainingService");

/* -------------------------------- */
/* Get Free Training session        */
/* -------------------------------- */

// GET /api/free-training
const getFreeTrainingSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    /*
      Premium users should use the full
      Premium question bank instead.
    */

    if (req.user.isPremium) {
      return res.status(403).json({
        message: "Ditt konto har Premium. Använd Premiumträningen i stället.",
      });
    }

    /* -------------------------------- */
    /* Request options                  */
    /* -------------------------------- */

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const translationLanguage = req.query.language || null;

    /* -------------------------------- */
    /* Build session                    */
    /* -------------------------------- */

    const session = await buildFreeTrainingSession(req.user.id, {
      limit,
      translationLanguage,
    });

    return res.status(200).json(session);
  } catch (error) {
    console.error("Get Free Training session error:", error);

    return res.status(500).json({
      message: "Den kostnadsfria träningen kunde inte startas.",
    });
  }
};

/* -------------------------------- */
/* Get Free Training status         */
/* -------------------------------- */

// GET /api/free-training/status
const getFreeTrainingStatusController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    const status = await getFreeTrainingStatus(req.user.id);

    return res.status(200).json(status);
  } catch (error) {
    console.error("Get Free Training status error:", error);

    return res.status(500).json({
      message: "Status för gratis träning kunde inte hämtas.",
    });
  }
};

module.exports = {
  getFreeTrainingSession,
  getFreeTrainingStatusController,
};
