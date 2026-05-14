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

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.getUser
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.createUser
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.updateUser
);

router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.toggleUserStatus
);

router.put(
  '/:id/password',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.changeUserPasswordByAdmin
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.deleteUser
);

module.exports = router;
