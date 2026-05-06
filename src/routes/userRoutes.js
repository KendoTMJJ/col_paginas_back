const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.listUsers
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.createUser
);

router.put(
  '/:id/password',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.changeUserPasswordByAdmin
);

module.exports = router;
