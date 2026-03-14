const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');

exports.createService = async (req, res, next) => {
  try {
    const { name, description, price, duration } = req.body;
    // Get shopId from the URL params
    const shopId = req.params.shopId; 
    
    const service = await Service.create(name, description, price, duration, shopId);
    
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    next(err);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.findByShopId(req.params.shopId);
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: service });
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    await Service.delete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};