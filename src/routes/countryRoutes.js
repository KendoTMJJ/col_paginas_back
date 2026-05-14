const express = require('express');
const router = express.Router();

const countryController = require('../controllers/countryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/active',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  countryController.listActiveCountries
);

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.listCountries
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.getCountry
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.createCountry
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.updateCountry
);

router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin'),
  countryController.toggleCountryStatus
);

module.exports = router;
