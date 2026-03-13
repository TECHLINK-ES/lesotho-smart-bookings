const express = require('express');
const router = express.Router();
const { createExpense, getShopExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/shop/:shopId').get(protect, getShopExpenses);
router.route('/').post(protect, createExpense);

module.exports = router;