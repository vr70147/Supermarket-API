const express = require('express');
const router = express.Router();
const CategoriesController = require('./categories-controller');
const checkAuth = require('../middlewares/auth-middleware');
const checkAdmin = require('../middlewares/admin-middleware');

const getCategories = CategoriesController.getCategories;
const findProductsByCategory = CategoriesController.getProductsByCategory;
const addCategory = CategoriesController.createCategory;
const deleteCategory = CategoriesController.deleteCategory;
const updateCategory = CategoriesController.updateCategory;

router.get('/', getCategories);
router.get('/:id/products', findProductsByCategory);
router.post('/', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
