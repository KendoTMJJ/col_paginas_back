const countryRepository = require('../repositories/countryRepository');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getCountries = async () => {
  return await countryRepository.findAllCountries();
};

const getActiveCountries = async () => {
  return await countryRepository.findActiveCountries();
};

const getCountryById = async (id) => {
  const country = await countryRepository.findCountryById(id);

  if (!country) {
    throw new Error('País no encontrado');
  }

  return country;
};

const createCountry = async (payload) => {
  const { nombre, codigo, slug, estado = 'activo' } = payload;

  if (!nombre || !codigo) {
    throw new Error('Nombre y código son obligatorios');
  }

  const finalSlug = slug || generateSlug(nombre);

  return await countryRepository.createCountry({
    nombre,
    codigo: codigo.toUpperCase(),
    slug: finalSlug,
    estado,
  });
};

const updateCountry = async (id, payload) => {
  const existing = await countryRepository.findCountryById(id);

  if (!existing) {
    throw new Error('País no encontrado');
  }

  const allowedFields = ['nombre', 'codigo', 'slug', 'estado'];
  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updatePayload[field] = payload[field];
    }
  });

  if (updatePayload.codigo) {
    updatePayload.codigo = updatePayload.codigo.toUpperCase();
  }

  if (updatePayload.nombre && !updatePayload.slug) {
    updatePayload.slug = generateSlug(updatePayload.nombre);
  }

  return await countryRepository.updateCountry(id, updatePayload);
};

const toggleCountryStatus = async (id, estado) => {
  const existing = await countryRepository.findCountryById(id);

  if (!existing) {
    throw new Error('País no encontrado');
  }

  const allowedStates = ['activo', 'inactivo'];

  if (!estado || !allowedStates.includes(estado)) {
    throw new Error('Estado no válido. Use "activo" o "inactivo"');
  }

  return await countryRepository.updateCountry(id, { estado });
};

module.exports = {
  getCountries,
  getActiveCountries,
  getCountryById,
  createCountry,
  updateCountry,
  toggleCountryStatus,
};
