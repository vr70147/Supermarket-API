const express = require('express');
const router = express.Router();
const isAuth = require('../auth/auth-guard');
const isAdmin = require('../auth/admin-guard');
const UsersController = require('../controllers/users-controller');

const getUsers = UsersController.getUsers;
const getUser = UsersController.getUser;
const addUser = UsersController.addUser;
const updateUser = UsersController.updateUser;
const deleteUser = UsersController.deleteUser;
const login = UsersController.login;

router.get('/', isAdmin, isAuth, getUsers);
router.get('/:id', isAuth, getUser);
router.post('/login', login);
router.post('/register', addUser);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

module.exports = router;
