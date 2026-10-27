const {
  buildPremiumTrainingSession,
} = require("../services/premiumTrainingService");

/* -------------------------------- */
/* Get Premium training session     */
/* -------------------------------- */

// GET /api/premium-training
const getPremiumTrainingSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Den här träningen kräver Premium.",
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

    const session = await buildPremiumTrainingSession({
      limit,
      translationLanguage,
    });

    return res.status(200).json(session);
  } catch (error) {
    console.error("Get Premium training session error:", error);

    return res.status(500).json({
      message: "Premiumträningen kunde inte startas.",
    });
  }
};

module.exports = {
  getPremiumTrainingSession,
};
