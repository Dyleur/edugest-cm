const communicantsService = require('../services/communicants.service');

const getAll = async (req, res) => {
  try {
    const communicants = await communicantsService.getAll();
    res.json({ success: true, data: communicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll };
