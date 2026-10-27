const { Op } = require("sequelize");

const AppSetting = require("../models/AppSetting");
const Coupon = require("../models/Coupon");
const PremiumCode = require("../models/PremiumCode");
const { grantPremium } = require("../services/premiumService");

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const getPremiumPrice = async () => {
  const setting = await AppSetting.findOne({
    where: {
      key: "premium_price",
    },
    attributes: ["value"],
  });

  const premiumPrice = Number(setting?.value || 0);

  if (!Number.isInteger(premiumPrice) || premiumPrice <= 0) {
    throw new Error("Premium price is not configured.");
  }

  return premiumPrice;
};

const isCodeWithinValidityPeriod = (item) => {
  const now = new Date();

  if (!item.isActive) {
    return false;
  }

  if (item.validFrom && new Date(item.validFrom) > now) {
    return false;
  }

  if (item.validUntil && new Date(item.validUntil) < now) {
    return false;
  }

  if (
    item.usageLimit !== null &&
    item.usageLimit !== undefined &&
    item.usageCount >= item.usageLimit
  ) {
    return false;
  }

  return true;
};

const calculateDiscount = (coupon, premiumPrice) => {
  if (coupon.discountType === "percentage") {
    const discountAmount = Math.round(
      premiumPrice * (Number(coupon.discountValue) / 100),
    );

    return Math.min(discountAmount, premiumPrice);
  }

  if (coupon.discountType === "fixed") {
    return Math.min(Number(coupon.discountValue), premiumPrice);
  }

  return 0;
};

/* -------------------------------- */
/* Validate coupon                  */
/* -------------------------------- */

// POST /api/payment-codes/coupon/validate
const validateCoupon = async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);

    if (!code) {
      return res.status(400).json({
        message: "Ange en rabattkod.",
      });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: {
          [Op.eq]: code,
        },
      },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Rabattkoden är ogiltig.",
      });
    }

    if (!isCodeWithinValidityPeriod(coupon)) {
      return res.status(400).json({
        message:
          "Rabattkoden är inte aktiv, har gått ut eller har nått sin användningsgräns.",
      });
    }

    const premiumPrice = await getPremiumPrice();

    const discountAmount = calculateDiscount(coupon, premiumPrice);

    const finalPrice = Math.max(premiumPrice - discountAmount, 0);

    return res.status(200).json({
      valid: true,

      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },

      pricing: {
        originalPrice: premiumPrice,
        discountAmount,
        finalPrice,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    return res.status(500).json({
      message: "Rabattkoden kunde inte kontrolleras.",
    });
  }
};

/* -------------------------------- */
/* Validate premium code            */
/* -------------------------------- */

// POST /api/payment-codes/premium/validate
const validatePremiumCode = async (req, res) => {
  try {
    const code = normalizeCode(req.body.code);

    if (!code) {
      return res.status(400).json({
        message: "Ange en premiumkod.",
      });
    }

    const premiumCode = await PremiumCode.findOne({
      where: {
        code: {
          [Op.eq]: code,
        },
      },
    });

    if (!premiumCode) {
      return res.status(404).json({
        message: "Premiumkoden är ogiltig.",
      });
    }

    if (!isCodeWithinValidityPeriod(premiumCode)) {
      return res.status(400).json({
        message:
          "Premiumkoden är inte aktiv, har gått ut eller har nått sin användningsgräns.",
      });
    }

    return res.status(200).json({
      valid: true,

      premiumCode: {
        id: premiumCode.id,
        code: premiumCode.code,
      },
    });
  } catch (error) {
    console.error("Validate premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte kontrolleras.",
    });
  }
};

/* -------------------------------- */
/* Redeem premium code              */
/* -------------------------------- */

// POST /api/payment-codes/premium/redeem
const redeemPremiumCode = async (req, res) => {
  const transaction = await PremiumCode.sequelize.transaction();

  try {
    const code = normalizeCode(req.body.code);

    if (!code) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Ange en premiumkod.",
      });
    }

    if (!req.user) {
      await transaction.rollback();

      return res.status(401).json({
        message: "Du måste vara inloggad för att använda en premiumkod.",
      });
    }

    if (req.user.isPremium) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Ditt konto har redan Premium.",
      });
    }

    const premiumCode = await PremiumCode.findOne({
      where: {
        code: {
          [Op.eq]: code,
        },
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!premiumCode) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Premiumkoden är ogiltig.",
      });
    }

    if (!isCodeWithinValidityPeriod(premiumCode)) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          "Premiumkoden är inte aktiv, har gått ut eller har nått sin användningsgräns.",
      });
    }

    await premiumCode.update(
      {
        usageCount: premiumCode.usageCount + 1,
      },
      {
        transaction,
      },
    );

    await grantPremium(req.user.id, {
      transaction,
    });

    await transaction.commit();

    const updatedUser = await req.user.reload({
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).json({
      message: "Premium har aktiverats på ditt konto med livstidsåtkomst.",
      user: updatedUser,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Redeem premium code error:", error);

    return res.status(500).json({
      message: "Premiumkoden kunde inte aktiveras.",
    });
  }
};

module.exports = {
  validateCoupon,
  validatePremiumCode,
  redeemPremiumCode,
};
