const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');

class ProductsService {
  constructor(pool) {
    this.pool = pool;
  }
  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const clientColumns = columns.toString();
    const query = await filterQuery({
      where: where,
      columns: clientColumns,
      table: 'products',
      orderBy: orderBy,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    });
    const { rows } = await this.pool.query(query);
    if (!rows) return null;
    return toCamelCase(rows);
  }

  async deleteProduct({ id }) {
    const { rows } = await this.pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows) throw new Error('Product not found');
    return toCamelCase(rows)[0];
  }

  async addProduct(body) {
    const { name, price, description } = body;
    if (!name || !price || !description) return null;
    const { rows } = await this.pool.query(
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

module.exports = new ProductsService(pool);
