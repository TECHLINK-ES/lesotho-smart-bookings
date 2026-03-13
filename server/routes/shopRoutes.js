const express = require('express');
const router = express.Router();
const { createShop, getShops, getShop } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public
router.get('/', getShops);
router.get('/:id', getShop);

// Protected
router.post('/', protect, authorize('admin', 'owner'), createShop);

module.exports = router;