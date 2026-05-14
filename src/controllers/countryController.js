const countryService = require('../services/countryService');
const auditService = require('../services/auditService');

const listCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries();

    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const listActiveCountries = async (req, res) => {
  try {
    const countries = await countryService.getActiveCountries();

    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await countryService.getCountryById(id);

    return res.status(200).json(country);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const createCountry = async (req, res) => {
  try {
    const country = await countryService.createCountry(req.body);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CREAR',
      modulo: 'paises',
      registro_id: country.id,
      descripcion: `País creado: ${country.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json({
      message: 'País creado correctamente',
      data: country,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await countryService.updateCountry(id, req.body);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ACTUALIZAR',
      modulo: 'paises',
      registro_id: id,
      descripcion: `País actualizado: ${country.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'País actualizado correctamente',
      data: country,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const toggleCountryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const country = await countryService.toggleCountryStatus(id, estado);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_ESTADO',
      modulo: 'paises',
      registro_id: id,
      descripcion: `Estado de país cambiado a: ${estado}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Estado del país actualizado correctamente',
      data: country,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listCountries,
  listActiveCountries,
  getCountry,
  createCountry,
  updateCountry,
  toggleCountryStatus,
};
