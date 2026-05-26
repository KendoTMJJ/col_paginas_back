const supabase = require('../config/supabase');

const findAllUsers = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      created_at,
      roles (
        id,
        nombre
      ),
      paises (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

const findUserById = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      rol_id,
      pais_id,
      created_at,
      roles (
        id,
        nombre
      ),
      paises (
        id,
        nombre,
        codigo,
        slug
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findUserByIdRaw = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, apellido, email, username, estado, rol_id, pais_id')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const findUserByUsernameOrEmail = async (username, email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username, email')
    .or(`username.eq.${username},email.eq.${email}`)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

const createUser = async (payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([payload])
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      created_at
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateUser = async (id, payload) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id', id)
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado,
      rol_id,
      pais_id
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const updateUserPassword = async (id, passwordHash) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({
      password_hash: passwordHash,
      password_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      id,
      nombre,
      apellido,
      email,
      username,
      estado
    `)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

const deleteUser = async (id) => {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

module.exports = {
  findAllUsers,
  findUserById,
  findUserByIdRaw,
  findUserByUsernameOrEmail,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
