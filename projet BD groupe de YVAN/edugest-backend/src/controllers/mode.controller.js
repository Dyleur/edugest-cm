const { Mode } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const modes = await Mode.findAll({ where: { actif: 1 } });
    res.json({ success: true, data: modes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll };
