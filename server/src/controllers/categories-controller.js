const CategoriesService = require('../services/categories-service');

const getCategories = async (req, res) => {
  const categories = await CategoriesService.find();
  if (!categories) return null;
  res.json(categories);
};

const getCategoriesById = async (req, res) => {
  const id = req.params;
  const category = await CategoriesService.findById(id);
  if (!category) return null;
  res.json(category);
};

const createCategory = async (req, res) => {
  const body = req.body;
  const category = await CategoriesService.create(body);
  if (!category) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  res.send(category);
};

const updateCategory = async (req, res) => {
  const id = req.params;
  const body = req.body;
  const category = await CategoriesService.update(id, body);
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.send(category);
};

const deleteCategory = async (req, res) => {
  const id = req.params;
  const category = await CategoriesService.deleteCategory(id);
  if (!category) {
    return res.status(404).send({ error: 'Category not found' });
  }
  res.status(204).send('Category deleted');
};

module.exports = {
  getCategoriesById,
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
