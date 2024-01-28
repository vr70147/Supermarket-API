const ProductService = require('./products-service');

const getProducts = async (req, res) => {
  if (!req.body || !req.query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const products = await ProductService.find(
    req.query.pageNumber,
    req.query.pageSize,
    req.body.where,
    req.body.columns,
    req.query.orderBy,
    req.query.sort
  );
  if (!products) {
    return res.status(404).send({ error: 'Products not found' });
  }
  res.json(products);
};

const addProduct = async (req, res) => {
  const product = await ProductService.pool.query(
    'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *;',
    [req.body.name, req.body.price, req.body.description]
  );
  res.status(201).json(product);
};

const deleteProduct = async (req, res) => {
  const id = req.params;
  const product = await ProductService.deleteProduct(id);
  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.status(204).send('Product deleted');
};

const updateProduct = async (req, res) => {
  const id = req.params;
  const product = await this.pool.query(
    'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *;',
    [req.body.name, req.body.price, req.body.description, id]
  );
  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.status(204).send(product);
};

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};
