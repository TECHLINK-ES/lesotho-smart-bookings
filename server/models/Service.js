const db = require('../config/db');

const Service = {
  async create(name, description, price, duration, shopId) {
    const result = await db.query(
      `INSERT INTO services (name, description, price, duration, shop_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, NOW(), true) 
       RETURNING *`,  
      [name, description, price, duration, shopId]
    );
    return result.rows[0];
  },

  async findByShopId(shopId) {
    const result = await db.query(
      'SELECT * FROM services WHERE shop_id = $1 AND is_active = true ORDER BY name',
      [shopId]
    );
    return result.rows;
  },


  async update(id, data) {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (['name', 'description', 'price', 'duration'].includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) return null;
    setClause.push('updated_at = NOW()');
    values.push(id);

    const result = await db.query(
      `UPDATE services SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      "UPDATE services SET is_active = false WHERE id = $1 RETURNING id", 
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Service;