const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

exports.getShopAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findByShop(req.params.shopId);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};