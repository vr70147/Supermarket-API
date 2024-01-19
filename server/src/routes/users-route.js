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
const logout = UsersController.logout;
const whoami = UsersController.whoAmI;
const addAdmin = UsersController.addAdmin;

router.get('/', isAuth, getUsers);
router.get('/:id', isAuth, getUser);
router.get('/whoami', whoami);
router.post('/login', login);
router.post('/register', addUser);
router.post('admin/register', addAdmin);
router.post('/logout', isAuth, logout);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, deleteUser);

module.exports = router;
