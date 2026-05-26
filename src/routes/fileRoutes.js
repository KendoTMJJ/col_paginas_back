const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get(
  '/public/:countrySlug',
  fileController.listPublicFiles
);

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

// POST /upload debe ir ANTES de POST / para no ser eclipsado
router.post(
  '/upload',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  upload.single('archivo'),
  fileController.uploadFile
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  fileController.registerFile
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  fileController.updateFile
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  fileController.deleteFile
);

module.exports = router;