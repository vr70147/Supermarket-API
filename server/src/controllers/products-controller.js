const productsService = require('../services/products-service');

const getProducts = async (req, res) => {
  const products = await productsService.find();
  res.json(products);
};

const addProduct = async (req, res) => {
  const product = await productsService.addProduct(req.body);
  res.status(201).json(product);
};

const deleteProduct = async (req, res) => {
  const id = req.params;
  const product = await productsService.deleteProduct(id);
  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.status(204).send('Product deleted');
};

const updateProduct = async (req, res) => {
  const id = req.params;
  const product = await productsService.updateProduct(id, req.body);
  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.status(204).send(product);
};

const getProduct = async (req, res) => {
  const id = req.params;
  const product = await productsService.findById(id);
  if (!product) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.json(product);
};

const getProductsByFilter = async (req, res) => {
  const query = req.params;
  const products = await productsService.findByFilter(query);
  if (!products) {
    return res.status(404).send({ error: 'Product not found' });
  }
  res.json(products);
};

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProductsByFilter,
};
