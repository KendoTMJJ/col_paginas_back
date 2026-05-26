const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error('El usuario y la contraseña son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) throw new Error('Usuario no encontrado');
  if (user.estado !== 'activo') throw new Error('El usuario se encuentra inactivo');

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) throw new Error('Contraseña incorrecta');

  await authRepository.updateLastAccess(user.id);

  const rol = user.roles?.nombre;
  const pais = user.paises || null;

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, rol, pais_id: user.pais_id },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    message: 'Inicio de sesión exitoso',
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      username: user.username,
      rol,
      pais,
    },
  };
};

const forgotPassword = async ({ identifier }) => {
  if (!identifier) throw new Error('Debe ingresar usuario o correo electrónico');

  const user = await authRepository.findUserByUsernameOrEmail(identifier);
  if (!user) throw new Error('Usuario no encontrado');
  if (user.estado !== 'activo') throw new Error('El usuario se encuentra inactivo');
  if (!user.pregunta_seguridad || !user.respuesta_seguridad_hash) {
    throw new Error('El usuario no tiene configurada una pregunta de seguridad');
  }

  return {
    message: 'Pregunta de seguridad encontrada',
    username: user.username,
    pregunta_seguridad: user.pregunta_seguridad,
  };
};

const resetPassword = async ({ username, respuesta_seguridad, nueva_password }) => {
  if (!username || !respuesta_seguridad || !nueva_password) {
    throw new Error('Usuario, respuesta de seguridad y nueva contraseña son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);
  if (!user) throw new Error('Usuario no encontrado');
  if (user.estado !== 'activo') throw new Error('El usuario se encuentra inactivo');
  if (!user.respuesta_seguridad_hash) throw new Error('El usuario no tiene configurada una respuesta de seguridad');

  const isValidAnswer = await bcrypt.compare(respuesta_seguridad, user.respuesta_seguridad_hash);
  if (!isValidAnswer) throw new Error('La respuesta de seguridad es incorrecta');

  const passwordHash = bcrypt.hashSync(nueva_password, 10);
  await authRepository.updatePassword(user.id, passwordHash);

  return { message: 'Contraseña restaurada correctamente' };
};

const changeOwnPassword = async (userFromToken, { password_actual, nueva_password }) => {
  if (!password_actual || !nueva_password) {
    throw new Error('La contraseña actual y la nueva contraseña son obligatorias');
  }

  const user = await authRepository.findUserByUsername(userFromToken.username);
  if (!user) throw new Error('Usuario no encontrado');

  const isValidPassword = await bcrypt.compare(password_actual, user.password_hash);
  if (!isValidPassword) throw new Error('La contraseña actual es incorrecta');

  const passwordHash = bcrypt.hashSync(nueva_password, 10);
  await authRepository.updatePassword(user.id, passwordHash);

  return { message: 'Contraseña actualizada correctamente' };
};

const updateOwnProfile = async (userFromToken, payload) => {
  const { nombre, apellido, email } = payload;

  if (!nombre && !apellido && !email) {
    throw new Error('Debe proporcionar al menos un campo para actualizar');
  }

  const updatePayload = {};
  if (nombre)   updatePayload.nombre   = nombre;
  if (apellido) updatePayload.apellido = apellido;
  if (email)    updatePayload.email    = email;
  updatePayload.updated_at = new Date().toISOString();

  const updated = await authRepository.updateProfile(userFromToken.id, updatePayload);
  return { message: 'Perfil actualizado correctamente', data: updated };
};

const updateSecurityQuestion = async (userFromToken, payload) => {
  const { pregunta_seguridad, respuesta_seguridad } = payload;

  if (!pregunta_seguridad || !respuesta_seguridad) {
    throw new Error('La pregunta y la respuesta de seguridad son obligatorias');
  }

  const user = await authRepository.findUserByUsername(userFromToken.username);
  if (!user) throw new Error('Usuario no encontrado');

  const respuestaHash = bcrypt.hashSync(respuesta_seguridad, 10);
  await authRepository.updateSecurityQuestion(user.id, pregunta_seguridad, respuestaHash);

  return { message: 'Pregunta de seguridad actualizada correctamente' };
};

const getMySecurityQuestion = async (userFromToken) => {
  const user = await authRepository.findUserByUsername(userFromToken.username);
  if (!user) throw new Error('Usuario no encontrado');
  return { pregunta_seguridad: user.pregunta_seguridad || null };
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  changeOwnPassword,
  updateOwnProfile,
  updateSecurityQuestion,
  getMySecurityQuestion,
};