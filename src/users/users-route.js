const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/auth-middleware');
const isAdmin = require('../middlewares/admin-middleware');
const UsersController = require('./users-controller');

const getUsers = UsersController.getUsers;
const addUser = UsersController.addUser;
const updateUser = UsersController.updateUser;
const deleteUser = UsersController.deleteUser;
const login = UsersController.login;
const logout = UsersController.logout;
const checkRefreshToken = UsersController.checkRefreshToken;

router.get('/', getUsers);
router.post('/token', checkRefreshToken);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/register', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
