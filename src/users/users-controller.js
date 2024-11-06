const UserService = require('./user-service');

const getUsers = async (req, res, next) => {
  try {
    const { pageNumber, pageSize, orderBy, sort } = req.query;
    const { where, columns } = req.body;

    if (!pageNumber || !pageSize || !where || !columns) {
      return res.status(400).send({ error: 'Missing parameters' });
    }
    console.log(columns);
    const users = await UserService.find(
      pageNumber,
      pageSize,
      where,
      columns,
      orderBy,
      sort
    );
    if (!users.length) {
      return res.status(404).send({ error: 'No users found' });
    }

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const newUser = await UserService.addUser(req.body);
    if (!newUser) {
      return res
        .status(400)
        .send({ error: 'Missing parameters or invalid data' });
    }
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await UserService.loginUser(email, password);
    if (!user) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ error: 'Token is required' });
    }

    await UserService.deleteToken(token);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ error: 'User ID is required' });
    }

    const updatedUser = await UserService.updateUser(id, req.body);
    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ error: 'User ID is required' });
    }

    const deletedUser = await UserService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(deletedUser);
  } catch (error) {
    next(error);
  }
};

const checkRefreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ error: 'Refresh token is required' });
    }

    const accessToken = await UserService.checkRefreshToken(token);
    if (!accessToken) {
      return res.status(401).send({ error: 'Invalid refresh token' });
    }
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const addRefreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ error: 'Token is required' });
    }

    const addedToken = await UserService.addRefreshToken(token);
    if (!addedToken) {
      return res.status(409).send({ error: 'Token already exists' });
    }
    res.status(201).send(addedToken);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRefreshToken,
  checkRefreshToken,
  getUsers,
  addUser,
  login,
  logout,
  updateUser,
  deleteUser,
};
