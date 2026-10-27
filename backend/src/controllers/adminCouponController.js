const { Op } = require("sequelize");

const Coupon = require("../models/Coupon");

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const validateCouponPayload = ({
  code,
  discountType,
  discountValue,
  usageLimit,
  validFrom,
  validUntil,
}) => {
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return {
      error: "Rabattkoden måste anges.",
    };
  }

  if (!["percentage", "fixed"].includes(discountType)) {
    return {
      error: "Rabatten måste vara procent eller fast belopp.",
    };
  }

  const normalizedDiscountValue = Number(discountValue);

  if (
    !Number.isInteger(normalizedDiscountValue) ||
    normalizedDiscountValue <= 0
  ) {
    return {
      error: "Rabattvärdet måste vara ett positivt heltal.",
    };
  }

  if (discountType === "percentage" && normalizedDiscountValue > 100) {
    return {
      error: "Procentrabatten kan inte vara högre än 100 procent.",
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
      discountType,
      discountValue: normalizedDiscountValue,
      usageLimit: normalizedUsageLimit,
      validFrom: normalizedValidFrom,
      validUntil: normalizedValidUntil,
    },
  };
};

/* -------------------------------- */
/* Get all coupons                  */
/* -------------------------------- */

const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [
        ["isActive", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      coupons,
    });
  } catch (error) {
    console.error("Admin get coupons error:", error);

    return res.status(500).json({
      message: "Rabattkoderna kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Get one coupon                   */
/* -------------------------------- */

const getAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        message: "Rabattkoden hittades inte.",
      });
    }

    return res.status(200).json({
      coupon,
    });
  } catch (error) {
    console.error("Admin get coupon error:", error);

    return res.status(500).json({
      message: "Rabattkoden kunde inte hämtas.",
    });
  }
};

/* -------------------------------- */
/* Create coupon                    */
/* -------------------------------- */

const createAdminCoupon = async (req, res) => {
  try {
    const validation = validateCouponPayload(req.body);

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    const existingCoupon = await Coupon.findOne({
      where: {
        code: validation.values.code,
      },
    });

    if (existingCoupon) {
      return res.status(409).json({
        message: "Det finns redan en rabattkod med denna kod.",
      });
    }

    const coupon = await Coupon.create({
      ...validation.values,
      usageCount: 0,
      isActive:
        typeof req.body.isActive === "boolean" ? req.body.isActive : true,
    });

    return res.status(201).json({
      message: "Rabattkoden skapades.",
      coupon,
    });
  } catch (error) {
    console.error("Admin create coupon error:", error);

    return res.status(500).json({
      message: "Rabattkoden kunde inte skapas.",
    });
  }
};

/* -------------------------------- */
/* Update coupon                    */
/* -------------------------------- */

const updateAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        message: "Rabattkoden hittades inte.",
      });
    }

    const validation = validateCouponPayload({
      code: req.body.code !== undefined ? req.body.code : coupon.code,

      discountType:
        req.body.discountType !== undefined
          ? req.body.discountType
          : coupon.discountType,

      discountValue:
        req.body.discountValue !== undefined
          ? req.body.discountValue
          : coupon.discountValue,

      usageLimit:
        req.body.usageLimit !== undefined
          ? req.body.usageLimit
          : coupon.usageLimit,

      validFrom:
        req.body.validFrom !== undefined
          ? req.body.validFrom
          : coupon.validFrom,

      validUntil:
        req.body.validUntil !== undefined
          ? req.body.validUntil
          : coupon.validUntil,
    });

    if (validation.error) {
      return res.status(400).json({
        message: validation.error,
      });
    }

    const duplicateCoupon = await Coupon.findOne({
      where: {
        code: validation.values.code,

        id: {
          [Op.ne]: coupon.id,
        },
      },
    });

    if (duplicateCoupon) {
      return res.status(409).json({
        message: "Det finns redan en rabattkod med denna kod.",
      });
    }

    if (
      validation.values.usageLimit !== null &&
      validation.values.usageLimit < coupon.usageCount
    ) {
      return res.status(400).json({
        message:
          "Användningsgränsen kan inte vara lägre än antal redan använda koder.",
      });
    }

    await coupon.update({
      ...validation.values,

      isActive:
        typeof req.body.isActive === "boolean"
          ? req.body.isActive
          : coupon.isActive,
    });

    return res.status(200).json({
      message: "Rabattkoden uppdaterades.",
      coupon,
    });
  } catch (error) {
    console.error("Admin update coupon error:", error);

    return res.status(500).json({
      message: "Rabattkoden kunde inte uppdateras.",
    });
  }
};

/* -------------------------------- */
/* Delete coupon                    */
/* -------------------------------- */

const deleteAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({
        message: "Rabattkoden hittades inte.",
      });
    }

    if (coupon.usageCount > 0) {
      return res.status(400).json({
        message:
          "En rabattkod som redan har använts kan inte tas bort. Inaktivera den i stället.",
      });
    }

    await coupon.destroy();

    return res.status(200).json({
      message: "Rabattkoden togs bort.",
    });
  } catch (error) {
    console.error("Admin delete coupon error:", error);

    return res.status(500).json({
      message: "Rabattkoden kunde inte tas bort.",
    });
  }
};

module.exports = {
  getAdminCoupons,
  getAdminCoupon,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
};
