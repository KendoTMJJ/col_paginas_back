const auditService = require('../services/auditService');

const listAuditEntries = async (req, res) => {
  try {
    const filters = {};

    if (req.query.modulo) filters.modulo = req.query.modulo;
    if (req.query.usuario_id) filters.usuario_id = req.query.usuario_id;

    const entries = await auditService.getAuditEntries(filters);

    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAuditEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await auditService.getAuditEntryById(id);

    return res.status(200).json(entry);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  listAuditEntries,
  getAuditEntry,
};
