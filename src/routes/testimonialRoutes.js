const express = require('express');
const router = express.Router();

const testimonialController = require('../controllers/testimonialController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get(
  '/public/:countrySlug',
  testimonialController.listPublicTestimonials
);

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.listTestimonials
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.getTestimonial
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.createTestimonial
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonial
);

// Editor incluido — corrige bug anterior que lo excluía
router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.toggleTestimonialStatus
);

router.patch(
  '/:id/photo',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  upload.single('foto'),
  testimonialController.uploadTestimonialPhoto
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  testimonialController.deleteTestimonial
);

module.exports = router;