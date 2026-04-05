const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// everyone logged in can view
router.get("/", protect, getTransactions);
router.get("/:id", protect, getTransactionById);

// only admin can create, update, delete
router.post("/", protect, adminOnly, createTransaction);
router.put("/:id", protect, adminOnly, updateTransaction);
router.delete("/:id", protect, adminOnly, deleteTransaction);

module.exports = router;
