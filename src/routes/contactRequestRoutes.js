const express = require('express');
const router = express.Router();

const contactRequestController = require('../controllers/contactRequestController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.post(
  '/public',
  contactRequestController.createPublicRequest
);

// Editor no gestiona contactos (corrige bug anterior)
router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.listRequests
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.getRequest
);

router.put(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.updateRequestStatus
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  contactRequestController.deleteRequest
);

module.exports = router;