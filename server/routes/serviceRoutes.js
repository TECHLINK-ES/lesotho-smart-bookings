const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to access :shopId
const { createService, getServices } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, createService);

module.exports = router;