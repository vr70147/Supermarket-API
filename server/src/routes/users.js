const express = require('express');
const UserService = require('../services/user-service');
const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await UserService.find();
  res.send(users);
});
