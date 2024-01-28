const UserService = require('./user-service');

const getUsers = async (req, res) => {
  if (!req.body || !req.query) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  const users = await UserService.find(
    req.query.pageNumber,
    req.query.pageSize,
    req.body.where,
    req.body.columns,
    req.query.orderBy,
    req.query.sort
  );
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
  const createUser = await UserService.addUser(req.body);
  if (!createUser) {
    return res.status(400).send({ error: 'Missing parameters' });
  }
  res.send(createUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.loginUser(email, password);
  if (!user) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }
  res.json(user);
};

const logout = async (req, res) => {
  await UserService.pool.query(
    'DELETE FROM tokens WHERE token = $1 RETURNING token',
    [req.token]
  );
  return res.status(204).send();
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.pool.query(
    'UPDATE users SET email = $1, password = $2, firstname = $3, lastname = $4, phone = $5, personal_id = $6, address = $7, birthdate = $8 WHERE id = $9 RETURNING email, firstname, lastname, phone, address, birthdate',
    [
      req.body.email,
      req.body.password,
      req.body.firstname,
      req.body.lastname,
      req.body.phone,
      req.body.personal_id,
      req.body.address,
      req.body.birthdate,
      id,
    ]
  );
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.send(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserService.pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING email, firstname',
    [id]
  );
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.send(user);
};

const checkRefreshToken = async (req, res) => {
  //Get refresh token from client
  const { bodyRefreshToken } = req.body.token;
  const getAccessToken = await UserService.checkRefreshToken(bodyRefreshToken);
  if (!getAccessToken) {
    return res.status(401).send({ error: 'Invalid refresh token' });
  }
  res.json({ accessToken: getAccessToken });
};

const addRefreshToken = async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  const userToken = await pool.query(
    'INSERT INTO tokens (token) VALUES ($1) RETURNING *',
    [token]
  );
  if (!userToken) {
    return res.status(409).send({ error: 'Token already exists' });
  }
  res.send(userToken);
};

module.exports = {
  addRefreshToken,
  checkRefreshToken,
  getUsers,
  getUser,
  addUser,
  login,
  logout,
  updateUser,
  deleteUser,
};
