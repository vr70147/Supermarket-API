const CartsService = require('./carts-service');

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
  if (!req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const cart = await CartsService.pool.query(
    `SELECT
    products.name, products.price, products.image, carts_users.quantity
    FROM carts_users
    INNER JOIN products ON products.id = carts_users.product_id
    INNER JOIN carts ON carts.id = carts_users.cart_id
    WHERE carts_users.cart_id = $1;
    `,
    [req.params.id]
  );
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
  if (!req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const cart = await CartsService.pool.query(
    'DELETE FROM carts WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const deleteCartItem = async (req, res) => {
  if (!req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const cart = await CartsService.pool.query(
    'DELETE FROM carts WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const deleteAllItems = async (req, res) => {
  if (!req.params) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const cart = await CartsService.pool.query(
    'DELETE FROM carts WHERE product_id = $1 RETURNING *',
    [req.params.id]
  );
  if (!cart) {
    return res.status(404).send({ error: 'Cart not found' });
  }
  res.send(cart);
};

const addCart = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const cart = await CartsService.pool.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [req.body.user_id]
  );
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
