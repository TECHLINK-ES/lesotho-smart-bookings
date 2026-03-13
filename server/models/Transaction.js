const db = require('../config/db');

const Transaction = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO transactions (appointment_id, shop_id, barber_id, amount, payment_method, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [data.appointmentId, data.shopId, data.barberId, data.amount, data.paymentMethod, data.status || 'completed']
    );
    return result.rows[0];
  },

  async findByShop(shopId) {
    const result = await db.query(
      `SELECT t.*, u.name as barber_name 
       FROM transactions t
       LEFT JOIN users u ON t.barber_id = u.id
       WHERE t.shop_id = $1 ORDER BY t.created_at DESC`,
      [shopId]
    );
    return result.rows;
  }
};

module.exports = Transaction;