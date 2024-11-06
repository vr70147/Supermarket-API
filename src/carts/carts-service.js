const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');

class CartsService {
  constructor(pool) {
    this.pool = pool;
  }

  // Find carts with pagination and filtering
  async find(pageNumber, pageSize, where, columns = ['*'], orderBy, sort) {
    const clientColumns = Array.isArray(columns) ? columns.join(', ') : columns;
    const query = await filterQuery({
      where: where,
      columns: clientColumns,
      table: 'carts',
      orderBy: orderBy,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    });
    const { rows } = await this.pool.query(query);
    if (!rows || rows.length === 0) return null;
    return toCamelCase(rows);
  }

  // Add item to cart, updating quantity if the item already exists
  async addItemToCart(cartId, body) {
    const { productId, qty } = body;
    const checkIfProductExists = await this.pool.query(
      'SELECT * FROM carts_users WHERE product_id = $1 AND cart_id = $2',
      [productId, cartId]
    );
    if (checkIfProductExists.rows.length > 0) {
      const updateQty = await this.pool.query(
        'UPDATE carts_users SET quantity = (quantity + $1) WHERE product_id = $2 AND cart_id = $3 RETURNING *',
        [qty, productId, cartId]
      );
      return toCamelCase(updateQty.rows[0]);
    }
    const { rows } = await this.pool.query(
      'INSERT INTO carts_users (product_id, quantity, cart_id) VALUES ($1, $2, $3) RETURNING *',
      [productId, qty, cartId]
    );
    if (!rows || rows.length === 0)
      throw new Error('Failed to add item to cart');
    return toCamelCase(rows[0]);
  }

  // Get items in a cart by cart ID
  async getCartItemsById(cartId) {
    const { rows } = await this.pool.query(
      `SELECT products.name, products.price, products.image, carts_users.quantity
       FROM carts_users
       INNER JOIN products ON products.id = carts_users.product_id
       WHERE carts_users.cart_id = $1`,
      [cartId]
    );
    if (!rows || rows.length === 0) return null;
    return toCamelCase(rows);
  }

  // Delete a cart by ID
  async deleteCartById(cartId) {
    const { rows } = await this.pool.query(
      'DELETE FROM carts WHERE id = $1 RETURNING *',
      [cartId]
    );
    if (!rows || rows.length === 0) return null;
    return toCamelCase(rows[0]);
  }

  // Delete an item from a cart by cart ID and product ID
  async deleteItemFromCart(cartId, productId) {
    const { rows } = await this.pool.query(
      'DELETE FROM carts_users WHERE cart_id = $1 AND product_id = $2 RETURNING *',
      [cartId, productId]
    );
    if (!rows || rows.length === 0) return null;
    return toCamelCase(rows[0]);
  }

  // Delete all items from a cart by cart ID
  async deleteAllItemsFromCart(cartId) {
    const { rows } = await this.pool.query(
      'DELETE FROM carts_users WHERE cart_id = $1 RETURNING *',
      [cartId]
    );
    if (!rows || rows.length === 0) return null;
    return toCamelCase(rows);
  }

  // Create a new cart for a user
  async createCart(userId) {
    try {
      const result = await this.pool.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
        [userId]
      );

      if (
        !result ||
        !result.rows ||
        !Array.isArray(result.rows) ||
        result.rows.length === 0
      ) {
        throw new Error('Failed to create cart: No rows returned');
      }

      console.log('Rows:', result.rows); // Log rows to understand the structure
      return toCamelCase(result.rows)[0];
    } catch (error) {
      console.error('Error in createCart:', error); // Log the exact error for debugging
      throw new Error(`Failed to create cart: ${error.message}`);
    }
  }
}

module.exports = new CartsService(pool);
