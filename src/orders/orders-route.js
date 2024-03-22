const express = require('express');
const router = express.Router();
const OrdersController = require('./orders-controller');
const checkAuth = require('../middlewares/auth-middleware');
const checkAdmin = require('../middlewares/admin-middleware');

const createOrder = OrdersController.createOrder;
const getOrders = OrdersController.getOrders;
const getOrder = OrdersController.getOrder;

router.post('/', checkAuth, createOrder);
router.get('/', checkAuth, checkAdmin, getOrders);
router.get('/:id', checkAuth, getOrder);

module.exports = router;
