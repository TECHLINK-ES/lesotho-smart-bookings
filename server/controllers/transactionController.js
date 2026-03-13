const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.getShopTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findByShop(req.params.shopId);
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};