const countryRepository = require('../repositories/countryRepository');
const supabase = require('../config/supabase');

const BRANDING_FIELDS = [
  'nombre', 'codigo', 'slug', 'estado',
  'flag', 'tagline', 'descripcion_publica', 'valores',
  'color_primario', 'color_secundario', 'color_acento', 'color_oscuro',
];

const generateSlug = (text) =>
  text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-');

const getCountries = async () => countryRepository.findAllCountries();

const getActiveCountries = async () => countryRepository.findActiveCountries();

const getCountryById = async (id) => {
  const country = await countryRepository.findCountryById(id);
  if (!country) throw new Error('País no encontrado');
  return country;
};

const getCountryBySlug = async (slug) => {
  const country = await countryRepository.findCountryBySlug(slug);
  if (!country) throw new Error('País no encontrado');
  return country;
};

const createCountry = async (payload) => {
  const { nombre, codigo, slug, estado = 'activo' } = payload;
  if (!nombre || !codigo) throw new Error('Nombre y código son obligatorios');

  const finalSlug = slug || generateSlug(nombre);
  const brandingData = {};
  BRANDING_FIELDS.forEach((f) => {
    if (payload[f] !== undefined && !['nombre','codigo','slug','estado'].includes(f)) {
      brandingData[f] = payload[f];
    }
  });

  return await countryRepository.createCountry({
    nombre,
    codigo: codigo.toUpperCase(),
    slug: finalSlug,
    estado,
    ...brandingData,
  });
};

const updateCountry = async (id, payload) => {
  const existing = await countryRepository.findCountryById(id);
  if (!existing) throw new Error('País no encontrado');

  const updatePayload = {};
  BRANDING_FIELDS.forEach((field) => {
    if (payload[field] !== undefined) updatePayload[field] = payload[field];
  });

  if (updatePayload.codigo) updatePayload.codigo = updatePayload.codigo.toUpperCase();
  if (updatePayload.nombre && !updatePayload.slug) {
    updatePayload.slug = generateSlug(updatePayload.nombre);
  }
  // valores puede venir como string CSV desde el form — normalizar a array
  if (typeof updatePayload.valores === 'string') {
    updatePayload.valores = updatePayload.valores.split(',').map(v => v.trim()).filter(Boolean);
  }

  return await countryRepository.updateCountry(id, updatePayload);
};

const toggleCountryStatus = async (id, estado) => {
  const existing = await countryRepository.findCountryById(id);
  if (!existing) throw new Error('País no encontrado');
  if (!['activo', 'inactivo'].includes(estado)) {
    throw new Error('Estado no válido. Use "activo" o "inactivo"');
  }
  return await countryRepository.updateCountry(id, { estado });
};

const uploadLogo = async (id, file) => {
  const country = await countryRepository.findCountryById(id);
  if (!country) throw new Error('País no encontrado');

  const ext = file.originalname.split('.').pop().toLowerCase();
  const filePath = `paises/${id}/logo_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('cms-media')
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(filePath);

  const updated = await countryRepository.updateCountry(id, {
    logo_url: publicUrl,
    updated_at: new Date().toISOString(),
  });

  return { message: 'Logo subido correctamente', url: publicUrl, data: updated };
};

module.exports = {
  getCountries,
  getActiveCountries,
  getCountryById,
  getCountryBySlug,
  createCountry,
  updateCountry,
  toggleCountryStatus,
  uploadLogo,
};
