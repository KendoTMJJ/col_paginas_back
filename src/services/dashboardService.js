const dashboardRepository = require('../repositories/dashboardRepository');

const getStats = async (user) => {
  if (user.rol === 'superadmin') {
    return await dashboardRepository.getGlobalStats();
  }

  return await dashboardRepository.getStatsByCountry(user.pais_id);
};

module.exports = {
  getStats,
};
