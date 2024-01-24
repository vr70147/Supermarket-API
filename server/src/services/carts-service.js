const pool = require('../pool');
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

  static async findByUserId(id) {
    const { rows } = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [id]
    );
    if (!rows) return null;
    return rows;
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

  static async addCart(body) {
    const { userId } = body;
    console.log(userId);
    const { rows } = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    if (!rows) throw new Error('Cart already exists');
    return toCamelCase(rows)[0];
  }

  static async addItemToCart(cartId, body) {
    console.log(cartId);

    const checkIfProductExists = await pool.query(
      'SELECT * FROM carts_users WHERE product_id = $1 AND cart_id = $2',
      [body.productId, cartId]
    );
    if (checkIfProductExists.rows.length > 0) {
      const updateQty = await pool.query(
        'UPDATE carts_users SET quantity = (quantity + $1) WHERE product_id = $2 AND cart_id = $3',
        [body.qty, body.productId, cartId]
      );
      return updateQty;
    }
    const { rows } = await pool.query(
      'INSERT INTO carts_users (product_id, quantity, cart_id) VALUES ($1, $2, $3) RETURNING *',
      [body.productId, body.qty, cartId]
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
      products.name, products.price, products.image, carts_users.quantity
      FROM carts_users
      INNER JOIN products ON products.id = carts_users.product_id
      INNER JOIN carts ON carts.id = carts_users.cart_id
      WHERE carts_users.cart_id = $1;
      `,
      [id]
    );
    if (!rows) throw new Error('Cart items not found');
    return toCamelCase(rows);
  }
}

module.exports = CartsService;
