const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
} = require("../controller/dashboardController");
const { protect, analystOrAdmin } = require("../middleware/authMiddleware");

// viewers can see summary and recent, analysts/admins can see detailed analytics
router.get("/summary", protect, getSummary);
router.get("/recent", protect, getRecentActivity);
router.get("/category-totals", protect, analystOrAdmin, getCategoryTotals);
router.get("/monthly-trends", protect, analystOrAdmin, getMonthlyTrends);

module.exports = router;
