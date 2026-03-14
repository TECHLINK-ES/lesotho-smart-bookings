const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(email, password, name, phone, role, shopId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, phone, role, shop_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), true) 
       RETURNING id, email, name, phone, role, shop_id, created_at`,
      [email, hashedPassword, name, phone, role, shopId]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query('SELECT id, email, name, phone, role, shop_id, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // --- NEW FUNCTIONS ADDED BELOW ---

  async findAll() {
    const result = await db.query('SELECT id, email, name, phone, role, shop_id, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  async update(id, data) {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (['name', 'phone', 'role', 'shop_id'].includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) return null;
    
    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE users SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, phone, role, shop_id`,
      values
    );
    return result.rows[0];
  },

  async delete(id) {
    // Soft delete
    const result = await db.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = User;