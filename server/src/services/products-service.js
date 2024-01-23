const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class ProductsService {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM products;');
    if (!rows) return null;
    return toCamelCase(rows);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1;', [
      id,
    ]);
    if (!rows) return null;
    return toCamelCase(rows)[0];
  }

  static async create(body) {
    const { name, price, description } = body;
    if (!name || !price || !description) return null;
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *;',
      [body.name, body.price, body.description]
    );
    return toCamelCase(rows)[0];
  }

  static async update(id, body) {
    const { name, price, description } = body;
    if (!name || !price || !description) return null;
    const { rows } = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *;',
      [body.name, body.price, body.description, id]
    );
    return toCamelCase(rows)[0];
  }

  static async deleteProduct({ id }) {
    const { rows } = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows) throw new Error('Product not found');
    return toCamelCase(rows)[0];
  }

  static async addProduct(body) {
    const { name, price, description } = body;
    if (!name || !price || !description) return null;
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, description, image, brand, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [
        body.name,
        body.price,
        body.description,
        body.image,
        body.brand,
        body.category_id,
      ]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = ProductsService;
