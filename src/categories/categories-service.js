const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');

class CategoriesService {
  constructor(pool) {
    this.pool = pool;
  }

  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const clientColumns = columns.toString();
    const query = await filterQuery({
      where: where,
      columns: clientColumns,
      table: 'categories',
      orderBy: orderBy,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    });
    const { rows } = await this.pool.query(query);
    if (!rows) return null;
    return toCamelCase(rows);
  }

  async appendProductsToCategory(id, body) {
    if (!body.productId || !id) {
      throw new Error('Missing product id or category id');
    }
    const { rows } = await pool.query(
      'INSERT INTO products_categories (product_id, category_id) VALUES ($1, $2) RETURNING *;',
      [body.productId, id]
    );
    if (!rows) return null;
    return toCamelCase(rows)[0];
  }
}

module.exports = new CategoriesService(pool);
