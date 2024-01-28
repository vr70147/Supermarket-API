const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');

class OrdersService {
  constructor(pool) {
    this.pool = pool;
  }
  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const clientColumns = columns.toString();
    const query = await filterQuery({
      where: where,
      columns: clientColumns,
      table: 'orders',
      orderBy: orderBy,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    });
    const { rows } = await this.pool.query(query);
    if (!rows) return null;
    return toCamelCase(rows);
  }

  async findById(id) {
    const { rows } = await pool.query(
      `
      SELECT products.name, products.price, carts_users.quantity, SUM(products.price * carts_users.quantity) AS total
      FROM orders
      JOIN carts_users ON carts_users.cart_id = orders.cart_id
      JOIN products ON products.id = carts_users.product_id
      WHERE orders.id = $1
      GROUP BY products.name, products.price, carts_users.quantity;
    `,
      [id]
    );
    if (!rows) return null;
    return rows;
  }

  async findUserByOrder(id) {
    const { rows } = await pool.query(
      `
      SELECT users.firstname, users.lastname, users.email, users.phone, users.address
      FROM orders
      JOIN carts ON carts.id = orders.cart_id
      JOIN users ON users.id = carts.user_id
      WHERE orders.id = $1;
      `,
      [id]
    );
    if (!rows) return null;
    return rows;
  }

  async sumAllPrices(id) {
    const { rows } = await pool.query(
      `
      SELECT SUM(products.price * carts_users.quantity) AS total
      FROM orders
      JOIN carts_users ON carts_users.cart_id = orders.cart_id
      JOIN products ON products.id = carts_users.product_id
      WHERE orders.id = $1;
      `,
      [id]
    );
    if (!rows) return null;
    return rows;
  }
}

module.exports = new OrdersService(pool);
