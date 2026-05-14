const express = require('express');
const router = express.Router();

const auditController = require('../controllers/auditController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  auditController.listAuditEntries
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  auditController.getAuditEntry
);

module.exports = router;
