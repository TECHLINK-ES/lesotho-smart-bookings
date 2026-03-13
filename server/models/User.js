const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(email, password, name, phone, role, shopId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, phone, role, shop_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), true) RETURNING id, email, name, role`,
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
  }
};

module.exports = User;