const newsService = require('../services/newsService');
const auditService = require('../services/auditService');

const listNews = async (req, res) => {
  try {
    const news = await newsService.getNews(req.user);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getNewsItem = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsService.getNewsById(id, req.user);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const listPublicNews = async (req, res) => {
  try {
    const { countrySlug } = req.params;

    const news = await newsService.getPublicNewsByCountry(countrySlug);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPublicNewsDetail = async (req, res) => {
  try {
    const { countrySlug, newsSlug } = req.params;

    const news = await newsService.getPublicNewsDetail(countrySlug, newsSlug);

    return res.status(200).json(news);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await newsService.createNews(req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CREAR',
      modulo: 'noticias',
      registro_id: news.id,
      descripcion: `Noticia creada: ${news.titulo}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json({
      message: 'Noticia creada correctamente',
      data: news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsService.updateNews(id, req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ACTUALIZAR',
      modulo: 'noticias',
      registro_id: id,
      descripcion: `Noticia actualizada: ${news.titulo}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Noticia actualizada correctamente',
      data: news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const toggleNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const news = await newsService.toggleNewsStatus(id, estado, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_ESTADO',
      modulo: 'noticias',
      registro_id: id,
      descripcion: `Estado de noticia cambiado a: ${estado}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Estado de la noticia actualizado correctamente',
      data: news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await newsService.deleteNews(id, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ELIMINAR',
      modulo: 'noticias',
      registro_id: id,
      descripcion: `Noticia eliminada con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listNews,
  getNewsItem,
  listPublicNews,
  getPublicNewsDetail,
  createNews,
  updateNews,
  toggleNewsStatus,
  deleteNews,
};
