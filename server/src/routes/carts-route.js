const router = require('express').Router();
const isAuth = require('../auth/auth-guard');
const CartsController = require('../controllers/carts-controller');

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
router.post('/', isAuth, addCart);
router.delete('/:id', isAuth, deleteCart);
router.post('/:id/items', isAuth, addCartItem);
router.delete('/:id/items/:itemId', isAuth, deleteCartItem);
router.delete('/:id/items', isAuth, deleteAllItems);
router.get('/:id/items', isAuth, getCartItems);

module.exports = router;
