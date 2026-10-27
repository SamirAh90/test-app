const { buildSimulatorSession } = require("../services/simulatorService");

/* -------------------------------- */
/* Get simulator session            */
/* -------------------------------- */

// GET /api/simulator
const getSimulatorSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Provsimulatorn kräver Premium.",
      });
    }

    /* -------------------------------- */
    /* Request options                  */
    /* -------------------------------- */

    const translationLanguage = req.query.language || null;

    /* -------------------------------- */
    /* Build simulator session          */
    /* -------------------------------- */

    const session = await buildSimulatorSession(req.user.id, {
      translationLanguage,
    });

    return res.status(200).json(session);
  } catch (error) {
    console.error("Get simulator session error:", error);

    return res.status(500).json({
      message: "Provsimulatorn kunde inte startas.",
    });
  }
};

module.exports = {
  getSimulatorSession,
};
