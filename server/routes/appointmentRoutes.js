const express = require('express');
const router = express.Router();
const { createAppointment, getShopAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/shop/:shopId').get(protect, getShopAppointments);
router.route('/').post(protect, createAppointment);

module.exports = router;