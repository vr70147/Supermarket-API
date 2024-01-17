const express = require('express');
const UsersRouter = require('../routes/users');
const router = express.Router();
const UserService = require('./user-service');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {});

router.post('/register', async (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    phone,
    personalId,
    address,
    birthdate,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    personalId: personalId,
    address: address,
    birthdate: birthdate,
  };
  await UserService.createUser(user);
  res.sendStatus(201);
});

module.exports = router;
