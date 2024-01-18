const express = require('express');
const UserService = require('../services/user-service');
const router = express.Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../auth/check-auth');
const jwt = require('jsonwebtoken');

router.get('/', checkAuth, async (req, res) => {
  const users = await UserService.find();
  res.send(users);
});

router.get('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserService.findById(id);
  if (!user) {
    res.sendStatus(404);
  }
  res.send(user);
});

router.post('/register', async (req, res) => {
  console.log(req.body);
  const {
    email,
    password,
    firstname,
    lastname,
    phone,
    personal_id,
    address,
    birthdate,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const body = {
    email: email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    personal_id: personal_id,
    address: address,
    birthdate: birthdate,
  };
  const user = await UserService.createUser(body);
  console.log(user);
  res.send(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.findByEmail(email);
  if (!user) {
    res.sendStatus(401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.sendStatus(401);
  }
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_KEY,
    {
      expiresIn: '1h',
    },
    (err, token) => {
      if (err) {
        res.sendStatus(500);
      }
      res.json({ token });
    }
  );
});

router.put('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserService.updateUser(id, req.body);
  if (!user) {
    res.sendStatus(404);
  }
  res.send(user);
});

router.delete('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserService.deleteUser(id);
  if (!user) {
    res.sendStatus(404);
  }
  res.send(user);
});

router.post('/logout', checkAuth, (req, res) => {});

module.exports = router;
