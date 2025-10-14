const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route   GET /api/medicines
// @desc    Lấy tất cả thuốc (công khai)
router.get("/", medicineController.getAllMedicines);

// @route   POST /api/medicines
// @desc    Tạo thuốc mới (chỉ admin)
router.post("/", protect, isAdmin, medicineController.createMedicine);


module.exports = router;