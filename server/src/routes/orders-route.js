const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders-controller');

const createOrder = OrdersController.createOrder;
const getOrders = OrdersController.getOrders;
const getOrder = OrdersController.getOrder;

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
