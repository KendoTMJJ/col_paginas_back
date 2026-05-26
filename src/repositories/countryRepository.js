const supabase = require('../config/supabase');

const FIELDS = 'id, nombre, codigo, slug, estado, flag, tagline, descripcion_publica, valores, color_primario, color_secundario, color_acento, color_oscuro, logo_url, created_at';

const findAllCountries = async () => {
  const { data, error } = await supabase
    .from('paises')
    .select(FIELDS)
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const findActiveCountries = async () => {
  const { data, error } = await supabase
    .from('paises')
    .select(FIELDS)
    .eq('estado', 'activo')
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const findCountryById = async (id) => {
  const { data, error } = await supabase
    .from('paises')
    .select(FIELDS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const findCountryBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('paises')
    .select(FIELDS)
    .eq('slug', slug)
    .eq('estado', 'activo')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const createCountry = async (payload) => {
  const { data, error } = await supabase
    .from('paises')
    .insert([payload])
    .select(FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updateCountry = async (id, payload) => {
  const { data, error } = await supabase
    .from('paises')
    .update(payload)
    .eq('id', id)
    .select(FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = {
  findAllCountries,
  findActiveCountries,
  findCountryById,
  findCountryBySlug,
  createCountry,
  updateCountry,
};
