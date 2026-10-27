const {
  buildSmartTrainingSession,
} = require("../services/smartTrainingService");

/* -------------------------------- */
/* Get Smart Training session       */
/* -------------------------------- */

// GET /api/smart-training
const getSmartTrainingSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Smart träning kräver Premium.",
      });
    }

    /* -------------------------------- */
    /* Request options                  */
    /* -------------------------------- */

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const translationLanguage = req.query.language || null;

    /* -------------------------------- */
    /* Build Smart Training session     */
    /* -------------------------------- */

    const session = await buildSmartTrainingSession(req.user.id, {
      limit,
      translationLanguage,
    });

    return res.status(200).json(session);
  } catch (error) {
    console.error("Get Smart Training session error:", error);

    return res.status(500).json({
      message: "Smart träning kunde inte startas.",
    });
  }
};

module.exports = {
  getSmartTrainingSession,
};
