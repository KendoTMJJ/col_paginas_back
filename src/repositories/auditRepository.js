const supabase = require('../config/supabase');

const createAuditEntry = async (payload) => {
  const { error } = await supabase
    .from('bitacora_auditoria')
    .insert([payload]);

  if (error) throw new Error(error.message);
};

const findAllAuditEntries = async (filters = {}) => {
  let query = supabase
    .from('bitacora_auditoria')
    .select(`
      id,
      accion,
      modulo,
      registro_id,
      descripcion,
      ip,
      created_at,
      usuarios (
        id,
        nombre,
        apellido,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (filters.modulo) {
    query = query.eq('modulo', filters.modulo);
  }

  if (filters.usuario_id) {
    query = query.eq('usuario_id', filters.usuario_id);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data;
};

const findAuditEntryById = async (id) => {
  const { data, error } = await supabase
    .from('bitacora_auditoria')
    .select(`
      id,
      accion,
      modulo,
      registro_id,
      descripcion,
      ip,
      created_at,
      usuarios (
        id,
        nombre,
        apellido,
        email
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

module.exports = {
  createAuditEntry,
  findAllAuditEntries,
  findAuditEntryById,
};
