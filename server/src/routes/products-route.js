const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products-controller');
const checkAuth = require('../auth/auth-guard');

const getProducts = ProductsController.getProducts;
const addProduct = ProductsController.addProduct;
const deleteProduct = ProductsController.deleteProduct;
const updateProduct = ProductsController.updateProduct;

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);

module.exports = router;
