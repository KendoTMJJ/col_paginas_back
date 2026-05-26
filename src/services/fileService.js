const fileRepository = require('../repositories/fileRepository');
const supabase = require('../config/supabase');

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

const getFiles = async (user) => {
  if (user.rol === 'superadmin') return await fileRepository.findAllFiles();
  return await fileRepository.findFilesByCountry(user.pais_id);
};

const getPublicFilesByCountry = async (countrySlug) => {
  if (!countrySlug) throw new Error('El país es obligatorio');
  return await fileRepository.findFilesByCountrySlug(countrySlug);
};

const getFileById = async (id, user) => {
  const file = await fileRepository.findFileById(id);
  if (!file) throw new Error('Archivo no encontrado');

  if (user.rol !== 'superadmin' && Number(file.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para ver este archivo');
  }

  return file;
};

const registerFile = async (payload, user) => {
  const { nombre, nombre_original, tipo_mime, tamano, url, pais_id } = payload;

  if (!nombre || !url || !tipo_mime || !tamano) {
    throw new Error('Nombre, URL, tipo de archivo y tamaño son obligatorios');
  }

  if (!ALLOWED_MIME_TYPES.includes(tipo_mime)) throw new Error('Tipo de archivo no permitido');

  let finalPaisId = pais_id;
  if (user.rol !== 'superadmin') finalPaisId = user.pais_id;
  if (!finalPaisId) throw new Error('El país es obligatorio para registrar un archivo');

  return await fileRepository.createFile({
    nombre,
    nombre_original: nombre_original || nombre,
    tipo_mime,
    tamano: Number(tamano),
    url,
    pais_id: finalPaisId,
    subido_por: user.id,
  });
};

const uploadFile = async (file, payload, user) => {
  const { nombre } = payload;

  if (!nombre) throw new Error('El nombre del archivo es obligatorio');

  let finalPaisId = payload.pais_id;
  if (user.rol !== 'superadmin') finalPaisId = user.pais_id;
  if (!finalPaisId) throw new Error('El país es obligatorio');

  const safeName = file.originalname.replace(/[^a-z0-9._-]/gi, '_');
  const filePath = `archivos/${finalPaisId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('cms-media')
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from('cms-media').getPublicUrl(filePath);

  const record = await fileRepository.createFile({
    nombre,
    nombre_original: file.originalname,
    tipo_mime: file.mimetype,
    tamano: file.size,
    url: publicUrl,
    pais_id: finalPaisId,
    subido_por: user.id,
  });

  return { message: 'Archivo subido correctamente', data: record };
};

const updateFile = async (id, payload, user) => {
  const file = await fileRepository.findFileById(id);
  if (!file) throw new Error('Archivo no encontrado');

  if (user.rol !== 'superadmin' && Number(file.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para editar este archivo');
  }

  const allowedFields = ['nombre', 'nombre_original', 'url', 'tipo_mime', 'tamano'];
  const updatePayload = {};
  allowedFields.forEach((f) => { if (payload[f] !== undefined) updatePayload[f] = payload[f]; });

  if (Object.keys(updatePayload).length === 0) {
    throw new Error('No se proporcionaron campos válidos para actualizar');
  }

  updatePayload.updated_at = new Date().toISOString();
  const updated = await fileRepository.updateFile(id, updatePayload);
  return { message: 'Archivo actualizado correctamente', data: updated };
};

const deleteFile = async (id, user) => {
  const file = await fileRepository.findFileById(id);
  if (!file) throw new Error('Archivo no encontrado');

  if (user.rol !== 'superadmin' && Number(file.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para eliminar este archivo');
  }

  await fileRepository.deleteFile(id);
  return { message: 'Archivo eliminado correctamente' };
};

module.exports = {
  getFiles,
  getPublicFilesByCountry,
  getFileById,
  registerFile,
  uploadFile,
  updateFile,
  deleteFile,
};