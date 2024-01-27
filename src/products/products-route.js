const express = require('express');
const router = express.Router();
const ProductsController = require('./products-controller');
const checkAuth = require('../middlewares/auth-middleware');

const getProducts = ProductsController.getProducts;
const addProduct = ProductsController.addProduct;
const deleteProduct = ProductsController.deleteProduct;
const updateProduct = ProductsController.updateProduct;

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);

module.exports = router;
