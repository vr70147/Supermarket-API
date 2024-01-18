const express = require('express');
const UserService = require('../services/user-service');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const uuidv4 = require('uuid').v4;
const sessions = {};

const getUsers = async (req, res) => {
  const users = await UserService.find();
  if (!users) {
    return res.status(404).send({ error: 'Users not found' });
  }
  res.send(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.findById(id);
  if (!user) {
    res.status(404).send({ error: 'User not found' });
  }
  res.send(user);
};

const addUser = async (req, res) => {
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
  if (
    !email ||
    !password ||
    !firstname ||
    !lastname ||
    !phone ||
    !personal_id ||
    !address ||
    !birthdate
  ) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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
  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.findByEmail(email);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  const sessionId = uuidv4();
  sessions[sessionId] = { email: email, userId: user.id };
  res.set('Set-Cookie', `session=${sessionId}`);
  res.sendStatus(200);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ error: 'Invalid password' });
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
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.updateUser(id, req.body);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.send(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.deleteUser(id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.send(user);
};

// const logout = async (req, res) => {
//   const { id } = req.body;
// };

module.exports = {
  getUsers,
  getUser,
  addUser,
  login,
  updateUser,
  deleteUser,
};
