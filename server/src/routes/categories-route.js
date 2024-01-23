const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/categories-controller');
const checkAuth = require('../auth/auth-guard');

const getCategories = CategoriesController.getCategories;
const getCategoriesById = CategoriesController.getCategoriesById;
const addCategory = CategoriesController.createCategory;
const deleteCategory = CategoriesController.deleteCategory;
const updateCategory = CategoriesController.updateCategory;

router.get('/', getCategories);
router.get('/:id', getCategoriesById);
router.post('/', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
