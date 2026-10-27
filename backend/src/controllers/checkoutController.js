const { Op } = require("sequelize");

const AppSetting = require("../models/AppSetting");
const Coupon = require("../models/Coupon");
const PaymentTransaction = require("../models/PaymentTransaction");

const { getStripe } = require("../services/stripeService");

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

const getEnabledPaymentMethods = async () => {
  const settings = await AppSetting.findAll({
    where: {
      key: {
        [Op.in]: [
          "payment_card_enabled",
          "payment_swish_enabled",
          "payment_klarna_enabled",
        ],
      },
    },
    attributes: ["key", "value"],
  });

  const values = Object.fromEntries(
    settings.map((setting) => [setting.key, setting.value]),
  );

  return {
    card: values.payment_card_enabled === "true",
    swish: values.payment_swish_enabled === "true",
    klarna: values.payment_klarna_enabled === "true",
  };
};

const isCouponCurrentlyValid = (coupon) => {
  const now = new Date();

  if (!coupon.isActive) {
    return false;
  }

  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return false;
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return false;
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    coupon.usageCount >= coupon.usageLimit
  ) {
    return false;
  }

  return true;
};

const calculateDiscount = (coupon, premiumPrice) => {
  if (!coupon) {
    return 0;
  }

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
/* Create checkout session          */
/* -------------------------------- */

// POST /api/checkout/create-session
const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Du måste vara inloggad för att köpa Premium.",
      });
    }

    if (req.user.isPremium) {
      return res.status(400).json({
        message: "Ditt konto har redan Premium.",
      });
    }

    const stripe = getStripe();

    const premiumPrice = await getPremiumPrice();

    const paymentMethods = await getEnabledPaymentMethods();

    const enabledMethods = [];

    if (paymentMethods.card) {
      enabledMethods.push("card");
    }

    if (paymentMethods.klarna) {
      enabledMethods.push("klarna");
    }

    /*
      Swish is intentionally not pushed here yet.
      Stripe payment method availability depends
      on the Stripe account and enabled methods.
      We connect it after confirming the account setup.
    */

    if (enabledMethods.length === 0) {
      return res.status(400).json({
        message: "Det finns inga aktiverade betalsätt för Stripe Checkout.",
      });
    }

    let coupon = null;

    const couponCode = normalizeCode(req.body.couponCode);

    if (couponCode) {
      coupon = await Coupon.findOne({
        where: {
          code: couponCode,
        },
      });

      if (!coupon) {
        return res.status(404).json({
          message: "Rabattkoden är ogiltig.",
        });
      }

      if (!isCouponCurrentlyValid(coupon)) {
        return res.status(400).json({
          message:
            "Rabattkoden är inte aktiv, har gått ut eller har nått sin användningsgräns.",
        });
      }
    }

    const discountAmount = calculateDiscount(coupon, premiumPrice);

    const finalPrice = Math.max(premiumPrice - discountAmount, 0);

    if (finalPrice <= 0) {
      return res.status(400).json({
        message:
          "Den här rabatten ger ett slutpris på 0 kr. Använd en Premiumkod i stället.",
      });
    }

    const transaction = await PaymentTransaction.create({
      userId: req.user.id,
      email: req.user.email,
      amount: finalPrice,
      currency: "SEK",
      paymentMethod: enabledMethods.length === 1 ? enabledMethods[0] : "card",
      status: "pending",
      provider: "stripe",
      description: "MedborgaTest Premium lifetime access",
      metadata: {
        originalPrice: premiumPrice,
        discountAmount,
        couponId: coupon?.id || null,
        couponCode: coupon?.code || null,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: req.user.email,

      payment_method_types: enabledMethods,

      line_items: [
        {
          quantity: 1,

          price_data: {
            currency: "sek",

            unit_amount: finalPrice,

            product_data: {
              name: "MedborgaTest Premium",
              description: "Livstidsåtkomst till MedborgaTest Premium.",
            },
          },
        },
      ],

      metadata: {
        paymentTransactionId: String(transaction.id),
        userId: String(req.user.id),
        couponId: coupon ? String(coupon.id) : "",
      },

      success_url: `${frontendUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}/premium?cancelled=true`,
    });

    await transaction.update({
      providerTransactionId: session.id,
    });

    return res.status(200).json({
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Create Stripe checkout session error:", error);

    return res.status(500).json({
      message: "Betalningen kunde inte startas.",
    });
  }
};

module.exports = {
  createCheckoutSession,
};
