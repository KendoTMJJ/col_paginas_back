const supabase = require('../config/supabase');

const getStatsByCountry = async (paisId) => {
  const [
    { count: noticias_publicadas },
    { count: testimonios_publicados },
    { count: solicitudes_pendientes },
    { count: archivos_total },
  ] = await Promise.all([
    supabase
      .from('noticias')
      .select('id', { count: 'exact', head: true })
      .eq('pais_id', paisId)
      .eq('estado', 'publicado'),
    supabase
      .from('testimonios')
      .select('id', { count: 'exact', head: true })
      .eq('pais_id', paisId)
      .eq('estado', 'publicado'),
    supabase
      .from('solicitudes_contacto')
      .select('id', { count: 'exact', head: true })
      .eq('pais_id', paisId)
      .eq('estado', 'pendiente'),
    supabase
      .from('archivos')
      .select('id', { count: 'exact', head: true })
      .eq('pais_id', paisId),
  ]);

  return {
    noticias_publicadas: noticias_publicadas || 0,
    testimonios_publicados: testimonios_publicados || 0,
    solicitudes_pendientes: solicitudes_pendientes || 0,
    archivos_total: archivos_total || 0,
  };
};

const getGlobalStats = async () => {
  const [
    { count: paises_activos },
    { count: usuarios_activos },
    { count: noticias_publicadas },
    { count: testimonios_publicados },
    { count: solicitudes_pendientes },
    { count: archivos_total },
  ] = await Promise.all([
    supabase
      .from('paises')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'activo'),
    supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'activo'),
    supabase
      .from('noticias')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'publicado'),
    supabase
      .from('testimonios')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'publicado'),
    supabase
      .from('solicitudes_contacto')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'pendiente'),
    supabase
      .from('archivos')
      .select('id', { count: 'exact', head: true }),
  ]);

  return {
    paises_activos: paises_activos || 0,
    usuarios_activos: usuarios_activos || 0,
    noticias_publicadas: noticias_publicadas || 0,
    testimonios_publicados: testimonios_publicados || 0,
    solicitudes_pendientes: solicitudes_pendientes || 0,
    archivos_total: archivos_total || 0,
  };
};

module.exports = {
  getStatsByCountry,
  getGlobalStats,
};
