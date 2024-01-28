const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');
class CartsService {
  constructor(pool) {
    this.pool = pool;
  }
  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const clientColumns = columns.toString();
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
    if (!rows) return null;
    return toCamelCase(rows);
  }

  async addItemToCart(cartId, body) {
    const checkIfProductExists = await this.pool.query(
      'SELECT * FROM carts_users WHERE product_id = $1 AND cart_id = $2',
      [body.productId, cartId]
    );
    if (checkIfProductExists.rows.length > 0) {
      const updateQty = await this.pool.query(
        'UPDATE carts_users SET quantity = (quantity + $1) WHERE product_id = $2 AND cart_id = $3',
        [body.qty, body.productId, cartId]
      );
      return updateQty;
    }
    const { rows } = await this.pool.query(
      'INSERT INTO carts_users (product_id, quantity, cart_id) VALUES ($1, $2, $3) RETURNING *',
      [body.productId, body.qty, cartId]
    );
    if (!rows) throw new Error('Cart not found');
    return toCamelCase(rows)[0];
  }
}

module.exports = new CartsService(pool);
