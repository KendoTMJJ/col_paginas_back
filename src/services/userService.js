const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.findAllUsers();
};

const createUser = async (payload) => {
  const {
    nombre,
    apellido,
    email,
    username,
    password,
    rol_id,
    pais_id,
    pregunta_seguridad,
    respuesta_seguridad,
  } = payload;

  if (!nombre || !apellido || !email || !username || !password || !rol_id) {
    throw new Error('Nombre, apellido, email, username, password y rol son obligatorios');
  }

  if (!pregunta_seguridad || !respuesta_seguridad) {
    throw new Error('La pregunta y respuesta de seguridad son obligatorias');
  }

  const existingUser = await userRepository.findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese username o email');
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const respuesta_seguridad_hash = bcrypt.hashSync(respuesta_seguridad, 10);

  return await userRepository.createUser({
    nombre,
    apellido,
    email,
    username,
    password_hash,
    rol_id,
    pais_id: pais_id || null,
    pregunta_seguridad,
    respuesta_seguridad_hash,
    estado: 'activo',
    password_updated_at: new Date().toISOString(),
  });
};

const changeUserPasswordByAdmin = async (id, payload) => {
  const { nueva_password } = payload;

  if (!nueva_password) {
    throw new Error('La nueva contraseña es obligatoria');
  }

  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const passwordHash = bcrypt.hashSync(nueva_password, 10);

  const updatedUser = await userRepository.updateUserPassword(id, passwordHash);

  return {
    message: 'Contraseña actualizada correctamente por el administrador',
    data: updatedUser,
  };
};

module.exports = {
  getUsers,
  createUser,
  changeUserPasswordByAdmin,
};
