const { Op } = require("sequelize");

const { sequelize } = require("../config/database");

const AppSetting = require("../models/AppSetting");
const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");
const Subject = require("../models/Subject");
const Question = require("../models/Question");
const AnalyticsEvent = require("../models/AnalyticsEvent");

/* -------------------------------- */
/* Constants                        */
/* -------------------------------- */

const BACKEND_VERSION = "1.0.0";

const RETENTION_OPTIONS = ["never", "1_year", "2_years"];

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly"];

const DEFAULT_SETTINGS = {
  user_cleanup_retention: {
    value: "never",
    valueType: "string",
    description:
      "Controls how long inactive users remain before they become eligible for deletion.",
  },

  user_cleanup_frequency: {
    value: "daily",
    valueType: "string",
    description: "Controls how often the automatic user cleanup should run.",
  },

  user_cleanup_last_run: {
    value: null,
    valueType: "string",
    description: "Stores the date and time of the most recent user cleanup.",
  },
};

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const ensureDefaultSettings = async () => {
  await Promise.all(
    Object.entries(DEFAULT_SETTINGS).map(async ([key, setting]) => {
      await AppSetting.findOrCreate({
        where: {
          key,
        },

        defaults: {
          key,
          value: setting.value,
          valueType: setting.valueType,
          description: setting.description,
        },
      });
    }),
  );
};

const getSettingValue = (settings, key) => {
  const setting = settings.find((item) => item.key === key);

  return setting?.value ?? DEFAULT_SETTINGS[key]?.value ?? null;
};

const getRetentionCutoffDate = (retention) => {
  const cutoffDate = new Date();

  if (retention === "1_year") {
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

    return cutoffDate;
  }

  if (retention === "2_years") {
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);

    return cutoffDate;
  }

  return null;
};

const getCleanupCandidates = async (retention, transaction = null) => {
  const cutoffDate = getRetentionCutoffDate(retention);

  if (!cutoffDate) {
    return [];
  }

  return User.findAll({
    where: {
      isActive: false,

      deactivatedAt: {
        [Op.ne]: null,
        [Op.lte]: cutoffDate,
      },

      role: {
        [Op.ne]: "admin",
      },
    },

    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "role",
      "isPremium",
      "deactivatedAt",
      "createdAt",
    ],

    order: [["deactivatedAt", "ASC"]],

    ...(transaction
      ? {
          transaction,
        }
      : {}),
  });
};

const getSystemInformation = async () => {
  const [
    totalSubjects,
    totalQuestions,
    totalUsers,
    totalPremiumUsers,
    totalAnalyticsEvents,
  ] = await Promise.all([
    Subject.count(),

    Question.count(),

    User.count(),

    User.count({
      where: {
        isPremium: true,
      },
    }),

    AnalyticsEvent.count(),
  ]);

  return {
    backendVersion: BACKEND_VERSION,
    database: "MySQL",
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    totalSubjects,
    totalQuestions,
    totalUsers,
    totalPremiumUsers,
    totalAnalyticsEvents,
  };
};

const getSystemHealth = async () => {
  const checkedAt = new Date();

  let databaseStatus = "connected";
  let databaseMessage = "Databasen svarar normalt.";

  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("System health database check error:", error);

    databaseStatus = "error";
    databaseMessage = "Databasen kunde inte nås.";
  }

  let analyticsStatus = "running";
  let analyticsMessage = "Analystabellen är tillgänglig.";

  try {
    await AnalyticsEvent.count();
  } catch (error) {
    console.error("System health analytics check error:", error);

    analyticsStatus = "error";
    analyticsMessage = "Analystjänsten kunde inte kontrolleras.";
  }

  return {
    api: {
      status: "online",
      message: "API-servern körs.",
    },

    database: {
      status: databaseStatus,
      message: databaseMessage,
    },

    analytics: {
      status: analyticsStatus,
      message: analyticsMessage,
    },

    backgroundJobs: {
      status: "not_configured",
      message: "Automatiska bakgrundsjobb är ännu inte aktiverade.",
    },

    uptimeSeconds: Math.floor(process.uptime()),

    checkedAt,
  };
};

/* -------------------------------- */
/* Get settings                     */
/* -------------------------------- */

const getAdminSettings = async (req, res) => {
  try {
    await ensureDefaultSettings();

    const settings = await AppSetting.findAll({
      where: {
        key: {
          [Op.in]: Object.keys(DEFAULT_SETTINGS),
        },
      },

      attributes: [
        "id",
        "key",
        "value",
        "valueType",
        "description",
        "updatedAt",
      ],
    });

    const retention = getSettingValue(settings, "user_cleanup_retention");

    const frequency = getSettingValue(settings, "user_cleanup_frequency");

    const lastRun = getSettingValue(settings, "user_cleanup_last_run");

    const [cleanupCandidates, systemInformation, systemHealth] =
      await Promise.all([
        getCleanupCandidates(retention),
        getSystemInformation(),
        getSystemHealth(),
      ]);

    return res.status(200).json({
      settings: {
        userCleanup: {
          retention,
          frequency,
          lastRun,
          scheduledUserCount: cleanupCandidates.length,
        },

        systemInformation,
        systemHealth,
      },
    });
  } catch (error) {
    console.error("Admin get settings error:", error);

    return res.status(500).json({
      message: "Inställningarna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Update cleanup settings          */
/* -------------------------------- */

const updateUserCleanupSettings = async (req, res) => {
  try {
    const { retention, frequency } = req.body;

    if (!RETENTION_OPTIONS.includes(retention)) {
      return res.status(400).json({
        message: "Den valda lagringstiden är ogiltig.",
      });
    }

    if (!FREQUENCY_OPTIONS.includes(frequency)) {
      return res.status(400).json({
        message: "Den valda rensningsfrekvensen är ogiltig.",
      });
    }

    await ensureDefaultSettings();

    await Promise.all([
      AppSetting.update(
        {
          value: retention,
        },
        {
          where: {
            key: "user_cleanup_retention",
          },
        },
      ),

      AppSetting.update(
        {
          value: frequency,
        },
        {
          where: {
            key: "user_cleanup_frequency",
          },
        },
      ),
    ]);

    const [cleanupCandidates, lastRunSetting, systemInformation, systemHealth] =
      await Promise.all([
        getCleanupCandidates(retention),

        AppSetting.findOne({
          where: {
            key: "user_cleanup_last_run",
          },
          attributes: ["value"],
        }),

        getSystemInformation(),

        getSystemHealth(),
      ]);

    return res.status(200).json({
      message: "Rensningsinställningarna uppdaterades.",

      settings: {
        userCleanup: {
          retention,
          frequency,
          lastRun: lastRunSetting?.value || null,
          scheduledUserCount: cleanupCandidates.length,
        },

        systemInformation,
        systemHealth,
      },
    });
  } catch (error) {
    console.error("Admin update cleanup settings error:", error);

    return res.status(500).json({
      message: "Rensningsinställningarna kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Preview cleanup users            */
/* -------------------------------- */

const previewUserCleanup = async (req, res) => {
  try {
    await ensureDefaultSettings();

    const retentionSetting = await AppSetting.findOne({
      where: {
        key: "user_cleanup_retention",
      },
    });

    const retention =
      retentionSetting?.value || DEFAULT_SETTINGS.user_cleanup_retention.value;

    const users = await getCleanupCandidates(retention);

    return res.status(200).json({
      retention,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin preview cleanup error:", error);

    return res.status(500).json({
      message: "Användarna som är planerade för borttagning kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Run cleanup now                  */
/* -------------------------------- */

const runUserCleanup = async (req, res) => {
  try {
    await ensureDefaultSettings();

    const retentionSetting = await AppSetting.findOne({
      where: {
        key: "user_cleanup_retention",
      },
    });

    const retention =
      retentionSetting?.value || DEFAULT_SETTINGS.user_cleanup_retention.value;

    if (retention === "never") {
      return res.status(400).json({
        message:
          "Rensningen kan inte köras när lagringstiden är inställd på Aldrig.",
      });
    }

    const completedAt = new Date();

    const deletedUsers = await sequelize.transaction(async (transaction) => {
      const users = await getCleanupCandidates(retention, transaction);

      const userIds = users.map((user) => user.id);

      if (userIds.length === 0) {
        await AppSetting.update(
          {
            value: completedAt.toISOString(),
          },
          {
            where: {
              key: "user_cleanup_last_run",
            },
            transaction,
          },
        );

        return 0;
      }

      const attempts = await QuizAttempt.findAll({
        where: {
          userId: {
            [Op.in]: userIds,
          },
        },

        attributes: ["id"],
        transaction,
      });

      const attemptIds = attempts.map((attempt) => attempt.id);

      if (attemptIds.length > 0) {
        await QuizAnswer.destroy({
          where: {
            attemptId: {
              [Op.in]: attemptIds,
            },
          },

          transaction,
        });
      }

      await QuizAttempt.destroy({
        where: {
          userId: {
            [Op.in]: userIds,
          },
        },

        transaction,
      });

      /*
       * Preserve analytics history,
       * but disconnect deleted accounts.
       */
      await AnalyticsEvent.update(
        {
          userId: null,
        },
        {
          where: {
            userId: {
              [Op.in]: userIds,
            },
          },

          transaction,
        },
      );

      await User.destroy({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },

        transaction,
      });

      await AppSetting.update(
        {
          value: completedAt.toISOString(),
        },
        {
          where: {
            key: "user_cleanup_last_run",
          },

          transaction,
        },
      );

      return userIds.length;
    });

    return res.status(200).json({
      message:
        deletedUsers > 0
          ? `${deletedUsers} inaktiva användare togs bort.`
          : "Inga användare var berättigade till borttagning.",

      cleanup: {
        deletedUsers,
        completedAt,
      },
    });
  } catch (error) {
    console.error("Admin run cleanup error:", error);

    return res.status(500).json({
      message: "Användarrensningen kunde inte genomföras.",
    });
  }
};

module.exports = {
  getAdminSettings,
  updateUserCleanupSettings,
  previewUserCleanup,
  runUserCleanup,
};
