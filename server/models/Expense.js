const db = require('../config/db');

const Expense = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO expenses (barber_id, shop_id, description, amount, category, date, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [data.barberId, data.shopId, data.description, data.amount, data.category, data.date]
    );
    return result.rows[0];
  },

  async findByShop(shopId) {
    const result = await db.query(
      `SELECT * FROM expenses WHERE shop_id = $1 ORDER BY date DESC`,
      [shopId]
    );
    return result.rows;
  }
};

module.exports = Expense;