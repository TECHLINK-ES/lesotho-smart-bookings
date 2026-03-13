const express = require('express');
const router = express.Router();
const { createShop, getShops, getShop, updateShop } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShops)
  .post(protect, authorize('admin'), createShop);

router.route('/:id')
  .get(getShop)
  .put(protect, authorize('admin'), updateShop); 

module.exports = router;