const CartsService = require('../services/carts-service');

const getCarts = async (req, res) => {
  const { query } = req.params;
  if (!query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const carts = await CartsService.find(query.pageNumber, query.pageSize);
  if (!carts) {
    return null;
  }
  res.send(carts);
};

const getCart = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.findById(id);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const getCartItems = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.getAllItems(id);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const addCartItem = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.addItemToCart(id, req.body);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.deleteCart(id);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.deleteItemFromCart(id);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const deleteAllItems = async (req, res) => {
  const { id } = req.params;
  const cart = await CartsService.deleteAllItems(id);
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const addCart = async (req, res) => {
  const cart = await CartsService.addCart(req.body);
  if (!cart) {
    return res.status(409).send({ error: 'Cart already exists' });
  }
  res.send(cart);
};

module.exports = {
  addCartItem,
  deleteCartItem,
  deleteAllItems,
  getCart,
  deleteCart,
  addCart,
  getCarts,
  getCartItems,
};
