const AnalyticsEvent = require("../models/AnalyticsEvent");

const ALLOWED_EVENTS = [
  /* -------------------------------- */
  /* Landing page                     */
  /* -------------------------------- */

  "landing_view",
  "landing_hero_seen",
  "landing_stats_seen",
  "landing_subjects_seen",
  "landing_how_it_works_seen",
  "landing_demo_question_seen",
  "landing_features_seen",
  "landing_faq_seen",
  "landing_cta_seen",
  "landing_disclaimer_seen",

  /* -------------------------------- */
  /* Hero                             */
  /* -------------------------------- */

  "hero_start_training_clicked",
  "hero_study_material_clicked",

  /* -------------------------------- */
  /* Navigation                       */
  /* -------------------------------- */

  "navbar_logo_clicked",
  "navbar_home_clicked",
  "navbar_study_material_clicked",
  "navbar_glossary_clicked",
  "navbar_trainer_clicked",
  "navbar_about_clicked",
  "navbar_login_clicked",

  /* -------------------------------- */
  /* Language                         */
  /* -------------------------------- */

  "language_changed",
  "trainer_explanation_language_changed",

  /* -------------------------------- */
  /* Trainer                          */
  /* -------------------------------- */

  "trainer_page_viewed",
  "trainer_demo_selected",
  "trainer_register_selected",
  "trainer_my_training_selected",
  "trainer_smart_training_selected",
  "trainer_simulator_selected",
  "trainer_premium_clicked",
  "trainer_header_home_clicked",
  "trainer_header_login_clicked",

  /* -------------------------------- */
  /* Learning                         */
  /* -------------------------------- */

  "trainer_started",
  "question_answered",
  "free_test_completed",
  "results_viewed",

  /* -------------------------------- */
  /* Registration                     */
  /* -------------------------------- */

  "registration_started",
  "account_created",

  /* -------------------------------- */
  /* Premium                          */
  /* -------------------------------- */

  "premium_viewed",
  "checkout_started",
  "payment_completed",
];

const trackAnalyticsEvent = async (req, res) => {
  try {
    const { sessionId, eventName, pagePath = null, metadata = null } = req.body;

    if (!sessionId?.trim()) {
      return res.status(400).json({
        message: "Session-ID saknas.",
      });
    }

    if (!ALLOWED_EVENTS.includes(eventName)) {
      return res.status(400).json({
        message: "Analysaktiviteten är ogiltig.",
      });
    }

    if (
      metadata !== null &&
      (typeof metadata !== "object" || Array.isArray(metadata))
    ) {
      return res.status(400).json({
        message: "Metadata måste vara ett objekt.",
      });
    }

    const event = await AnalyticsEvent.create({
      userId: req.user?.id || null,
      sessionId: sessionId.trim(),
      eventName,
      pagePath: pagePath?.trim() || null,
      metadata,
    });

    return res.status(201).json({
      message: "Analysaktiviteten sparades.",
      event: {
        id: event.id,
        eventName: event.eventName,
        createdAt: event.createdAt,
      },
    });
  } catch (error) {
    console.error("Track analytics event error:", error);

    return res.status(500).json({
      message: "Analysaktiviteten kunde inte sparas.",
    });
  }
};

module.exports = {
  trackAnalyticsEvent,
};
