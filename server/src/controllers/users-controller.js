const express = require('express');
const UserService = require('../services/user-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid').v4;
const session = require('express-session');

const whoAmI = (req, res) => {
  //Check if user is logged in
  res.send(req.session);
};
const getUsers = async (req, res) => {
  const query = req.params;
  if (!query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const users = await UserService.find(query.pageNumber, query.pageSize);
  if (!users) {
    return null;
  }
  res.send(users);
};

const getUser = async (req, res) => {
  const id = req.params;
  const user = await UserService.findById(id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
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

  //Check if user already exists
  const user = await UserService.findByEmail(req.body.email);
  if (user) return res.status(409).send({ error: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const body = {
    role: 'user',
    email: email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    personal_id: personal_id,
    address: address,
    birthdate: birthdate,
  };
  const createUser = await UserService.addUser(body);
  res.send(createUser);
};

const addAdmin = async (req, res) => {
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
  //Check if user already exists
  const user = await UserService.findByEmail(req.body.email);
  if (user) return res.status(409).send({ error: 'User already exists' });

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const body = {
    role: 'admin',
    email: email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    personal_id: personal_id,
    address: address,
    birthdate: birthdate,
  };
  const createAdmin = await UserService.addUser(body);
  res.send(createAdmin);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.findByEmail(email);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ error: 'Invalid password' });
  }
  req.session.user = user;
  req.session.id = uuidv4();
  req.session.authorized = true;
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_KEY,
    {
      expiresIn: '1h',
    },
    (err, token) => {
      if (err) {
        return res.status(500).send(err);
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

const logout = async (req, res) => {
  req.session.destroy();
  res.send({ message: 'Logged out successfully' });
};

module.exports = {
  whoAmI,
  getUsers,
  getUser,
  addUser,
  addAdmin,
  login,
  updateUser,
  deleteUser,
  logout,
};
