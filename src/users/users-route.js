const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/auth-middleware');
const checkAdmin = require('../middlewares/admin-middleware');
const UsersController = require('./users-controller');

const getUsers = UsersController.getUsers;
const addUser = UsersController.addUser;
const updateUser = UsersController.updateUser;
const deleteUser = UsersController.deleteUser;
const login = UsersController.login;
const logout = UsersController.logout;
const checkRefreshToken = UsersController.checkRefreshToken;

router.get('/', checkAdmin, checkAuth, getUsers);
router.post('/token', checkAuth, checkRefreshToken);
router.post('/login', login);
router.delete('/logout', checkAuth, logout);
router.post('/register', addUser);
router.put('/:id', checkAuth, updateUser);
router.delete('/:id', checkAdmin, checkAuth, deleteUser);

module.exports = router;
