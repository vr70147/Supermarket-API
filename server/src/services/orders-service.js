const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class OrdersService {
  static async find(pageNumber, pageSize) {
    const { rows } = await pool.query(
      `
      SELECT * FROM orders
      ORDER BY "orders"."id"
      LIMIT $2
      OFFSET (($1 - 1) * $2);
    `,
      [pageNumber, pageSize]
    );
    if (!rows) return null;
    return toCamelCase(rows);
  }

  static async findById(id) {
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

  static async findUserByOrder(id) {
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

  static async sumAllPrices(id) {
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

  static async create(body) {
    const { rows } = await pool.query(
      'INSERT INTO orders (dateofdelivery, creditcard, address, cart_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [body.dateOfDelivery, body.creditCard, body.address, body.cart_id]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = OrdersService;
