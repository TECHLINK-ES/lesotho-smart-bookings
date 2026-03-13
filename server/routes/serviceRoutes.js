const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access shopId
const { createService, getServices } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin', 'staff'), createService);

module.exports = router;