const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');

exports.createService = async (req, res, next) => {
  try {
    const { name, description, price, duration } = req.body;
    const shopId = req.params.shopId; // Passed via URL param
    
    const service = await Service.create(name, description, price, duration, shopId);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.findByShopId(req.params.shopId);
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};