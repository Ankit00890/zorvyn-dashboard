const Transaction = require("../models/transaction");

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isDeleted: false });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      totalTransactions: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/dashboard/category-totals
const getCategoryTotals = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // format it a bit nicely
    const formatted = result.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total,
      count: item.count,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/dashboard/recent
const getRecentActivity = async (req, res) => {
  try {
    const recent = await Transaction.find({ isDeleted: false })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/dashboard/monthly-trends
const getMonthlyTrends = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const formatted = result.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      type: item._id.type,
      total: item.total,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
};
