const db = require('../config/db');

const Shop = {
  async create(name, address, phone, description, ownerId) {
    const result = await db.query(
      `INSERT INTO shops (name, address, phone, description, owner_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING id`,
      [name, address, phone, description, ownerId]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query('SELECT * FROM shops WHERE is_active = true ORDER BY created_at DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM shops WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (['name', 'address', 'phone', 'description'].includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) return null;
    
    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(`UPDATE shops SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0];
  }
};

module.exports = Shop;