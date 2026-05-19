const supabase = require('../config/supabase');

const findUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id, nombre, apellido, email, username, password_hash,
      pregunta_seguridad, respuesta_seguridad_hash, estado, pais_id,
      roles ( id, nombre ),
      paises ( id, nombre, codigo, slug )
    `)
    .eq('username', username)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const findUserByUsernameOrEmail = async (identifier) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id, nombre, apellido, email, username,
      pregunta_seguridad, respuesta_seguridad_hash, estado
    `)
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const updatePassword = async (userId, passwordHash) => {
  const { error } = await supabase
    .from('usuarios')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};

const updateLastAccess = async (userId) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};

const updateSecurityQuestion = async (userId, pregunta, respuestaHash) => {
  const { error } = await supabase
    .from('usuarios')
    .update({
      pregunta_seguridad: pregunta,
      respuesta_seguridad_hash: respuestaHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};

const updateProfile = async (userId, payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', userId)
    .select('id, nombre, apellido, email, username')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = {
  findUserByUsername,
  findUserByUsernameOrEmail,
  updatePassword,
  updateLastAccess,
  updateSecurityQuestion,
  updateProfile,
};