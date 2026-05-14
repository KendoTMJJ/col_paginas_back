const userService = require('../services/userService');
const auditService = require('../services/auditService');

const listUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CREAR',
      modulo: 'usuarios',
      registro_id: user.id,
      descripcion: `Usuario creado: ${user.username}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.updateUser(id, req.body);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ACTUALIZAR',
      modulo: 'usuarios',
      registro_id: id,
      descripcion: `Usuario actualizado con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const result = await userService.toggleUserStatus(id, estado);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_ESTADO',
      modulo: 'usuarios',
      registro_id: id,
      descripcion: `Estado de usuario cambiado a: ${estado}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const changeUserPasswordByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.changeUserPasswordByAdmin(id, req.body);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_PASSWORD',
      modulo: 'usuarios',
      registro_id: id,
      descripcion: `Contraseña cambiada por administrador al usuario con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUser(id);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ELIMINAR',
      modulo: 'usuarios',
      registro_id: id,
      descripcion: `Usuario eliminado con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  toggleUserStatus,
  changeUserPasswordByAdmin,
  deleteUser,
};
