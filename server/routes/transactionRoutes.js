const express = require('express');
const router = express.Router();
const { createTransaction, getShopTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/shop/:shopId').get(protect, getShopTransactions);
router.route('/').post(protect, createTransaction);

module.exports = router;