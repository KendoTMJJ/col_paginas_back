const contactRequestService = require('../services/contactRequestService');
const auditService = require('../services/auditService');

const listRequests = async (req, res) => {
  try {
    const filters = {};

    if (req.query.estado) filters.estado = req.query.estado;
    if (req.query.pais_id) filters.pais_id = req.query.pais_id;

    const requests = await contactRequestService.getRequests(req.user, filters);

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contactRequestService.getRequestById(id, req.user);

    return res.status(200).json(request);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const createPublicRequest = async (req, res) => {
  try {
    const request = await contactRequestService.createPublicRequest(req.body);

    return res.status(201).json({
      message: 'Solicitud enviada correctamente',
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contactRequestService.updateRequestStatus(
      id,
      req.body,
      req.user
    );

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_ESTADO',
      modulo: 'solicitudes_contacto',
      registro_id: id,
      descripcion: `Estado de solicitud cambiado a: ${req.body.estado}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Solicitud actualizada correctamente',
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await contactRequestService.deleteRequest(id, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ELIMINAR',
      modulo: 'solicitudes_contacto',
      registro_id: id,
      descripcion: `Solicitud de contacto eliminada con id: ${id}`,
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
  listRequests,
  getRequest,
  createPublicRequest,
  updateRequestStatus,
  deleteRequest,
};
