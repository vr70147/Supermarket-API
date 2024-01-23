const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class CategoriesService {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM categories;');
    if (!rows) return null;
    return toCamelCase(rows);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM categories WHERE id = $1;',
      [id]
    );
    if (!rows) return null;
    return toCamelCase(rows)[0];
  }

  static async findProductsByCategory(id) {
    const { rows } = await pool.query(
      `SELECT
      products.id, products.name, products.price, products.description, products.image, products.brand
      FROM products
      INNER JOIN categories ON categories.id = products.category_id
      WHERE categories.id = $1;`,
      [id]
    );
    if (!rows) return res.status(404).send({ error: 'Category not found' });
    return toCamelCase(rows);
  }

  static async create(body) {
    const { name } = body;
    if (!name) {
      throw new Error('Missing parameters');
    }
    const { rows } = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *;',
      [body.name]
    );
    return toCamelCase(rows)[0];
  }

  static async update(id, body) {
    const { name } = body;
    if (!name) {
      throw new Error('Missing parameters');
    }
    const { rows } = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *;',
      [id, body.name]
    );
    return toCamelCase(rows)[0];
  }

  static async deleteCategory({ id }) {
    const { rows } = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *;',
      [id]
    );
    if (!rows) throw new Error('Category not found');
    return toCamelCase(rows)[0];
  }
}

module.exports = CategoriesService;
