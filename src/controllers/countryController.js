const countryService = require('../services/countryService');
const auditService = require('../services/auditService');

const listCountries = async (req, res) => {
  try {
    return res.status(200).json(await countryService.getCountries());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listActiveCountries = async (req, res) => {
  try {
    return res.status(200).json(await countryService.getActiveCountries());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCountry = async (req, res) => {
  try {
    return res.status(200).json(await countryService.getCountryById(req.params.id));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getPublicCountryBySlug = async (req, res) => {
  try {
    return res.status(200).json(await countryService.getCountryBySlug(req.params.slug));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const createCountry = async (req, res) => {
  try {
    const country = await countryService.createCountry(req.body);
    auditService.register({
      usuario_id: req.user.id, accion: 'CREAR', modulo: 'paises',
      registro_id: country.id, descripcion: `País creado: ${country.nombre}`, ip: req.ip,
    }).catch(() => {});
    return res.status(201).json({ message: 'País creado correctamente', data: country });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCountry = async (req, res) => {
  try {
    const country = await countryService.updateCountry(req.params.id, req.body);
    auditService.register({
      usuario_id: req.user.id, accion: 'ACTUALIZAR', modulo: 'paises',
      registro_id: req.params.id, descripcion: `País actualizado: ${country.nombre}`, ip: req.ip,
    }).catch(() => {});
    return res.status(200).json({ message: 'País actualizado correctamente', data: country });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const toggleCountryStatus = async (req, res) => {
  try {
    const country = await countryService.toggleCountryStatus(req.params.id, req.body.estado);
    auditService.register({
      usuario_id: req.user.id, accion: 'CAMBIAR_ESTADO', modulo: 'paises',
      registro_id: req.params.id, descripcion: `Estado de país cambiado a: ${req.body.estado}`, ip: req.ip,
    }).catch(() => {});
    return res.status(200).json({ message: 'Estado del país actualizado correctamente', data: country });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const uploadCountryLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    const result = await countryService.uploadLogo(req.params.id, req.file);
    auditService.register({
      usuario_id: req.user.id, accion: 'SUBIR_LOGO', modulo: 'paises',
      registro_id: req.params.id, descripcion: `Logo subido al país con id: ${req.params.id}`, ip: req.ip,
    }).catch(() => {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listCountries,
  listActiveCountries,
  getCountry,
  getPublicCountryBySlug,
  createCountry,
  updateCountry,
  toggleCountryStatus,
  uploadCountryLogo,
};
