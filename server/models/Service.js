const db = require('../config/db');

const Service = {
  async create(name, description, price, duration, shopId) {
    const result = await db.query(
      `INSERT INTO services (name, description, price, duration, shop_id, created_at, is_active)
       VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING id`,
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
  
  // Add update/delete similar to Shop model
};

module.exports = Service;