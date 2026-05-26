const dashboardService = require('../services/dashboardService');

const getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats(req.user);

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStats,
};
