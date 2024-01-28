const OrdersService = require('./orders-service');

const createOrder = async (req, res) => {
  const order = await pool.query(
    'INSERT INTO orders (dateofdelivery, creditcard, address, cart_id) VALUES ($1, $2, $3, $4) RETURNING *;',
    [
      req.body.dateOfDelivery,
      req.body.creditCard,
      req.body.address,
      req.body.cart_id,
    ]
  );
  if (!order) {
    res.status(500).send({ error: 'Failed to create order' });
  }
  res.send(order);
};

const getOrders = async (req, res) => {
  if (!req.body || !req.query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const order = await OrdersService.find(
    req.query.pageNumber,
    req.query.pageSize,
    req.body.where,
    req.body.columns,
    req.query.orderBy,
    req.query.sort
  );
  if (!order) {
    return res.status(404).send({ error: 'orders not found' });
  }
  res.json(order);
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  const order = await OrdersService.findById(id);
  const user = await OrdersService.findUserByOrder(id);
  const total = await OrdersService.sumAllPrices(id);
  res.json({ details: user, order: order, total: total });
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};
