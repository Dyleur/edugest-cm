const dashboardService = require('../services/dashboard.service');

const getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
