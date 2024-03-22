const router = require('express').Router();
const checkAuth = require('../middlewares/auth-middleware');
const checkAdmin = require('../middlewares/admin-middleware');
const CartsController = require('./carts-controller');

const getCart = CartsController.getCart;
const getCarts = CartsController.getCarts;
const addCart = CartsController.addCart;
const deleteCart = CartsController.deleteCart;
const addCartItem = CartsController.addCartItem;
const deleteCartItem = CartsController.deleteCartItem;
const deleteAllItems = CartsController.deleteAllItems;
const getCartItems = CartsController.getCartItems;

router.get('/:id', checkAuth, getCart);
router.get('/', checkAdmin, getCarts);
router.post('/', checkAuth, addCart);
router.delete('/:id', checkAdmin, deleteCart);
router.post('/:id', checkAuth, addCartItem);
router.delete('/:id/items/:itemId', checkAuth, deleteCartItem);
router.delete('/:id/items', checkAuth, deleteAllItems);
router.get('/:id/items', checkAuth, getCartItems);

module.exports = router;
