const express = require('express');
const router = express.Router();
const { createAppointment, getShopAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/shop/:shopId').get(protect, getShopAppointments);
router.route('/')
  .post(protect, createAppointment);

router.route('/:id')
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

module.exports = router;