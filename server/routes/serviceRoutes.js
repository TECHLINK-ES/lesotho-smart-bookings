const express = require('express');
const router = express.Router({ mergeParams: true });
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin', 'staff'), createService);

router.route('/:id')
  .put(protect, authorize('admin', 'staff'), updateService)
  .delete(protect, authorize('admin'), deleteService);;

module.exports = router;