const { Op } = require("sequelize");

const PaymentTransaction = require("../models/PaymentTransaction");
const User = require("../models/User");

/* -------------------------------- */
/* Payment statistics               */
/* -------------------------------- */

// GET /api/admin/payments/stats
const getPaymentStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRevenue,
      revenueThisMonth,
      purchasesToday,
      purchasesThisMonth,
      completedPayments,
      failedPayments,
      refundedPayments,
      pendingPayments,
    ] = await Promise.all([
      PaymentTransaction.sum("amount", {
        where: {
          status: "paid",
        },
      }),

      PaymentTransaction.sum("amount", {
        where: {
          status: "paid",
          paidAt: {
            [Op.gte]: startOfMonth,
          },
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "paid",
          paidAt: {
            [Op.gte]: startOfToday,
          },
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "paid",
          paidAt: {
            [Op.gte]: startOfMonth,
          },
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "paid",
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "failed",
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "refunded",
        },
      }),

      PaymentTransaction.count({
        where: {
          status: "pending",
        },
      }),
    ]);

    return res.status(200).json({
      totalRevenue: totalRevenue || 0,
      revenueThisMonth: revenueThisMonth || 0,
      purchasesToday,
      purchasesThisMonth,
      completedPayments,
      failedPayments,
      refundedPayments,
      pendingPayments,
      currency: "SEK",
    });
  } catch (error) {
    console.error("Get payment stats error:", error);

    return res.status(500).json({
      message: "Could not fetch payment statistics.",
    });
  }
};

/* -------------------------------- */
/* Transaction list                 */
/* -------------------------------- */

// GET /api/admin/payments
const getTransactions = async (req, res) => {
  try {
    const {
      status,
      paymentMethod,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 25,
    } = req.query;

    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (paymentMethod && paymentMethod !== "all") {
      where.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        where.createdAt[Op.lte] = end;
      }
    }

    if (search?.trim()) {
      const searchTerm = search.trim();

      where[Op.or] = [
        {
          email: {
            [Op.like]: `%${searchTerm}%`,
          },
        },

        {
          providerTransactionId: {
            [Op.like]: `%${searchTerm}%`,
          },
        },

        {
          "$user.firstName$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },

        {
          "$user.lastName$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },

        {
          "$user.email$": {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);

    const safePage = Math.max(Number(page) || 1, 1);

    const offset = (safePage - 1) * safeLimit;

    const { count, rows } = await PaymentTransaction.findAndCountAll({
      where,

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
          required: false,
        },
      ],

      subQuery: false,

      order: [["createdAt", "DESC"]],

      limit: safeLimit,
      offset,
    });

    return res.status(200).json({
      transactions: rows,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total: count,
        totalPages: Math.ceil(count / safeLimit),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      message: "Could not fetch payment transactions.",
    });
  }
};

/* -------------------------------- */
/* Transaction details              */
/* -------------------------------- */

// GET /api/admin/payments/:transactionId
const getTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findByPk(
      req.params.transactionId,
      {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email"],
            required: false,
          },
        ],
      },
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Payment transaction not found.",
      });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);

    return res.status(500).json({
      message: "Could not fetch payment transaction.",
    });
  }
};

module.exports = {
  getPaymentStats,
  getTransactions,
  getTransactionById,
};
