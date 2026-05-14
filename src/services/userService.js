const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const getUsers = async () => {
  return await userRepository.findAllUsers();
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
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

const updateUser = async (id, payload) => {
  const existing = await userRepository.findUserByIdRaw(id);

  if (!existing) {
    throw new Error('Usuario no encontrado');
  }

  const allowedFields = ['nombre', 'apellido', 'email', 'pais_id', 'rol_id'];
  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updatePayload[field] = payload[field];
    }
  });

  if (Object.keys(updatePayload).length === 0) {
    throw new Error('No se proporcionaron campos válidos para actualizar');
  }

  updatePayload.updated_at = new Date().toISOString();

  const updated = await userRepository.updateUser(id, updatePayload);

  return {
    message: 'Usuario actualizado correctamente',
    data: updated,
  };
};

const toggleUserStatus = async (id, estado) => {
  const existing = await userRepository.findUserByIdRaw(id);

  if (!existing) {
    throw new Error('Usuario no encontrado');
  }

  const allowedStates = ['activo', 'inactivo'];

  if (!estado || !allowedStates.includes(estado)) {
    throw new Error('Estado no válido. Use "activo" o "inactivo"');
  }

  const updated = await userRepository.updateUser(id, {
    estado,
    updated_at: new Date().toISOString(),
  });

  return {
    message: 'Estado del usuario actualizado correctamente',
    data: updated,
  };
};

const changeUserPasswordByAdmin = async (id, payload) => {
  const { nueva_password } = payload;

  if (!nueva_password) {
    throw new Error('La nueva contraseña es obligatoria');
  }

  const user = await userRepository.findUserByIdRaw(id);

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

const deleteUser = async (id) => {
  const existing = await userRepository.findUserByIdRaw(id);

  if (!existing) {
    throw new Error('Usuario no encontrado');
  }

  await userRepository.deleteUser(id);

  return {
    message: 'Usuario eliminado correctamente',
  };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  changeUserPasswordByAdmin,
  deleteUser,
};
