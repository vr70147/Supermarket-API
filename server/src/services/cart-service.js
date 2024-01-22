const { pool } = require('../pool');
const toCamelCase = require('./utils/to-camel-case');
class CartsService {
  static async find(pageNumber, pageSize) {
    const { rows } = await pool.query(
      `SELECT * FROM carts
      ORDER BY "carts"."id"
      LIMIT $2
      OFFSET (($1 - 1) * $2);`,
      [pageNumber, pageSize]
    );
    return toCamelCase(rows);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM carts WHERE id = $1', [
      id,
    ]);
    if (!rows) return null;
    return toCamelCase(rows)[0];
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM carts WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows) throw new Error('Cart not found');
    return toCamelCase(rows)[0];
  }

  static async deleteAllItems(id) {
    const { rows } = await pool.query(
      'DELETE FROM carts WHERE product_id = $1 RETURNING *',
      [id]
    );
    if (!rows) throw new Error('Cart not found');
    return toCamelCase(rows)[0];
  }

  static async addItemToCart(id, qty) {
    const { rows } = await pool.query(
      'INSERT INTO carts (product_id, qty) VALUES ($1, $2) RETURNING *',
      [id, qty]
    );
    if (!rows) throw new Error('Cart not found');
    return toCamelCase(rows)[0];
  }

  static async deleteItemFromCart(id) {
    const { rows } = await pool.query(
      'DELETE FROM carts WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows) throw new Error('Cart not found');
    return toCamelCase(rows)[0];
  }

  static async getAllItems(id) {
    const { rows } = await pool.query(
      `SELECT
      products.name, products.price, products.image, carts.qty
      FROM carts
      INNER JOIN products ON products.id = carts.product_id;
      INNER JOIN users ON users.id = carts.user_id
      WHERE users.id = $1;
      `[id]
    );
    if (!rows) throw new Error('Cart items not found');
    return toCamelCase(rows);
  }
}

module.exports = CartsService;
