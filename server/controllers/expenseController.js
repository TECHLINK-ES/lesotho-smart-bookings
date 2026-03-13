const Expense = require('../models/Expense');

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

exports.getShopExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findByShop(req.params.shopId);
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
};