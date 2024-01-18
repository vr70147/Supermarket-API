const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');
const checkAuth = require('../auth/auth-guard');

const getProducts = ProductsController.getProducts;
const addProduct = ProductsController.addProduct;
const deleteProduct = ProductsController.deleteProduct;
const updateProduct = ProductsController.updateProduct;

router.get('/', getProducts);

module.exports = router;
