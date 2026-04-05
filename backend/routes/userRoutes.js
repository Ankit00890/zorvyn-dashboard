const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// all user routes require admin
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
