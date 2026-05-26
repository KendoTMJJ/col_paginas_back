const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/stats',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  dashboardController.getStats
);

module.exports = router;
