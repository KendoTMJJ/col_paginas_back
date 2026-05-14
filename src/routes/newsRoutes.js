const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/*
  RUTAS PÚBLICAS
  No requieren login.
  Solo devuelven noticias publicadas.
*/

router.get(
  '/public/:countrySlug',
  newsController.listPublicNews
);

router.get(
  '/public/:countrySlug/:newsSlug',
  newsController.getPublicNewsDetail
);

/*
  RUTAS ADMINISTRATIVAS
  Requieren JWT y rol autorizado.
*/

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  newsController.listNews
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  newsController.getNewsItem
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  newsController.createNews
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  newsController.updateNews
);

router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  newsController.toggleNewsStatus
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  newsController.deleteNews
);

module.exports = router;
