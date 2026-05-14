const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/*
  RUTAS PÚBLICAS
*/

router.get(
  '/public/:countrySlug',
  fileController.listPublicFiles
);

/*
  RUTAS ADMINISTRATIVAS
*/

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  fileController.listFiles
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  fileController.getFile
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  fileController.registerFile
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  fileController.deleteFile
);

module.exports = router;
