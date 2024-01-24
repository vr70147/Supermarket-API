const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class OrdersService {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM orders;');
    if (!rows) return null;
    return toCamelCase(rows);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1;', [
      id,
    ]);
    if (!rows) return null;
    return toCamelCase(rows)[0];
  }

  static async create(body) {
    const { rows } = await pool.query(
      'INSERT INTO orders (dateOfDelivery, creditCard, address, cart_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [body.dateOfDelivery, body.creditCard, body.address, body.cart_id]
    );
    console.log(rows);
    // const getOrderDetails = await pool.query(

    // )
    return toCamelCase(rows)[0];
  }
}

module.exports = OrdersService;
