const Transaction = require("../models/transaction");

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page, limit } = req.query;

    // build filter object
    let filter = { isDeleted: false };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // simple pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("createdBy", "name email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/transactions - admin only
const createTransaction = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({ message: "amount, type, category and date are required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/transactions/:id - admin only
const updateTransaction = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (amount !== undefined) transaction.amount = amount;
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (date) transaction.date = date;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/transactions/:id - admin only (soft delete)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.isDeleted = true;
    await transaction.save();

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
