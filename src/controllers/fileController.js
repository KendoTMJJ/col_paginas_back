const fileService = require('../services/fileService');
const auditService = require('../services/auditService');

const listFiles = async (req, res) => {
  try {
    const files = await fileService.getFiles(req.user);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listPublicFiles = async (req, res) => {
  try {
    const { countrySlug } = req.params;
    const files = await fileService.getPublicFilesByCountry(countrySlug);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await fileService.getFileById(id, req.user);
    return res.status(200).json(file);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const registerFile = async (req, res) => {
  try {
    const file = await fileService.registerFile(req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CREAR',
      modulo: 'archivos',
      registro_id: file.id,
      descripcion: `Archivo registrado: ${file.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json({ message: 'Archivo registrado correctamente', data: file });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se proporcionó ningún archivo' });

    const file = await fileService.uploadFile(req.file, req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'SUBIR_ARCHIVO',
      modulo: 'archivos',
      registro_id: file.data.id,
      descripcion: `Archivo subido a Storage: ${file.data.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json(file);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fileService.updateFile(id, req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ACTUALIZAR',
      modulo: 'archivos',
      registro_id: id,
      descripcion: `Archivo actualizado con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fileService.deleteFile(id, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ELIMINAR',
      modulo: 'archivos',
      registro_id: id,
      descripcion: `Archivo eliminado con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listFiles,
  listPublicFiles,
  getFile,
  registerFile,
  uploadFile,
  updateFile,
  deleteFile,
};