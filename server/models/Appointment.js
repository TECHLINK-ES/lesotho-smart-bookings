const db = require('../config/db');

const Appointment = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO appointments (client_id, barber_id, shop_id, service_id, date, time, status, payment_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending', NOW()) 
       RETURNING *`, // Ensure this returns all fields
      [data.clientId, data.barberId, data.shopId, data.serviceId, data.date, data.time]
    );
    return result.rows[0];
  },

  async findByShop(shopId) {
    const result = await db.query(
      `SELECT a.*, s.name as service_name, u.name as client_name 
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN users u ON a.client_id = u.id
       WHERE a.shop_id = $1 ORDER BY a.date DESC`,
      [shopId]
    );
    return result.rows;
  },

  async update(id, data) {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (['status', 'payment_status', 'date', 'time'].includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) return null;
    setClause.push('updated_at = NOW()');
    values.push(id);

    const result = await db.query(
      `UPDATE appointments SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },
  
  async delete(id) {
      // Hard delete or soft delete? Usually appointments are cancelled, not deleted.
      // For CRUD sake, we will do hard delete.
      const result = await db.query('DELETE FROM appointments WHERE id = $1 RETURNING id', [id]);
      return result.rows[0];
  }
};

module.exports = Appointment;