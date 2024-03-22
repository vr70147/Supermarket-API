const express = require('express');
const router = express.Router();
const ProductsController = require('./products-controller');
const checkAuth = require('../middlewares/auth-middleware');
const checkAdmin = require('../middlewares/admin-middleware');

const getProducts = ProductsController.getProducts;
const addProduct = ProductsController.addProduct;
const deleteProduct = ProductsController.deleteProduct;
const updateProduct = ProductsController.updateProduct;

router.get('/', getProducts);
router.post('/', checkAdmin, addProduct);
router.delete('/:id', checkAdmin, deleteProduct);
router.put('/:id', checkAdmin, updateProduct);

module.exports = router;
