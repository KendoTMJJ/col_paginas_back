const supabase = require('../config/supabase');

const DETAIL_SELECT = `
  id,
  nombre,
  nombre_original,
  tipo_mime,
  tamano,
  url,
  created_at,
  paises (
    id,
    nombre,
    codigo,
    slug
  ),
  usuarios (
    id,
    nombre,
    apellido,
    email
  )
`;

const findAllFiles = async () => {
  const { data, error } = await supabase
    .from('archivos')
    .select(DETAIL_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findFilesByCountry = async (paisId) => {
  const { data, error } = await supabase
    .from('archivos')
    .select(DETAIL_SELECT)
    .eq('pais_id', paisId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findFilesByCountrySlug = async (countrySlug) => {
  const { data, error } = await supabase
    .from('archivos')
    .select(`
      id,
      nombre,
      nombre_original,
      tipo_mime,
      tamano,
      url,
      created_at,
      paises!inner (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .eq('paises.slug', countrySlug)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

const findFileById = async (id) => {
  const { data, error } = await supabase
    .from('archivos')
    .select(DETAIL_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createFile = async (payload) => {
  const { data, error } = await supabase
    .from('archivos')
    .insert([payload])
    .select(DETAIL_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteFile = async (id) => {
  const { error } = await supabase
    .from('archivos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = {
  findAllFiles,
  findFilesByCountry,
  findFilesByCountrySlug,
  findFileById,
  createFile,
  deleteFile,
};
