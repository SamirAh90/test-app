const { Op } = require("sequelize");

const AppSetting = require("../models/AppSetting");

/* -------------------------------- */
/* Default payment settings         */
/* -------------------------------- */

const DEFAULT_PAYMENT_SETTINGS = {
  premium_price: {
    value: "49900",
    valueType: "number",
    description: "Premium price stored in öre.",
  },

  payment_card_enabled: {
    value: "true",
    valueType: "boolean",
    description: "Controls whether card payments are enabled.",
  },

  payment_swish_enabled: {
    value: "true",
    valueType: "boolean",
    description: "Controls whether Swish payments are enabled.",
  },

  payment_klarna_enabled: {
    value: "true",
    valueType: "boolean",
    description: "Controls whether Klarna payments are enabled.",
  },
};

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const ensureDefaultPaymentSettings = async () => {
  await Promise.all(
    Object.entries(DEFAULT_PAYMENT_SETTINGS).map(async ([key, setting]) => {
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

  return setting?.value ?? DEFAULT_PAYMENT_SETTINGS[key]?.value ?? null;
};

const parseBooleanSetting = (value) => value === "true";

const parseNumberSetting = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const buildPaymentSettingsResponse = (settings) => ({
  premiumPrice: parseNumberSetting(getSettingValue(settings, "premium_price")),

  paymentMethods: {
    card: parseBooleanSetting(
      getSettingValue(settings, "payment_card_enabled"),
    ),

    swish: parseBooleanSetting(
      getSettingValue(settings, "payment_swish_enabled"),
    ),

    klarna: parseBooleanSetting(
      getSettingValue(settings, "payment_klarna_enabled"),
    ),
  },
});

/* -------------------------------- */
/* Admin: Get payment settings      */
/* -------------------------------- */

const getAdminPaymentSettings = async (req, res) => {
  try {
    await ensureDefaultPaymentSettings();

    const settings = await AppSetting.findAll({
      where: {
        key: {
          [Op.in]: Object.keys(DEFAULT_PAYMENT_SETTINGS),
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

    return res.status(200).json({
      settings: buildPaymentSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Admin get payment settings error:", error);

    return res.status(500).json({
      message: "Betalningsinställningarna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Admin: Update payment settings   */
/* -------------------------------- */

const updateAdminPaymentSettings = async (req, res) => {
  try {
    const { premiumPrice, paymentMethods } = req.body;

    const normalizedPremiumPrice = Number(premiumPrice);

    if (
      !Number.isInteger(normalizedPremiumPrice) ||
      normalizedPremiumPrice <= 0
    ) {
      return res.status(400).json({
        message: "Premiumpriset måste vara ett positivt heltal i öre.",
      });
    }

    if (
      !paymentMethods ||
      typeof paymentMethods.card !== "boolean" ||
      typeof paymentMethods.swish !== "boolean" ||
      typeof paymentMethods.klarna !== "boolean"
    ) {
      return res.status(400).json({
        message: "Betalsätten är ogiltiga.",
      });
    }

    const enabledPaymentMethods = [
      paymentMethods.card,
      paymentMethods.swish,
      paymentMethods.klarna,
    ].filter(Boolean);

    if (enabledPaymentMethods.length === 0) {
      return res.status(400).json({
        message: "Minst ett betalsätt måste vara aktiverat.",
      });
    }

    await ensureDefaultPaymentSettings();

    await Promise.all([
      AppSetting.update(
        {
          value: String(normalizedPremiumPrice),
        },
        {
          where: {
            key: "premium_price",
          },
        },
      ),

      AppSetting.update(
        {
          value: String(paymentMethods.card),
        },
        {
          where: {
            key: "payment_card_enabled",
          },
        },
      ),

      AppSetting.update(
        {
          value: String(paymentMethods.swish),
        },
        {
          where: {
            key: "payment_swish_enabled",
          },
        },
      ),

      AppSetting.update(
        {
          value: String(paymentMethods.klarna),
        },
        {
          where: {
            key: "payment_klarna_enabled",
          },
        },
      ),
    ]);

    return res.status(200).json({
      message: "Betalningsinställningarna sparades.",

      settings: {
        premiumPrice: normalizedPremiumPrice,

        paymentMethods: {
          card: paymentMethods.card,
          swish: paymentMethods.swish,
          klarna: paymentMethods.klarna,
        },
      },
    });
  } catch (error) {
    console.error("Admin update payment settings error:", error);

    return res.status(500).json({
      message: "Betalningsinställningarna kunde inte sparas.",
    });
  }
};

/* -------------------------------- */
/* Public: Get payment settings     */
/* -------------------------------- */

const getPublicPaymentSettings = async (req, res) => {
  try {
    await ensureDefaultPaymentSettings();

    const settings = await AppSetting.findAll({
      where: {
        key: {
          [Op.in]: Object.keys(DEFAULT_PAYMENT_SETTINGS),
        },
      },

      attributes: ["key", "value"],
    });

    return res.status(200).json(buildPaymentSettingsResponse(settings));
  } catch (error) {
    console.error("Public get payment settings error:", error);

    return res.status(500).json({
      message: "Betalningsinformationen kunde inte hämtas.",
    });
  }
};

module.exports = {
  getAdminPaymentSettings,
  updateAdminPaymentSettings,
  getPublicPaymentSettings,
};
