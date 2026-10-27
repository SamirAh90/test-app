const express = require("express");

const {
  getAdminCoupons,
  getAdminCoupon,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} = require("../controllers/adminCouponController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

/* -------------------------------- */
/* Protect coupon routes            */
/* -------------------------------- */

router.use(authMiddleware);
router.use(requireAdmin);

/* -------------------------------- */
/* Coupon routes                    */
/* -------------------------------- */

router.get("/", getAdminCoupons);

router.get("/:couponId", getAdminCoupon);

router.post("/", createAdminCoupon);

router.put("/:couponId", updateAdminCoupon);

router.delete("/:couponId", deleteAdminCoupon);

module.exports = router;
