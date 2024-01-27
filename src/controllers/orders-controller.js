const OrdersService = require('../services/orders-service');
const UserService = require('../services/user-service');

const createOrder = async (req, res) => {
  const body = req.body;
  const order = await OrdersService.create(body);
  if (!order) {
    res.status(500).send({ error: 'Failed to create order' });
  }
  res.send(order);
};

const getOrders = async (req, res) => {
  const query = req.params;
  const orders = await OrdersService.find(query.pageNumber, query.pageSize);
  if (!orders) {
    res.status(500).send({ error: 'Failed to get orders' });
  }
  res.send(orders);
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
