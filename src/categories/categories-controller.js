const CategoriesService = require('./categories-service');

const getCategories = async (req, res) => {
  if (!req.body || !req.query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const category = await CategoriesService.find(
    req.query.pageNumber,
    req.query.pageSize,
    req.body.where,
    req.body.columns,
    req.query.orderBy,
    req.query.sort
  );
  if (!category) {
    return res.status(404).send({ error: 'Categories not found' });
  }
  res.json(category);
};

const createCategory = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const category = await CategoriesService.pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *;',
    [req.body.name]
  );
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(category);
};

const getProductsByCategory = async (req, res) => {
  const products = await CategoriesService.pool.query(
    `SELECT
    products.id, products.name, products.price, products.description, products.image, products.brand
    FROM products
    INNER JOIN categories ON categories.id = products.category_id
    WHERE categories.id = $1;`,
    [req.params.id]
  );
  if (!products) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(products);
};

const updateCategory = async (req, res) => {
  if (!req.body || !req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const category = await CategoriesService.pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *;',
    [req.params.id, req.body.name]
  );
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(category);
};

const deleteCategory = async (req, res) => {
  if (!req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const category = await CategoriesService.pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING *;',
    [req.params.id]
  );
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.status(204).send('Category deleted');
};

module.exports = {
  getProductsByCategory,
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
