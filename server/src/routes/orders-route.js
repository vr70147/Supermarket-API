const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/orders-controller');

const createOrder = OrdersController.createOrder;

router.post('/', createOrder);

module.exports = router;
