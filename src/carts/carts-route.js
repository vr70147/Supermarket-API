const router = require('express').Router();
const isAuth = require('../middlewares/auth-middleware');
const CartsController = require('./carts-controller');

const getCart = CartsController.getCart;
const getCarts = CartsController.getCarts;
const addCart = CartsController.addCart;
const deleteCart = CartsController.deleteCart;
const addCartItem = CartsController.addCartItem;
const deleteCartItem = CartsController.deleteCartItem;
const deleteAllItems = CartsController.deleteAllItems;
const getCartItems = CartsController.getCartItems;

router.get('/:id', isAuth, getCart);
router.get('/', isAuth, getCarts);
router.post('/', addCart);
router.delete('/:id', isAuth, deleteCart);
router.post('/:id', addCartItem);
router.delete('/:id/items/:itemId', isAuth, deleteCartItem);
router.delete('/:id/items', isAuth, deleteAllItems);
router.get('/:id/items', getCartItems);

module.exports = router;
