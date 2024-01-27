const express = require('express');
const router = express.Router();
const OrdersController = require('./orders-controller');
const checkAuth = require('../middlewares/auth-middleware');

const createOrder = OrdersController.createOrder;
const getOrders = OrdersController.getOrders;
const getOrder = OrdersController.getOrder;

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
