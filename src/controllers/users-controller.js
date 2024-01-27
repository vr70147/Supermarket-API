const UserService = require('../services/user-service');
const CartsService = require('../services/carts-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../auth/jwt-helper');
require('dotenv').config();

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
  //add user to database
  const createAdmin = await UserService.addUser(body);
  res.send([createAdmin]);
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
  const dataToSendToken = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(dataToSendToken);
  const refreshToken = jwt.sign(
    dataToSendToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const createToken = await UserService.addToken(refreshToken);
  if (!createToken) {
    return res.status(500).send({ error: 'Failed to create token' });
  }
  const userId = user.id;
  const checkCartExists = await CartsService.checkCartExists(userId);
  if (!checkCartExists) {
    await CartsService.addCart(userId);
  }
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
};

const logout = async (req, res) => {
  await UserService.deleteToken(req.body.token);
  return res.status(204).send();
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

const refreshToken = async (req, res) => {
  //Get refresh token from client
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return res.status(401).send({ error: 'Refresh token not provided' });
  }

  //check refresh token in db
  const checkRefreshToken = await UserService.findToken(refreshToken);

  if (checkRefreshToken == {} || checkRefreshToken.length == 0) {
    return res.status(403).send({ error: 'Invalid refresh token' });
  }

  //Verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: 'Invalid refresh token' });
    }
    const accessToken = generateAccessToken({
      userId: user.userId,
      email: user.email,
    });
    res.json({ accessToken: accessToken });
  });
};

const addToken = async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  const userToken = await UserService.addToken(id, token);
  if (!user) {
    return res.status(409).send({ error: 'Token already exists' });
  }
  res.send(userToken);
};

module.exports = {
  addToken,
  refreshToken,
  getUsers,
  getUser,
  addUser,
  addAdmin,
  login,
  logout,
  updateUser,
  deleteUser,
};
