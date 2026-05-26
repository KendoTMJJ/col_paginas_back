const auditRepository = require('../repositories/auditRepository');

const register = async ({ usuario_id, accion, modulo, registro_id, descripcion, ip }) => {
  try {
    await auditRepository.createAuditEntry({
      usuario_id: usuario_id || null,
      accion,
      modulo,
      registro_id: registro_id ? String(registro_id) : null,
      descripcion: descripcion || null,
      ip: ip || null,
    });
  } catch (err) {
    console.error('[Audit] Error al registrar en bitacora_auditoria:', err.message);
  }
};

const getAuditEntries = async (filters = {}) => {
  return await auditRepository.findAllAuditEntries(filters);
};

const getAuditEntryById = async (id) => {
  const entry = await auditRepository.findAuditEntryById(id);

  if (!entry) {
    throw new Error('Registro de auditoría no encontrado');
  }

  return entry;
};

module.exports = {
  register,
  getAuditEntries,
  getAuditEntryById,
};
