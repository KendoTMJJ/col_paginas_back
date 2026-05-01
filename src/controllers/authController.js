const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const tokenBlacklist = require('../utils/tokenBlacklist');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { exp } = jwt.decode(token);
  tokenBlacklist.add(token, exp);
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = {
  login,
  logout,
};