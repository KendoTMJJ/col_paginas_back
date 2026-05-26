const testimonialRepository = require('../repositories/testimonialRepository');
const supabase = require('../config/supabase');

const getTestimonials = async (user) => {
  if (user.rol === 'superadmin') return await testimonialRepository.findAllTestimonials();
  return await testimonialRepository.findTestimonialsByCountry(user.pais_id);
};

const getTestimonialById = async (id, user) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);
  if (!testimonial) throw new Error('El testimonio no existe');

  if (user.rol !== 'superadmin' && Number(testimonial.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para ver este testimonio');
  }

  return testimonial;
};

const getPublicTestimonialsByCountry = async (countrySlug) => {
  if (!countrySlug) throw new Error('El país es obligatorio');
  return await testimonialRepository.findPublishedTestimonialsByCountrySlug(countrySlug);
};

const createTestimonial = async (payload, user) => {
  const {
    nombre, cargo, empresa, contenido, foto_url,
    instagram_url, facebook_url, estado = 'borrador', destacado = false, pais_id,
  } = payload;

  if (!nombre || !contenido || !foto_url) throw new Error('Nombre, contenido y foto son obligatorios');

  let finalPaisId = pais_id;
  if (user.rol !== 'superadmin') finalPaisId = user.pais_id;
  if (!finalPaisId) throw new Error('El país es obligatorio para crear un testimonio');

  const finalEstado = estado || 'borrador';
  const fecha_publicacion = finalEstado === 'publicado' ? new Date().toISOString() : null;

  return await testimonialRepository.createTestimonial({
    pais_id: finalPaisId,
    nombre,
    cargo: cargo || null,
    empresa: empresa || null,
    contenido,
    foto_url,
    instagram_url: instagram_url || null,
    facebook_url: facebook_url || null,
    estado: finalEstado,
    destacado: Boolean(destacado),
    autor_id: user.id,
    fecha_publicacion,
  });
};

const updateTestimonial = async (id, payload, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);
  if (!existingTestimonial) throw new Error('El testimonio no existe');

  if (user.rol !== 'superadmin' && Number(existingTestimonial.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }

  const allowedFields = [
    'nombre', 'cargo', 'empresa', 'contenido', 'foto_url',
    'instagram_url', 'facebook_url', 'estado', 'destacado', 'pais_id',
  ];

  const updatePayload = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) updatePayload[field] = payload[field];
  });

  if (user.rol !== 'superadmin') updatePayload.pais_id = user.pais_id;

  if (payload.estado === 'publicado' && existingTestimonial.estado !== 'publicado') {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }
  if (payload.estado && payload.estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  updatePayload.updated_at = new Date().toISOString();
  return await testimonialRepository.updateTestimonial(id, updatePayload);
};

const toggleTestimonialStatus = async (id, estado, user) => {
  const existing = await testimonialRepository.findTestimonialById(id);
  if (!existing) throw new Error('El testimonio no existe');

  if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }

  const allowedStates = ['borrador', 'publicado'];
  if (!estado || !allowedStates.includes(estado)) {
    throw new Error('Estado no válido. Use "borrador" o "publicado"');
  }

  const updatePayload = { estado, updated_at: new Date().toISOString() };

  if (estado === 'publicado' && existing.estado !== 'publicado') {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }
  if (estado === 'borrador') updatePayload.fecha_publicacion = null;

  return await testimonialRepository.updateTestimonial(id, updatePayload);
};

const uploadPhoto = async (id, file, user) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);
  if (!testimonial) throw new Error('El testimonio no existe');

  if (user.rol !== 'superadmin' && Number(testimonial.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para editar este testimonio');
  }

  const ext = file.originalname.split('.').pop().toLowerCase();
  const filePath = `testimonios/${id}/foto_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('cms-media')
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(filePath);

  const updated = await testimonialRepository.updateTestimonial(id, {
    foto_url: publicUrl,
    updated_at: new Date().toISOString(),
  });

  return { message: 'Foto subida correctamente', url: publicUrl, data: updated };
};

const deleteTestimonial = async (id, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);
  if (!existingTestimonial) throw new Error('El testimonio no existe');

  if (user.rol !== 'superadmin' && Number(existingTestimonial.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para eliminar este testimonio');
  }
  if (user.rol === 'editor') throw new Error('El editor no tiene permisos para eliminar testimonios');

  await testimonialRepository.deleteTestimonial(id);
  return { message: 'Testimonio eliminado correctamente' };
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  getPublicTestimonialsByCountry,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialStatus,
  uploadPhoto,
  deleteTestimonial,
};