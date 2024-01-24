const OrdersService = require('../services/orders-service');

const createOrder = async (req, res) => {
  const body = req.body;
  const order = await OrdersService.create(body);
  if (!order) {
    res.status(500).send({ error: 'Failed to create order' });
  }
  res.send(order);
};

module.exports = {
  createOrder,
};
