const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const tokenBlacklist = require('../utils/tokenBlacklist');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { exp } = jwt.decode(token);
  tokenBlacklist.add(token, exp);
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const changeOwnPassword = async (req, res) => {
  try {
    const result = await authService.changeOwnPassword(req.user, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOwnProfile = async (req, res) => {
  try {
    const result = await authService.updateOwnProfile(req.user, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateSecurityQuestion = async (req, res) => {
  try {
    const result = await authService.updateSecurityQuestion(req.user, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getMySecurityQuestion = async (req, res) => {
  try {
    const result = await authService.getMySecurityQuestion(req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  changeOwnPassword,
  updateOwnProfile,
  updateSecurityQuestion,
  getMySecurityQuestion,
};