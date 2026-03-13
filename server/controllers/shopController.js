const Shop = require('../models/Shop');
const ApiError = require('../utils/ApiError');

exports.createShop = async (req, res, next) => {
  try {
    const { name, address, phone, description } = req.body;
    const ownerId = req.user.id; // From auth middleware

    const shop = await Shop.create(name, address, phone, description, ownerId);
    
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    next(err);
  }
};

exports.getShops = async (req, res, next) => {
  try {
    const shops = await Shop.findAll();
    res.status(200).json({ success: true, count: shops.length, data: shops });
  } catch (err) {
    next(err);
  }
};

exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return next(new ApiError(404, 'Shop not found'));
    }
    res.status(200).json({ success: true, data: shop });
  } catch (err) {
    next(err);
  }
};

exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.update(req.params.id, req.body);
    
    if (!shop) {
      return next(new ApiError(404, 'Shop not found or no fields provided'));
    }
    
    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
};