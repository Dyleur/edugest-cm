const parentsService = require('../services/parents.service');

const getEnfants = async (req, res) => {
  try {
    const enfants = await parentsService.getEnfantsByParentId(req.params.idParent);
    res.status(200).json({ success: true, data: enfants });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { getEnfants };
